import requests
import os
import json
from typing import Dict, List, Optional
from models.models import AppConfig, Document, ConnectorId, DocumentConnector, AuthorizationResult, ConnectionFilter
from appstatestore.statestore import StateStore
import base64
from models.api import GetDocumentsResponse
from urllib.parse import urlencode, urlunparse, urlparse, ParseResult



class SharepointConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.sharepoint
    config: AppConfig
    headers: Dict = {}

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(self) -> AuthorizationResult:
        pass

    async def authorize(self, account_id: str, auth_code: Optional[str], metadata: Optional[Dict]) -> AuthorizationResult:
        connector_credentials = StateStore().get_connector_credential(self.connector_id, self.config)
        try: 
            client_id = connector_credentials['client_id']
            client_secret = connector_credentials['client_secret']
            authorization_url = f"https://app.intercom.com/oauth?client_id={client_id}"
            redirect_uri = "https://link.psychic.dev/oauth/redirect"
        except Exception as e:
            raise Exception("Connector is not enabled")
        
        if not auth_code:

            auth_url = f"https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize"
            params = {
                'response_type': 'code',
                'redirect_uri': redirect_uri,
                'client_id': client_id,
                'scope': 'offline_access https://graph.microsoft.com/.default',
                'prompt': 'consent'
            }
            encoded_params = urlencode(params)
            url_parts = urlparse(auth_url)
            auth_url = ParseResult(
                scheme=url_parts.scheme,
                netloc=url_parts.netloc,
                path=url_parts.path,
                params=url_parts.params,
                query=encoded_params,
                fragment=url_parts.fragment
            ).geturl()
            return AuthorizationResult(authorized=False, auth_url=auth_url)

        try:
            # encode in base 64
            headers = {
                "Content-Type": "application/x-www-form-urlencoded", 
            }

            data = {
                'client_id': client_id,
                'scope': 'https://graph.microsoft.com/.default',
                'code': auth_code,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code',
                'client_secret': client_secret,
            }

            print(data)

            response = requests.post(f"https://login.microsoftonline.com/common/oauth2/v2.0/token", headers=headers, data=data)
            print(response)

            creds = response.json()

            creds_string = json.dumps(creds)
            

        except Exception as e:
            print(e)
            raise Exception("Unable to get access token with code")

        
        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={
            }
        )
        return AuthorizationResult(authorized=True, connection=new_connection)
    
    async def get_sections(self) -> List[str]:
        pass


    async def load(self, connection_filter: ConnectionFilter) -> GetDocumentsResponse:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id
        connection = StateStore().load_credentials(self.config, self.connector_id, account_id)
        credential_string = connection.credential
        credential_json = json.loads(credential_string)

        access_token = credential_json.get('access_token')

        print(access_token)

        headers = {
            'Authorization': 'Bearer ' + access_token
        }

        response = requests.get('https://graph.microsoft.com/v1.0/sites?search=*', headers=headers)
        x = response.json()
        print(x)
        root_site_id = ""

        response = requests.get(f'https://graph.microsoft.com/v1.0/sites/{root_site_id}/drives', headers=headers)
        drives = response.json()

        drive_id = drives['value'][0]['id']

        print(drives)





        documents: List[Document] = [Document(
            connector_id=self.connector_id,
            account_id=account_id,
            title= 'Test',
            content= 'This is an example help article. You can edit it by clicking the edit button in the top right corner. You can also add new articles by clicking the "Add Article" button in the top left corner.',
            uri= 'https://www.intercom.com/Help-Article-Example-1d1b1b1b1b1b4c4c4c4c4c4c4c4c4c4c',
        )]

        return GetDocumentsResponse(documents=documents, next_page_cursor=None)





            

    
