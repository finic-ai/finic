from typing import Dict, List, Optional
from models.models import (
    AppConfig, SectionFilter, ConnectorId, ConnectorStatus, Connection, ConnectionFilter, Sync, SyncResults, Settings
)
import os
from dateutil.parser import parse
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
    
    def get_link_settings(self, config: AppConfig) -> Optional[Settings]:
        response = self.supabase.table('settings').select('*').filter('app_id', 'eq', config.app_id).execute()
        if len(response.data) > 0:
            row = response.data[0]
            return Settings(
                name=row['name'],
                logo=row['logo'],
                whitelabel=row['whitelabel'],
                custom_auth_url=row['custom_auth_url'],
                enabled_connectors=row['enabled_connectors']
            )
        return None
    
    def enable_connector(self, connector_id: ConnectorId, credential: Dict, config: AppConfig) -> ConnectorStatus:
        # Upsert the credential into enabled_connectors
        insert_data = {
            'app_id': config.app_id,
            'user_id': config.user_id,
            'connector_id': connector_id,
            'credential': json.dumps(credential)
        }
        self.supabase.table("enabled_connectors").upsert(insert_data).execute()
        return ConnectorStatus(is_enabled=True)

    def get_connector_status(self, connector_id: ConnectorId, config: AppConfig) -> ConnectorStatus:
        response = self.supabase.table('enabled_connectors').select('*').filter(
            'app_id', 
            'eq', 
            config.app_id
        ).filter(
            'connector_id', 
            'eq', 
            connector_id
        ).execute()

        custom_credentials = None
        is_enabled = False
        if len(response.data) > 0:
            is_enabled = True
            custom_credentials = json.loads(response.data[0]['credential'])
        
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
                    account_id=row['account_id'],
                    connector_id=row['connector_id'],
                    metadata=row['metadata']
                )
            )
        
        return ConnectorStatus(is_enabled=is_enabled, custom_credentials=custom_credentials, connections=connections)
    
    def get_connections(self, filter: ConnectionFilter, config: AppConfig) -> List[Connection]:
        query = self.supabase.table('connections').select('*').filter(
            'app_id',
            'eq',
            config.app_id
        )

        if filter.connector_id is not None:
            query = query.filter('connector_id', 'eq', filter.connector_id)
        
        if filter.account_id is not None:
            query = query.filter('account_id', 'eq', filter.account_id)

        response = query.execute()

        connections: List[Connection] = []
        # Sort connections by when they were created
        for row in sorted(response.data, key=lambda x: parse(x['created_at']), reverse=True):
            connections.append(
                Connection(
                    account_id=row['account_id'],
                    connector_id=row['connector_id'],
                    metadata=row['metadata'],
                    section_filters=row['section_filters']
                )
            )
        
        return connections
    
    def get_connector_credential(self, connector_id: ConnectorId, config: AppConfig) -> Optional[Dict]:
        response = self.supabase.table('enabled_connectors').select('*').filter(
            'app_id', 
            'eq', 
            config.app_id
        ).filter(
            'connector_id', 
            'eq', 
            connector_id
        ).execute()


        if len(response.data) > 0:
            return json.loads(response.data[0]['credential'])
        
        # If no credentials are defined in enabled_connectors, use the default ones
        response = self.supabase.table('connectors').select('*').filter(
            'id',
            'eq',
            connector_id
        ).execute()

        if len(response.data) > 0:
            return json.loads(response.data[0]['default_credentials'])

        return None
    
    def add_connection(self, 
                       config: AppConfig, 
                       credential: str, 
                       connector_id: ConnectorId, 
                       account_id: str, 
                       metadata: Dict) -> Connection:
        insert_data = {
            'account_id': account_id,
            'user_id': config.user_id,
            'app_id': config.app_id,
            'connector_id': connector_id,
            'credential': credential,
            'metadata': metadata
        }
        print(insert_data)
        self.supabase.table("connections").upsert(insert_data).execute()

        return Connection(
            account_id=account_id,
            connector_id=connector_id,
            metadata=metadata
        )

    def load_credentials(self, config: AppConfig, connector_id: ConnectorId, account_id: str) -> Optional[Connection]:
        response = self.supabase.table('connections').select('*').filter(
            'app_id', 
            'eq', 
            config.app_id
        ).filter(
            'connector_id', 
            'eq', 
            connector_id
        ).filter(
            'account_id',
            'eq',
            account_id
        ).execute()

        if len(response.data) > 0:
            data = response.data[0]
            return Connection(
                account_id=account_id,
                connector_id=connector_id,
                metadata=data['metadata'],
                credential=data['credential'],
                config=AppConfig(app_id=data['app_id'], user_id=data['user_id'])
            )   
        raise Exception("No credentials found for connector_id: " + connector_id + " and account_id: " + account_id)
    
    def get_syncs(self, app_id_filter: Optional[str]) -> List[Sync]:
        query = self.supabase.table('syncs').select('*')

        if app_id_filter is not None:
            query = query.filter('app_id', 'eq', app_id_filter)

        response = query.execute()
        syncs: List[Sync] = []
        for row in response.data:
            syncs.append(
                Sync(
                    app_id=row['app_id'],
                    webhook_url=row['webhook_url'],
                )
            )
        return syncs

    def save_sync_results(self, sync: Sync, results: SyncResults):

        self.supabase.table('syncs').update({'results': results.dict()}).filter(
            'app_id',
            'eq',
            sync.app_id
        ).execute()

    def update_section_filters(
            self, 
            config: AppConfig, 
            connector_id: ConnectorId, 
            account_id: str, 
            filters: List[SectionFilter]
        ):
        # Get the existing filters

        insert_data = {
            'account_id': account_id,
            'app_id': config.app_id,
            'connector_id': connector_id,
            'section_filters': [filter.dict() for filter in filters]
        }
        self.supabase.table("connections").upsert(insert_data).execute()

    def update_connection_metadata(self, config: AppConfig, connector_id: ConnectorId, account_id: str, metadata: Dict) -> Connection:
        # Get the existing filters

        insert_data = {
            'account_id': account_id,
            'app_id': config.app_id,
            'connector_id': connector_id,
            'metadata': metadata
        }
        self.supabase.table("connections").upsert(insert_data).execute()

        return Connection(
            account_id=account_id,
            connector_id=connector_id,
            metadata=metadata
        )

  
        

        
            

        

