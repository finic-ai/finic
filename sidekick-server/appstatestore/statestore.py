from typing import Dict, List, Optional
from models.models import AppConfig, DataConnector, ConnectorId, ConnectorStatus, Connection
import os
import uuid
from supabase import create_client, Client
from google.oauth2.credentials import Credentials
import json

class StateStore:
    is_self_hosted = None

    def __init__(self): 
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        self.supabase = create_client(supabase_url, supabase_key)

    def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = self.supabase.table('users').select('*').filter('secret_key', 'eq', bearer_token).execute()
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(app_id=row['app_id'], user_id=row['id'])
        return None
    
    def enable_connector(self, connector_id: ConnectorId, credential: Dict, config: AppConfig) -> ConnectorStatus:
        # Upsert the credential into enabled_connectors
        insert_data = {
            'user_id': config.user_id,
            'connector_id': connector_id,
            'credential': json.dumps(credential)
        }
        self.supabase.table("enabled_connectors").upsert(insert_data).execute()
        return ConnectorStatus(is_enabled=True)

    def get_connector_status(self, connector_id: ConnectorId, config: AppConfig) -> ConnectorStatus:
        response = self.supabase.table('enabled_connectors').select('*').filter(
            'user_id', 
            'eq', 
            config.user_id
        ).filter(
            'connector_id', 
            'eq', 
            connector_id
        ).execute()

        isEnabled = False
        if len(response.data) > 0:
            isEnabled = True
        
        # check the connections table for all connections with the given connector_id and app_id
        response = self.supabase.table('connections').select('*').filter(
            'user_id',
            'eq',
            config.user_id
        ).filter(
            'connector_id',
            'eq',
            connector_id
        ).execute()

        connections: List[Connection] = []
        for row in response.data:
            connections.append(
                Connection(
                    connection_id=row['id'],
                    metadata=row['metadata']
                )
            )
        
        return ConnectorStatus(is_enabled=isEnabled, connections=connections)


    
    def save_credentials(self, config: AppConfig, credential: str, connector: DataConnector):
        # if this is a self hosted instance, return a config with a constant app_id and tenant_id since namespace conflicts aren't an issue
        if self.is_self_hosted:
            return
        insert_data = {
            'user_id': config.tenant_id,
            'connector_id': connector.connector_id,
            'credential': credential
        }
        # check if the credential already exists
        response = self.supabase.table('credentials').select('*').filter(
            'user_id', 
            'eq', 
            config.tenant_id
        ).filter(
            'connector_id', 
            'eq', 
            connector.connector_id
        ).execute()

        existing_credentials = response.data
        if len(existing_credentials) > 0:
            to_upsert = existing_credentials[0]
            to_upsert['credential'] = credential
            print(to_upsert)
            self.supabase.table("credentials").upsert(to_upsert).execute()
        else:
            self.supabase.table("credentials").upsert(insert_data).execute()


    def load_credentials(self, config: AppConfig, connector: DataConnector) -> Optional[str]:
        response = self.supabase.table('credentials').select('*').filter(
            'user_id', 
            'eq', 
            config.tenant_id
        ).filter(
            'connector_id', 
            'eq', 
            connector.connector_id
        ).execute()

        print(config.tenant_id)

        for row in response.data:
            if row['user_id'] == config.tenant_id and row['connector_id'] == connector.connector_id:
                print(row['credential'])
                return row['credential']
        return None
    
  
        

        
            

        

