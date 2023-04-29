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
    AuthorizeGoogleDriveRequest,
    UpsertGoogleDocsRequest,
    AuthorizeGoogleDriveResponse,
    OauthResponse,
    LLMResponse,
    AskLLMRequest,
    UpsertRequest,
    AuthorizeResponse,
    AuthorizeWithApiKeyRequest,
    UpsertFromConnectorRequest,
    SelectVectorstoreRequest,
    SelectVectorstoreResponse,
    AuthorizeOauthRequest
)

from llm.LLM import LLM
from connectors.google_docs_connector import GoogleDocsConnector
from connectors.web_connector import WebConnector
from connectors.website_connector import WebsiteConnector
from chunkers.html_chunker import HTMLChunker
from chunkers.default_chunker import DefaultChunker

from appstatestore.statestore import StateStore
from models.models import (
    Source,
    AppConfig,
    DocumentChunk,
    DataConnector,
    DocumentMetadata
)
from connectors.connector_utils import get_connector_for_id
import uuid
from logger import Logger

from datastore.factory import get_datastore, update_vectorstore


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
    print('config', app_config)
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return app_config


@app.post(
    "/select-vectorstore",
    response_model=SelectVectorstoreResponse,
)
async def select_vectorstore(
    request: SelectVectorstoreRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        
        update_vectorstore(config, request.vectorstore, request.credentials)
        
        return SelectVectorstoreResponse(success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")

@app.post(
    "/authorize-with-api-key",
    response_model=AuthorizeResponse,
)
async def authorize_with_api_key(
    request: AuthorizeWithApiKeyRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        api_key = request.api_key
        connector_id = request.connector_id
        subdomain = request.subdomain
        email = request.email

        connector = get_connector_for_id(connector_id, config)

        if connector is None:
            raise HTTPException(status_code=404, detail="Connector not found")
        
        auth_result = await connector.authorize(api_key, subdomain, email)
        
        return AuthorizeResponse(authorized=auth_result.authorized)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")


@app.post(
    "/authorize-oauth",
    response_model=OauthResponse,
)
async def authorize_oauth(
    request: AuthorizeOauthRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    auth_code = request.auth_code
    redirect_uri = request.redirect_uri
    connector_id = request.connector_id

    connector = get_connector_for_id(connector_id, config)

    print("connector", connector)

    if connector is None:
        raise HTTPException(status_code=404, detail="Connector not found")

    auth_url = await connector.authorize(redirect_uri, auth_code)
    return OauthResponse(auth_url=auth_url, authorized=auth_url is None)


@app.post(
    "/authorize-google-drive",
    response_model=AuthorizeGoogleDriveResponse,
)
async def authorize_google_drive(
    request: AuthorizeGoogleDriveRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    auth_code = request.auth_code
    redirect_uri = request.redirect_uri
    google_connector = GoogleDocsConnector(config, "")
    auth_url = await google_connector.authorize(redirect_uri, auth_code)
    return AuthorizeGoogleDriveResponse(auth_url=auth_url, authorized=auth_url is None)


@app.post(
    "/upsert-from-connector",
    response_model=UpsertResponse,
)
async def upsert_from_connector(
    request: UpsertFromConnectorRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    logger = Logger(config)
    datastore = get_datastore(config=config)
    if request.path is None:
        source_id = str(uuid.uuid5(uuid.NAMESPACE_URL, str(request.connector_id)))
    else:
        source_id = str(uuid.uuid5(uuid.NAMESPACE_URL, request.path))

    try:
        path = request.path or ""
        connector = get_connector_for_id(request.connector_id, config, path)

        documents = await connector.load(source_id=source_id)
        chunker = DefaultChunker()
        chunks = []
        for doc in documents:
            chunks.extend(chunker.chunk(source_id, doc, 1000))

        ids = await datastore.upsert(chunks, tenant_id=config.tenant_id, source_type=connector.source_type)
        logger.log_upsert_data(
            connector=request.connector_id,
            chunks=len(ids),
            error=False
        )
        return UpsertResponse(ids=ids)

    except Exception as e:
        print("Error:", e)
        logger.log_upsert_data(
            connector=request.connector_id,
            chunks=0,
            error=True
        )
        raise HTTPException(status_code=500, detail=f"{e}")

@app.post(
    "/upsert-google-docs",
    response_model=UpsertResponse,
)
async def upsert_google_docs(
    request: UpsertGoogleDocsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    folder_name = request.folder_name
    source_id = str(uuid.uuid5(uuid.NAMESPACE_URL, request.folder_name))
    logger = Logger(config)
    datastore = get_datastore(config=config)

    try:
        google_connector = GoogleDocsConnector(config, folder_name)

        documents = await google_connector.load(source_id=source_id)
        chunker = DefaultChunker()
        chunks = []
        for doc in documents:
            chunks.extend(chunker.chunk(source_id, doc, 1000))

        ids = await datastore.upsert(chunks, tenant_id=config.tenant_id, source_type=google_connector.source_type)
        logger.log_upsert_data(
            connector=google_connector.connector_id,
            chunks=len(ids),
            error=False
        )
        return UpsertResponse(ids=ids)

    except Exception as e:
        print("Error:", e)
        logger.log_upsert_data(
            connector=google_connector.connector_id,
            chunks=0,
            error=True
        )
        raise HTTPException(status_code=500, detail=f"{e}")


@app.post(
    "/upsert-web-data",
    response_model=UpsertResponse,
)
async def upsert_web_data(
    request: UpsertWebDataRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    logger = Logger(config)
    datastore = get_datastore(config=config)
    web_connector = WebsiteConnector(
        config=config, 
        urls=request.urls, 
        css_selector=request.css_selector 
    )
    try:
        html_chunker = HTMLChunker()
        source_id = str(uuid.uuid5(uuid.NAMESPACE_URL, Source.web.value))
        documents = await web_connector.load(source_id=source_id)
        chunks = []
        
        for doc in documents:
            chunks.extend(html_chunker.chunk(source_id, doc, 500))

        ids = await datastore.upsert(chunks, tenant_id=config.tenant_id, source_type=web_connector.source_type)
        logger.log_upsert_data(
            connector= web_connector.connector_id,
            chunks=len(ids),
            error=False
        )
        return UpsertResponse(ids=ids)
    except Exception as e:
        print("Error:", e)
        logger.log_upsert_data(
            connector= web_connector.connector_id,
            chunks=0,
            error=True
        )
        raise HTTPException(status_code=500, detail=f"{e}")

@app.post(
    "/upsert-documents",
    response_model=UpsertResponse,
)
async def upsert_documents(
    request: UpsertRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    documents = request.documents
    datastore = get_datastore(config=config)
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

        ids = await datastore.upsert(chunks, tenant_id=config.tenant_id, source_type=Source.web)
        return UpsertResponse(ids=ids)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"{e}")


@app.post(
    "/ask-llm",
    response_model=LLMResponse,
)
async def ask_llm(
    request: AskLLMRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    logger = Logger(config)
    datastore = get_datastore(config=config)
    try:
        query_results = await datastore.query(
            request.queries,
            tenant_id=config.tenant_id,
        )
        print(query_results)
        results = await LLM().ask_llm(query_results, request.possible_intents)
        logger.log_ask_llm(
            query=str(request.queries),
            response=str(results),
            error=False
        )
        return LLMResponse(results=results)
    except Exception as e:
        print("Error:", e)
        logger.log_ask_llm(
            query=str(request.queries),
            response="",
            error=True
        )
        raise HTTPException(status_code=500, detail=f"{e}")

@app.post(
    "/query",
    response_model=QueryResponse,
)
async def query_main(
    request: QueryRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    logger = Logger(config)
    datastore = get_datastore(config=config)
    try:
        results = await datastore.query(
            request.queries,
            tenant_id=config.tenant_id,
        )
        logger.log_query(
            query=str(request.queries),
            response=str(results),
            error=False
        )
        return QueryResponse(results=results)
    except Exception as e:
        print("Error:", e)
        logger.log_query(
            query=str(request.queries),
            response="",
            error=True
        )
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
    datastore = get_datastore(config=config)
    try:
        results = await datastore.query(
            request.queries,
            tenant_id=config.tenant_id,
        )
        return QueryResponse(results=results)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


# @app.on_event("startup")
# async def startup():
#     global datastore
#     datastore = get_datastore()
    


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
