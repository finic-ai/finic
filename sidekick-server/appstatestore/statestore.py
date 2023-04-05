from typing import Dict, List, Optional
from models.models import AppConfig
import os
import uuid
from supabase import create_client, Client
from google.oauth2.credentials import Credentials

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
        response = self.supabase.table('users').select('*').filter('bearer', 'eq', bearer_token).execute()

        for row in response.data:
            if row['bearer'] == bearer_token:
                return AppConfig(app_id=row['app_id'], tenant_id=row['uuid'])
        return None
    
    def save_gdrive_credentials(self, config: AppConfig, credentials: Credentials):
        # if this is a self hosted instance, return a config with a constant app_id and tenant_id since namespace conflicts aren't an issue
        if self.is_self_hosted:
            return
        response = self.supabase.table('app_config').select('*').filter('app_id', 'eq', config.app_id).execute()
        for row in response.data:
            if row['app_id'] == config.app_id:
                self.supabase.table('app_config').update({'gdrive_credentials': credentials}).match({'id': row['id']}).execute()
                return
        self.supabase.table('app_config').insert({'app_id': config.app_id, 'gdrive_credentials': credentials}).execute()
        

