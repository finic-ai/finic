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
    
    def get_config_from_public_key(self, bearer_token: str) -> Optional[AppConfig]:
        response = self.supabase.table('users').select('*').filter('app_id', 'eq', bearer_token).execute()
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
    
    def get_connector_credential(self, connector_id: ConnectorId, config: AppConfig) -> Optional[Dict]:
        response = self.supabase.table('enabled_connectors').select('*').filter(
            'user_id', 
            'eq', 
            config.user_id
        ).filter(
            'connector_id', 
            'eq', 
            connector_id
        ).execute()

        if len(response.data) > 0:
            return json.loads(response.data[0]['credential'])
        return None
    
    def add_connection(self, 
                       config: AppConfig, 
                       credential: str, 
                       connector_id: ConnectorId, 
                       connection_id: str, 
                       metadata: Dict) -> Connection:
        insert_data = {
            'id': connection_id,
            'user_id': config.user_id,
            'app_id': config.app_id,
            'connector_id': connector_id,
            'credential': credential,
            'metadata': metadata
        }
        print(insert_data)
        self.supabase.table("connections").upsert(insert_data).execute()

        return Connection(
            connection_id=connection_id,
            metadata=metadata
        )

    def load_credentials(self, config: AppConfig, connector_id: ConnectorId, connection_id: str) -> Optional[str]:
        response = self.supabase.table('connections').select('*').filter(
            'user_id', 
            'eq', 
            config.user_id
        ).filter(
            'connector_id', 
            'eq', 
            connector_id
        ).filter(
            'id',
            'eq',
            connection_id
        ).execute()

        if len(response.data) > 0:
            data = response.data[0]
            return data['credential']
        return None
    
  
        

        
            

        

