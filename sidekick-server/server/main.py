import os
import uvicorn
import uuid
import pdb
from fastapi import FastAPI, File, HTTPException, Depends, Body, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlparse

from models.api import (
    QueryRequest,
    QueryResponse,
    UpsertResponse,
    UpsertWebDataRequest,
    UpsertGoogleDocsRequest,
    LLMResponse,
    AskLLMRequest,
    UpsertRequest,
    UpsertOAuthResponse
)

from llm.LLM import LLM
from connectors.google_docs_connector import GoogleDocsConnector
from connectors.web_connector import WebConnector
from chunkers.html_chunker import HTMLChunker
from chunkers.default_chunker import DefaultChunker

from appstatestore.statestore import StateStore
from models.models import (
    Source,
    AppConfig,
    DocumentChunk,
    DocumentChunkMetadata,
    DocumentMetadata
)
import uuid

from datastore.factory import get_datastore


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the list of allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/.well-known", StaticFiles(directory=".well-known"), name="static")

# Create a sub-application, in order to access just the query endpoint in an OpenAPI schema, found at http://0.0.0.0:8000/sub/openapi.json when the app is running locally
sub_app = FastAPI(
    title="Retrieval Plugin API",
    description="A retrieval API for querying and filtering documents based on natural language queries and metadata",
    version="1.0.0",
    servers=[{"url": "https://your-app-url.com"}],
)
app.mount("/sub", sub_app)

bearer_scheme = HTTPBearer()
BEARER_TOKEN = os.environ.get("BEARER_TOKEN")
assert BEARER_TOKEN is not None


def validate_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    app_config = StateStore().get_config(credentials.credentials)
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return app_config


@app.post(
    "/upsert-google-docs",
    response_model=UpsertOAuthResponse,
)
async def upsert_google_docs(
    request: UpsertGoogleDocsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    folder_name = request.folder_name
    auth_code = request.auth_code
    source_id = str(uuid.uuid5(uuid.NAMESPACE_URL, request.folder_name))

    try:
        google_connector = GoogleDocsConnector(config, folder_name, auth_code)
        if auth_code is None:
            auth_url = await google_connector.authorize()
            return UpsertOAuthResponse(auth_url=auth_url)
        else: 
            await google_connector.authorize()
            documents = await google_connector.load(source_id=source_id)
            chunker = DefaultChunker()
            chunks = []
            for doc in documents:
                chunks.extend(chunker.chunk(source_id, doc, 1000))

            ids = await datastore.upsert(chunks, tenant_id=config.tenant_id)
            return UpsertOAuthResponse(ids=ids)

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"str({e})")

    

@app.post(
    "/upsert-web-data",
    response_model=UpsertResponse,
)
async def upsert_web_data(
    request: UpsertWebDataRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    url = request.url
    parsed_url = urlparse(url)
    if parsed_url.scheme not in ["http", "https"]:
        print("Error:", "Invalid URL")
        raise HTTPException(status_code=400, detail="Invalid URL")
    try:
        web_connector = WebConnector(config, url)
        html_chunker = HTMLChunker()
        source_id = str(uuid.uuid5(uuid.NAMESPACE_URL, url))
        documents = await web_connector.load(source_id=source_id)
        chunks = []
        
        for doc in documents:
            chunks.extend(html_chunker.chunk(source_id, doc, 500))

        ids = await datastore.upsert(chunks, tenant_id=config.tenant_id)
        return UpsertResponse(ids=ids)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"str({e})")

@app.post(
    "/upsert-documents",
    response_model=UpsertResponse,
)
async def upsert_documents(
    request: UpsertRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    documents = request.documents
    try:
        chunker = DefaultChunker()
        chunks = []
        source_id = str(uuid.uuid5(uuid.NAMESPACE_URL, documents[0].url))
        for doc in documents:
            doc.metadata = DocumentMetadata(
                document_id=str(uuid.uuid4()),
                tenant_id=config.tenant_id,
                source_id=source_id,
            )
            chunks.extend(chunker.chunk(source_id, doc, 1000))

        ids = await datastore.upsert(chunks, tenant_id=config.tenant_id)
        return UpsertResponse(ids=ids)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"str({e})")


@app.post(
    "/ask-llm",
    response_model=LLMResponse,
)
async def ask_llm(
    request: AskLLMRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        query_results = await datastore.query(
            request.queries,
            tenant_id=config.tenant_id,
        )
        print(query_results)
        results = await LLM().ask_llm(query_results, request.possible_intents)
        return LLMResponse(results=results)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"str({e})")

@app.post(
    "/query",
    response_model=QueryResponse,
)
async def query_main(
    request: QueryRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        results = await datastore.query(
            request.queries,
            tenant_id=config.tenant_id,
        )
        return QueryResponse(results=results)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


@sub_app.post(
    "/query",
    response_model=QueryResponse,
    # NOTE: We are describing the the shape of the API endpoint input due to a current limitation in parsing arrays of objects from OpenAPI schemas. This will not be necessary in future.
    description="Accepts search query objects array each with query and optional filter. Break down complex questions into sub-questions. Refine results by criteria, e.g. time / source, don't do this often. Split queries if ResponseTooLargeError occurs.",
)
async def query(
    request: QueryRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        results = await datastore.query(
            request.queries,
            tenant_id=config.tenant_id,
        )
        return QueryResponse(results=results)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


@app.on_event("startup")
async def startup():
    global datastore
    datastore = await get_datastore()


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
