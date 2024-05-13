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
from database import Database


def get_supabase_timestamp(date: Optional[datetime.datetime] = None):
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    if date:
        return date.strftime(supabase_format)
    return datetime.datetime.now().strftime(supabase_format)


class NAICSCodeSchema(BaseModel):
    naics_code: int


class Recommendations:
    def __init__(self, db: Database):
        self.db = db

    async def get_recommended_lenders(self, naics_code: int) -> List[Lender]:

        low_interest_rates = await self.db.get_lenders_by_naics_code(
            naics_code, "mean_interest_rate", descending=False
        )

        lenders = low_interest_rates[:3]

        most_loans = await self.db.get_lenders_by_naics_code(
            naics_code, "count", descending=True
        )

        lenders += most_loans[:3]

        # Remove duplicates

        lenders = list({lender.id: lender for lender in lenders}.values())

        if len(lenders) < 3:
            all_lenders = await self.db.get_lenders(
                sort_by="num_loans", descending=True
            )
            lenders += all_lenders

        return lenders
