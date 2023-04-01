from typing import Dict, List, Optional
from models.models import AppConfig
import os
import uuid
from supabase import create_client, Client


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
        response = self.supabase.table('app_config').select('*').filter('bearer', 'eq', bearer_token).execute()

        for row in response.data:
            if row['bearer'] == bearer_token:
                return AppConfig(app_id=row['app_id'], tenant_id=row['product_id'])
        return None
        

