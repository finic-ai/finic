import io
from fastapi import UploadFile
from typing import List, Optional, Tuple
from models.models import AppConfig, User, Business, Lender
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
from firecrawl import FirecrawlApp
from pydantic import BaseModel


def get_supabase_timestamp(date: Optional[datetime.datetime] = None):
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    if date:
        return date.strftime(supabase_format)
    return datetime.datetime.now().strftime(supabase_format)


class NAICSCodeSchema(BaseModel):
    naics_code: int


class WebScraper:
    def __init__(self):
        self.app = FirecrawlApp(api_key="fc-42e0904597384d3ba0448550d294f5d0")

    async def get_naics_code(self, url: str) -> int:
        data = self.app.scrape_url(
            url,
            {
                "extractorOptions": {
                    "extractionSchema": NAICSCodeSchema.model_json_schema(),
                    "mode": "llm-extraction",
                },
                "pageOptions": {
                    "onlyMainContent": True,
                },
            },
        )
        print(data["llm_extraction"])
        return data["llm_extraction"]["naics_code"]
