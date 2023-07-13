import os
import uvicorn
import uuid
import pdb
from fastapi import FastAPI, File, HTTPException, Depends, Body, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlparse
from services.sync_service import SyncService
from services.question_service import QuestionService
from logger import Logger, Event

from models.api import (
    AuthorizationResponse,
    AuthorizeOauthRequest,
    EnableConnectorRequest,
    ConnectorStatusRequest,
    ConnectorStatusResponse,
    GetDocumentsRequest,
    GetDocumentsResponse,
    AuthorizeApiKeyRequest,
    GetConnectionsRequest,
    GetConnectionsResponse,
    GetConversationsRequest,
    GetConversationsResponse,
    RunSyncRequest,
    RunSyncResponse,
    AskQuestionRequest,
    AskQuestionResponse,
    GetLinkSettingsResponse,
    AddSectionFilterRequest,
    AddSectionFilterResponse,
    UpdateConnectionMetadataRequest,
    UpdateConnectionMetadataResponse,
    DeleteConnectionRequest,
    DeleteConnectionResponse,
    GetTicketsRequest,
    GetTicketsResponse,
)

from appstatestore.statestore import StateStore
from models.models import AppConfig, ConnectionFilter, ConnectorId
from connectors.connector_utils import (
    get_connector_for_id,
    get_conversation_connector_for_id,
    get_document_connector_for_id,
    get_ticket_connector_for_id,
)
import uuid
from logger import Logger
from chunker.chunker import DocumentChunker

logger = Logger()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the list of allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer_scheme = HTTPBearer()


