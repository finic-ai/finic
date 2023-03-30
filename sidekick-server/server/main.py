import os
import uvicorn
from fastapi import FastAPI, File, HTTPException, Depends, Body, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles

from models.api import (
    QueryRequest,
    QueryResponse,
    UpsertResponse,
    UpsertWebDataRequest,
    LLMResponse,
    AskLLMRequest,
)

from llm.LLM import LLM

from connectors.web_connector.load import load_data


from app_config import app_config
from models.models import (
    AppConfig,
    DocumentChunk
)

from datastore.factory import get_datastore


app = FastAPI()
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
    keys = list(app_config.keys())
    if credentials.scheme != "Bearer" or credentials.credentials not in keys:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return AppConfig.parse_obj(app_config[credentials.credentials])


@app.post(
    "/upsert-web-data",
    response_model=UpsertResponse,
)
async def upsert_web_data(
    request: UpsertWebDataRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    url = request.url
    chunks = await load_data(url, config=config)  

    try:
        ids = await datastore.upsert(chunks, product=config.product_id)
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
            product=config.product_id,
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
            product=config.product_id,
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
            product=config.product_id,
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
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
