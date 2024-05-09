import io
from typing import List, Optional, Tuple
from supabase import create_client, Client
import os
from storage3.utils import StorageException
import csv
import json
from io import StringIO
import asyncio
import requests
import openai
from bs4 import BeautifulSoup
import pandas as pd
import httpx
import datetime
from enum import Enum


def get_supabase_timestamp():
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    return datetime.datetime.now().strftime(supabase_format)


class ApprovalStatus(str, Enum):
    approved = "approved"
    not_submitted = "not_submitted"
    under_review = "under_review"


class Database:
    def __init__(self):
        supabase_url = "https://api.godealwise.com"
        supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWZveHB0YXF4bmxyZnVjbWZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MjcwNDg5MCwiZXhwIjoxOTk4MjgwODkwfQ.KCGBczMqfVVFvDJaMsIlXE4uO97L38FxLB7YRsd1o24"
        self.supabase = create_client(supabase_url, supabase_key)

    def approve_buyers_with_sent_messages(self):
        response = (
            self.supabase.table("buyer_info")
            .update({"approval_status": ApprovalStatus.approved})
            .filter("listings_messaged", "neq", "{}")
            .execute()
        )

        if len(response.data) > 0:
            print(response.data)
        return


Database().approve_buyers_with_sent_messages()
