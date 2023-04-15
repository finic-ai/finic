from typing import Dict, List, Optional
from models.models import AppConfig, DataConnector, Vectorstore
from models.api import SelectVectorstoreRequest
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
                return AppConfig(app_id=row['app_id'], tenant_id=row['uuid'], vectorstore_id=row['vectorstore'])
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
    
    def update_vectorstore(self, config: AppConfig, vectorstore: Vectorstore, credentials: Optional[str]):
        # if this is a self hosted instance, return a config with a constant app_id and tenant_id since namespace conflicts aren't an issue
        if self.is_self_hosted:
            return
        
        # Update the 'vectorstore' column of the users table with the new vectorstore id
        response = self.supabase.table('users').select('*').filter(
            'uuid',
            'eq',
            config.tenant_id
        ).execute()
        
        updated_row = False
        for row in response.data:
            if row['uuid'] == config.tenant_id:
                row['vectorstore'] = vectorstore
                self.supabase.table('users').upsert(row).execute()
                updated_row = True
                break

        if not updated_row:
            raise Exception("Couldn't find user with the given id")
        
        # check if a credential was passed in 
        if credentials is None:
            if vectorstore == Vectorstore.default:
                return
            else:
                raise Exception("No credentials passed in for non-default vectorstore")

        # Check if the credential corresponding to the user id + vectorstore already exists
        response = self.supabase.table('vectorstore_credentials').select('*').filter(
            'user_id',
            'eq',
            config.tenant_id
        ).filter(
            'vectorstore',
            'eq',
            vectorstore
        ).execute()

        existing_credentials = response.data
        if len(existing_credentials) > 0:
            to_upsert = existing_credentials[0]
            to_upsert['credential'] = credentials
            self.supabase.table("vectorstore_credentials").upsert(to_upsert).execute()
        else:
            # Add the credentials to the vectorstore_credentials table
            insert_data = {
                'user_id': config.tenant_id,
                'vectorstore': vectorstore,
                'credential': credentials
            }
            self.supabase.table("vectorstore_credentials").upsert(insert_data).execute()
    
    def load_vectorstore_credentials(self, config: AppConfig, vectorstore: Vectorstore) -> Optional[str]:
        response = self.supabase.table('vectorstore_credentials').select('*').filter(
            'user_id', 
            'eq', 
            config.tenant_id
        ).filter(
            'vectorstore', 
            'eq', 
            vectorstore
        ).execute()

        for row in response.data:
            if row['user_id'] == config.tenant_id and row['vectorstore'] == vectorstore:
                return row['credential']
        return None

        

        
            

        

