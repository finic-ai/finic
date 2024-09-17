from typing import Optional
import os
from supabase import create_client, Client
from models import AppConfig, Agent, User


class Database:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        self.supabase = create_client(supabase_url, supabase_key)

    def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = (
            self.supabase.table("user")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(user_id=row["id"], app_id=row["app_id"])
        return None

    def get_secret_key_for_user(self, user_id: str):
        response = (
            self.supabase.table("user")
            .select("secret_key")
            .filter("id", "eq", user_id)
            .execute()
        )
        if len(response.data) > 0:
            return response.data[0]["secret_key"]
        return None

    def upsert_agent(self, agent: Agent) -> Optional[Agent]:
        payload = agent.dict()
        # Remove created_at field
        payload.pop("created_at", None)
        response = (
            self.supabase.table("agent")
            .upsert(
                payload,
            )
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Agent(**row)
        return None

    def get_agent(self, config: AppConfig, id: str) -> Optional[Agent]:
        response = (
            self.supabase.table("agent")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("id", "eq", id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Agent(**row)
        return None

    def get_user(self, config: AppConfig) -> Optional[Agent]:
        response = (
            self.supabase.table("user")
            .select("*")
            .filter("app_id", "eq", config.app_id)
            .filter("id", "eq", config.user_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None
