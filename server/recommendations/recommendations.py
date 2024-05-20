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
from enum import Enum


def get_supabase_timestamp(date: Optional[datetime.datetime] = None):
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    if date:
        return date.strftime(supabase_format)
    return datetime.datetime.now().strftime(supabase_format)


class NAICSCodeSchema(BaseModel):
    naics_code: int


class Region(str, Enum):
    midwest = "midwest"
    new_england = "new_england"
    southeast = "southeast"
    great_lakes = "great_lakes"
    northwest = "northwest"
    southwest = "southwest"
    south = "south"

    def initialize_with_state(state: str):
        if state in [
            "Pennsylvania",
            "Delaware",
            "New Jersey",
            "New York",
            "Connecticut",
            "Rhode Island",
            "Massachusetts",
            "Vermont",
            "New Hampshire",
            "Maine",
        ]:
            return Region.new_england
        elif state in [
            "Illinois",
            "Indiana",
            "Michigan",
            "Ohio",
            "Wisconsin",
            "Kentucky",
            "Virginia",
            "West Virginia",
            "Maryland",
        ]:
            return Region.great_lakes
        elif state in [
            "North Dakota",
            "South Dakota",
            "Nebraska",
            "Kansas",
            "Minnesota",
            "Iowa",
            "Missouri",
            "Colorado",
        ]:
            return Region.midwest
        elif state in ["Washington", "Oregon", "Idaho", "Montana", "Wyoming"]:
            return Region.northwest
        elif state in ["California", "Nevada", "Utah", "Arizona", "New Mexico"]:
            return Region.southwest
        elif state in ["Texas", "Oklahoma", "Louisiana"]:
            return Region.south
        else:
            return Region.southeast


class StateLocations(BaseModel):
    states: Optional[List[str]] = []
    regions: Optional[List[Region]] = []


class Recommendations:
    def __init__(self, db: Database):
        self.db = db

    async def get_recommended_lenders(self, business: Business) -> List[Lender]:

        lenders = await self.db.get_lenders(
            sort_by="avg_interest_rate", descending=False, limit=64
        )

        top_lenders = []

        for lender in lenders:
            # if contact name or email is missing, skip
            if not lender.contact_name or not lender.contact_email:
                continue
            # if no referral fee, skip
            if not lender.has_referral_fee and lender.has_referral_fee is not None:
                continue
            if lender.state_locations:
                locations = StateLocations.parse_obj(
                    json.loads(lender.state_locations.replace("'", '"'))
                )
                region = Region.initialize_with_state(business.company_state)
                if (
                    not business.company_state in locations.states
                    and region not in locations.regions
                ):
                    continue
            top_lenders.append(lender)
            if len(top_lenders) == 10:
                break

        return top_lenders
