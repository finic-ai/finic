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

    def update_websites(self):
        # Load the CSV file
        df = pd.read_csv(
            "Institutions_5_12_2024.csv", on_bad_lines="warn", low_memory=False
        )

        print(df)
        print(df.iloc[0]["WEBADDR"])

        # Create a dictionary from the CSV DataFrame for quick access
        website_updates = df.set_index(df["ID"].astype(str))["WEBADDR"].to_dict()

        print(website_updates)

        # Fetch all existing data from the 'lenders' table
        lenders_data = self.supabase.table("lenders").select("*").execute()

        # Convert lenders data to a DataFrame
        lenders_df = pd.DataFrame(lenders_data.data)

        # Update the website in lenders_df if there is a new website available from CSV
        lenders_df["website"] = (
            lenders_df["fdic_number"].map(website_updates).fillna(lenders_df["website"])
        )

        # if the fdic_number is not in the website_updates dictionary as a key, set active to False
        lenders_df["active"] = lenders_df["fdic_number"].isin(website_updates.keys())

        # Now perform the upsert operation. We assume that 'fdic_number' is a unique key.
        # Ensure that all the columns you want to upsert are mentioned in the DataFrame
        for index, row in lenders_df.iterrows():
            print(row)

            upsert_response = (
                self.supabase.table("lenders")
                .upsert(
                    {
                        "id": row["id"],
                        "fdic_number": row[
                            "fdic_number"
                        ],  # This is the unique key for matching rows
                        "website": row["website"],
                        "active": row["active"],
                    }
                )
                .execute()
            )
            print(upsert_response.data)

    def set_lenders_naics_stats(self):
        # Fetch all existing data from the 'lenders' table
        lenders_data = self.supabase.table("lenders").select("*").execute()

        # create a dictionary from lenders_data: fdic_number -> id
        lenders_dict = {
            lender["fdic_number"]: lender["id"] for lender in lenders_data.data
        }

        print(len(lenders_data.data))

        # load the naics stats data from the CSV file
        lenders_naics_stats_data = pd.read_csv(
            "foia-7afy2020-present-asof-240331 (1).csv",
            on_bad_lines="warn",
            low_memory=False,
            encoding="cp1252",
        )

        # aggregate the mean of InitialInterestRate aggregated by BankFDICNumber and NaicsCode
        # include only rows where ApprovalDate is in the last 12 months. The format is '10/01/2019'
        # there should also be a column count that shows the number of rows that were aggregated

        lenders_naics_stats_data["ApprovalDate"] = pd.to_datetime(
            lenders_naics_stats_data["ApprovalDate"], format="%m/%d/%Y"
        )
        one_year_ago = datetime.datetime.now() - pd.DateOffset(years=1)
        filtered_data = lenders_naics_stats_data[
            lenders_naics_stats_data["ApprovalDate"] >= one_year_ago
        ]

        result = (
            filtered_data.groupby(["BankFDICNumber", "NaicsCode"])[
                "InitialInterestRate"
            ]
            .agg(["mean", "count"])
            .reset_index()
        )

        result.columns = ["fdic_number", "naics", "mean_interest_rate", "count"]

        # turn the fdic_number into an int and then a string
        result["fdic_number"] = result["fdic_number"].astype(int).astype(str)

        # add the lender_id to the result

        result["lender_id"] = result["fdic_number"].map(lenders_dict)

        # upsert the data to the 'lenders_naics_stats' table, delete all existing data first

        result = result.replace({np.nan: None})

        # convert the naics column to ints
        result["naics"] = result["naics"].astype(int)

        # delete the rows where lender_id is None

        result = result[result["lender_id"].notnull()]

        delete_response = (
            self.supabase.table("lenders_naics_stats")
            .delete()
            .neq("fdic_number", "neq")
            .execute()
        )

        # upsert in one go
        upsert_response = (
            self.supabase.table("lenders_naics_stats")
            .upsert(result.to_dict(orient="records"))
            .execute()
        )


Database().set_lenders_naics_stats()
