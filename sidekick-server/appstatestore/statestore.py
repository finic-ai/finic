from typing import Dict, List, Optional
from models.models import AppConfig, DataConnector
import os
import uuid
from supabase import create_client, Client
from google.oauth2.credentials import Credentials
import json

class StateStore:
    is_self_hosted = None

    def __init__(self): 
        self.is_self_hosted = os.environ.get('IS_SELF_HOSTED')
        # No need to fetch the config and determine tenant if this is a self-hosted instance
        if self.is_self_hosted:
            return
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        self.supabase = create_client(supabase_url, supabase_key)

    def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        # if this is a self hosted instance, return a config with a constant app_id and tenant_id since namespace conflicts aren't an issue
        if self.is_self_hosted:
            return AppConfig(app_id='sidekick', tenant_id="sidekick")
        print(bearer_token)
        response = self.supabase.table('users').select('*').filter('bearer', 'eq', bearer_token).execute()

        for row in response.data:
            if row['bearer'] == bearer_token:
                return AppConfig(app_id=row['app_id'], tenant_id=row['uuid'])
        return None
    
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
            

        