def validate_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        app_config = StateStore().get_config(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or missing secret key")
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing secret key")
    return app_config


def validate_public_key(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    try:
        app_config = StateStore().get_config_from_public_key(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or missing public key")
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing public key")
    return app_config


@app.post(
    "/set-custom-connector-credentials",
    response_model=ConnectorStatusResponse,
)
async def enable_connector(
    request: EnableConnectorRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        connector_id = request.connector_id
        credential = request.credential
        custom_config = request.custom_config
        status = StateStore().enable_connector(connector_id, credential, config)
        if custom_config:
            StateStore().update_connector_custom_config(connector_id, config, custom_config)
        response = ConnectorStatusResponse(status=status)
        logger.log_api_call(
            config, Event.set_custom_connector_credentials, request, response, None
        )
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(
            config, Event.set_custom_connector_credentials, request, None, e
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-connector-status",
    response_model=ConnectorStatusResponse,
)
async def get_connector_status(
    request: ConnectorStatusRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        connector_id = request.connector_id
        status = StateStore().get_connector_status(connector_id, config)
        response = ConnectorStatusResponse(status=status)
        logger.log_api_call(config, Event.get_connector_status, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.get_connector_status, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/get-link-settings",
    response_model=GetLinkSettingsResponse,
)
async def get_link_settings(
    config: AppConfig = Depends(validate_public_key),
):
    try:
        settings = StateStore().get_link_settings(config)
        response = GetLinkSettingsResponse(settings=settings)
        logger.log_api_call(config, Event.get_link_settings, None, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.get_link_settings, None, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-connections",
    response_model=GetConnectionsResponse,
)
async def get_connections(
    request: GetConnectionsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        filter = request.filter
        connections = StateStore().get_connections(filter, config)
        for connection in connections:
            connection.sections = []
            connector = get_connector_for_id(connection.connector_id, config)
            if connector is not None:
                connection.sections = await connector.get_sections(
                    connection.account_id
                )

        response = GetConnectionsResponse(connections=connections)
        logger.log_api_call(config, Event.get_connections, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.get_connections, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/delete-connection",
    response_model=DeleteConnectionResponse,
)
async def delete_connections(
    request: DeleteConnectionRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        result = StateStore().delete_connection(
            config, request.connector_id, request.account_id
        )
        print(result)
        if len(result.data) > 0:
            response = DeleteConnectionResponse(success=True)
        else:
            raise HTTPException(
                status_code=404,
                detail="No connection found with this connector_id and account_id",
            )
        logger.log_api_call(config, Event.delete_connection, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.delete_connection, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/add-section-filter",
    response_model=AddSectionFilterResponse,
)
async def add_section_filter(
    request: AddSectionFilterRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        connector_id = request.connector_id
        account_id = request.account_id
        filter = request.section_filter
        for section in filter.sections:
            section.children = None
        connections = StateStore().get_connections(
            ConnectionFilter(connector_id=connector_id, account_id=account_id), config
        )
        if len(connections) == 0:
            raise HTTPException(status_code=404, detail="Connection not found")
        connection = connections[0]
        section_filters = connection.section_filters
        if section_filters is None:
            section_filters = []
        for i in range(len(section_filters)):
            existing_filter = section_filters[i]
            if existing_filter.id == filter.id:
                # remove existing filter
                section_filters.remove(existing_filter)
        section_filters.append(filter)
        StateStore().update_section_filters(
            config,
            connector_id=connector_id,
            account_id=account_id,
            filters=section_filters,
        )
        response = AddSectionFilterResponse(success=True, section_filter=filter)
        logger.log_api_call(config, Event.add_section_filter, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.add_section_filter, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/add-section-filter-public",
    response_model=AddSectionFilterResponse,
)
async def add_section_filter_public(
    request: AddSectionFilterRequest = Body(...),
    config: AppConfig = Depends(validate_public_key),
):
    try:
        connector_id = request.connector_id
        account_id = request.account_id
        filter = request.section_filter
        connection = StateStore().load_credentials(
            config, connector_id=connector_id, account_id=account_id
        )
        section_filters = connection.section_filters
        if section_filters is None:
            section_filters = []
        for i in range(len(section_filters)):
            existing_filter = section_filters[i]
            if existing_filter.id == filter.id:
                # remove existing filter
                section_filters.remove(existing_filter)
        section_filters.append(filter)
        StateStore().update_section_filters(
            config,
            connector_id=connector_id,
            account_id=account_id,
            filters=section_filters,
        )
        if connection.new_credential is not None:
            StateStore().add_connection(
                config,
                connection.new_credential,
                connection.connector_id,
                connection.account_id,
                connection.metadata,
                None,
            )
        response = AddSectionFilterResponse(success=True, section_filter=filter)
        logger.log_api_call(config, Event.add_section_filter, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.add_section_filter, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/add-apikey-connection",
    response_model=AuthorizationResponse,
)
async def add_apikey_connection(
    request: AuthorizeApiKeyRequest = Body(...),
    config: AppConfig = Depends(validate_public_key),
):
    try:
        connector_id = request.connector_id
        account_id = request.account_id
        credential = request.credential
        metadata = request.metadata

        connector = get_connector_for_id(connector_id, config)

        if connector is None:
            raise Exception("Connector not found")
        result = await connector.authorize_api_key(account_id, credential, metadata)
        response = AuthorizationResponse(result=result)
        logger.log_api_call(
            config, Event.add_apikey_connection, request, response, None
        )
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.add_apikey_connection, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/add-oauth-connection",
    response_model=AuthorizationResponse,
)
async def add_oauth_connection(
    request: AuthorizeOauthRequest = Body(...),
    config: AppConfig = Depends(validate_public_key),
):
    try:
        auth_code = request.auth_code or None
        connector_id = request.connector_id
        account_id = request.account_id
        metadata = request.metadata
        connector = get_connector_for_id(connector_id, config)

        if connector is None:
            raise Exception("Connector not found")

        result = await connector.authorize(account_id, auth_code, metadata)
        response = AuthorizationResponse(result=result)
        logger.log_api_call(config, Event.add_oauth_connection, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.add_oauth_connection, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/update-connection-metadata",
    response_model=UpdateConnectionMetadataResponse,
)
async def update_connection_metadata(
    request: UpdateConnectionMetadataRequest = Body(...),
    config: AppConfig = Depends(validate_public_key),
):
    try:
        connector_id = request.connector_id
        account_id = request.account_id
        metadata = request.metadata

        StateStore().update_connection_metadata(
            config, connector_id, account_id, metadata
        )

        # await connector.update_metadata(account_id, metadata)
        response = UpdateConnectionMetadataResponse(success=True)
        logger.log_api_call(
            config, Event.update_connection_metadata, request, response, None
        )
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.update_connection_metadata, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-documents",
    response_model=GetDocumentsResponse,
)
async def get_documents(
    request: GetDocumentsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    # TODO: Add limits to documents returned
    try:
        account_id = request.account_id
        uris = request.uris
        # If connector_id is not provided, return documents from all connectors
        if not request.connector_id:
            connections = StateStore().get_connections(
                ConnectionFilter(account_id=account_id), config
            )
            if len(connections) == 0:
                raise HTTPException(
                    status_code=404, detail="No connections found for this Account"
                )
            connector_ids = [connection.connector_id for connection in connections]
        else:
            connector_ids = [request.connector_id]

        chunked = request.chunked
        min_chunk_size = request.min_chunk_size
        max_chunk_size = request.max_chunk_size

        documents = []

        for connector_id in connector_ids:
            connector = get_document_connector_for_id(connector_id, config)
            if connector is None:
                continue

            result = await connector.load(
                ConnectionFilter(
                    connector_id=connector_id,
                    account_id=account_id,
                    uris=uris,
                    section_filter_id=request.section_filter,
                    page_cursor=request.page_cursor,
                    page_size=request.page_size,
                )
            )
            if chunked and connector_id != ConnectorId.notion:
                raise HTTPException(
                    status_code=400, detail="Chunking is only supported for Notion"
                )
            elif chunked:
                chunker = DocumentChunker(
                    min_chunk_size=min_chunk_size, max_chunk_size=max_chunk_size
                )
                result = GetDocumentsResponse(
                    documents=chunker.chunk(result.documents),
                    next_cursor=result.next_page_cursor,
                )
            documents.extend(result.documents)
        response = result
        response.documents = documents
        logger.log_api_call(config, Event.get_documents, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.get_documents, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-tickets",
    response_model=GetTicketsResponse,
)
async def get_tickets(
    request: GetTicketsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        account_id = request.account_id
        # If connector_id is not provided, return documents from all connectors
        if not request.connector_id:
            connections = StateStore().get_connections(
                ConnectionFilter(account_id=account_id), config
            )
            if len(connections) == 0:
                raise HTTPException(
                    status_code=404, detail="No connections found for this Account"
                )
            connector_ids = [connection.connector_id for connection in connections]
        else:
            connector_ids = [request.connector_id]

        tickets = []

        for connector_id in connector_ids:
            connector = get_ticket_connector_for_id(connector_id, config)
            if connector is None:
                continue

            result = await connector.load_tickets(
                ConnectionFilter(
                    connector_id=connector_id,
                    account_id=account_id,
                    page_cursor=request.page_cursor,
                    page_size=request.page_size,
                ),
                redact_pii=request.redact_pii,
            )
            tickets.extend(result.tickets)
        response = result
        response.tickets = tickets
        logger.log_api_call(config, Event.get_tickets, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.get_tickets, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-conversations",
    response_model=GetConversationsResponse,
)
async def get_conversations(
    request: GetConversationsRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    # TODO: Add limits to conversations returned
    try:
        connector_id = request.connector_id
        account_id = request.account_id
        oldest_message_timestamp = request.oldest_message_timestamp
        page_cursor = request.page_cursor

        connector = get_conversation_connector_for_id(connector_id, config)

        if connector is None:
            raise HTTPException(status_code=404, detail="Connector not found")

        response = await connector.load_messages(
            account_id,
            oldest_message_timestamp=oldest_message_timestamp,
            page_cursor=page_cursor,
        )
        logger.log_api_call(config, Event.get_conversations, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.get_conversations, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/run-sync",
    response_model=RunSyncResponse,
)
async def run_sync(
    request: RunSyncRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        sync_all = request.sync_all
        success = await SyncService(config).run(sync_all=sync_all)
        response = RunSyncResponse(success=success)
        logger.log_api_call(config, Event.run_sync, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.run_sync, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/ask-question",
    response_model=AskQuestionResponse,
)
async def run_sync(
    request: AskQuestionRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        # If connector_id is empty, we will use documents from all connectors
        if not request.connector_ids:
            connections = StateStore().get_connections(
                ConnectionFilter(account_id=request.account_id), config
            )
        else:
            connections = []
            for connector_id in request.connector_ids:
                connections.extend(
                    StateStore().get_connections(
                        ConnectionFilter(
                            connector_id=connector_id, account_id=request.account_id
                        ),
                        config,
                    )
                )

        result = await QuestionService(config, request.openai_api_key).ask(
            request.question, connections
        )
        response = AskQuestionResponse(answer=result.answer, sources=result.sources)
        logger.log_api_call(config, Event.ask_question, request, response, None)
        return response
    except Exception as e:
        print(e)
        logger.log_api_call(config, Event.ask_question, request, None, e)
        raise HTTPException(status_code=500, detail=str(e))


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
