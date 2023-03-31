from typing import Dict, List, Optional
from models.models import AppConfig
import os 
from supabase import create_client, Client


class StateStore:

    def __init__(self): 
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        self.supabase = create_client(supabase_url, supabase_key)

    def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = self.supabase.table('app_config').select('*').filter('bearer', 'eq', bearer_token).execute()

        for row in response.data:
            if row['bearer'] == bearer_token:
                return AppConfig(app_id=row['app_id'], product_id=row['product_id'])
        return None
        

