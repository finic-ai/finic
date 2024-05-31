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
import numpy as np
import datetime
from pydantic import BaseModel


FILENAME = "Lender CRM - Top 50 Lenders (8).csv"


def get_supabase_timestamp():
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    return datetime.datetime.now().strftime(supabase_format)


class ApprovalStatus(str, Enum):
    approved = "approved"
    not_submitted = "not_submitted"
    under_review = "under_review"


class Lender(BaseModel):
    id: str
    website: Optional[str]
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    type: str
    name: str
    avg_interest_rate: Optional[float] = None
    avg_fixed_rate: Optional[float] = None
    avg_variable_rate: Optional[float] = None
    num_loans: Optional[int] = None
    state_locations: Optional[str] = None
    logo_url: Optional[str] = None
    has_referral_fee: Optional[bool] = True


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


class Database:
    def __init__(self):
        supabase_url = "https://api.godealwise.com"
        supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWZveHB0YXF4bmxyZnVjbWZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MjcwNDg5MCwiZXhwIjoxOTk4MjgwODkwfQ.KCGBczMqfVVFvDJaMsIlXE4uO97L38FxLB7YRsd1o24"
        self.supabase = create_client(supabase_url, supabase_key)

    def update_lenders(self):
        lenders = []
        # Load the CSV file Lender CRM - Top 50 Lenders (6).csv
        df = pd.read_csv(FILENAME, on_bad_lines="warn", low_memory=False)

        # replace all NaN values with None
        df = df.replace({np.nan: None})

        # loop through the rows of the CSV file

        for index, row in df.iterrows():
            # Create a dictionary from the CSV DataFrame for quick access
            print(row)
            lender = Lender(
                id=row["id"],
                website=row["website"],
                contact_name=row["contact_name"],
                contact_email=row["contact_email"],
                type=row["type"],
                name=row["name"],
                avg_interest_rate=row["avg_interest_rate"],
                avg_fixed_rate=row["avg_fixed_rate"],
                avg_variable_rate=row["avg_variable_rate"],
                num_loans=row["num_loans"],
                state_locations=row["state_locations"],
                logo_url=row["logo_url"],
                has_referral_fee=row["has_referral_fee"],
            )
            # validate state locations
            if lender.state_locations:
                try:
                    StateLocations.parse_obj(
                        json.loads(lender.state_locations.replace("'", '"'))
                    )
                except Exception as e:
                    print(f"Error parsing state locations: {e}")
                    print(lender.state_locations)
                    return

            lenders.append(lender.dict())

        # upsert the lenders data to the 'lender' table

        response = (
            self.supabase.table("lender")
            .upsert(
                lenders,
            )
            .execute()
        )

        print(response.data)


Database().update_lenders()
