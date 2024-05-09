import io
from fastapi import UploadFile
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    Listing,
    User,
    ListingWithContactInfo,
    Message,
    BuyerInfo,
    SellerInfo,
    MessageRequest,
    Filters,
    ApprovalStatus,
    UserSource,
    NewsletterIssue,
)
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
from ranking_helper import RankingHelper


def get_supabase_timestamp(date: Optional[datetime.datetime] = None):
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    if date:
        return date.strftime(supabase_format)
    return datetime.datetime.now().strftime(supabase_format)


class Database:
    def __init__(self):
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        self.supabase = create_client(supabase_url, supabase_key)

    async def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = (
            self.supabase.table("dealwise_users")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(app_id=row["app_id"], user_id=row["id"])
        return None

    async def get_user(self, app_id: str) -> Optional[User]:
        print("app_id", app_id)
        response = (
            self.supabase.table("dealwise_users")
            .select("*")
            .filter("app_id", "eq", app_id)
            .execute()
        )
        print("response", response)
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None

    async def get_user_by_id(self, user_id: Optional[str]) -> Optional[User]:
        if not user_id:
            return None
        response = (
            self.supabase.table("dealwise_users")
            .select("*")
            .filter("id", "eq", user_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None

    async def get_user_by_email(self, email: Optional[str]) -> Optional[User]:
        if not email:
            return None
        response = (
            self.supabase.table("dealwise_users")
            .select("*")
            .filter("email", "eq", email)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None

    async def get_users_by_ids(self, user_ids: List[str]) -> List[User]:
        if not user_ids:
            return []
        response = (
            self.supabase.table("dealwise_users")
            .select("*")
            .filter("id", "in", f"({','.join(user_ids)})")
            .execute()
        )
        if len(response.data) > 0:
            return [User(**row) for row in response.data]
        return []

    async def get_buyer_info(self, user_id: str) -> Optional[BuyerInfo]:
        response = (
            self.supabase.table("buyer_info")
            .select("*")
            .filter("user_id", "eq", user_id)
            .execute()
        )

        if len(response.data) > 0:
            row = response.data[0]
            return BuyerInfo(**row)
        return None

    async def approve_buyer(self, user_id: str) -> Optional[BuyerInfo]:
        response = (
            self.supabase.table("buyer_info")
            .update({"approval_status": ApprovalStatus.approved})
            .filter("user_id", "eq", user_id)
            .execute()
        )

        if len(response.data) > 0:
            row = response.data[0]
            return BuyerInfo(**row)
        return None

    async def get_seller_info(self, user_id: str) -> Optional[SellerInfo]:
        response = (
            self.supabase.table("seller_info")
            .select("*")
            .filter("user_id", "eq", user_id)
            .execute()
        )

        if len(response.data) > 0:
            row = response.data[0]
            return SellerInfo(**row)
        return None

    async def upsert_seller_info(self, seller_info: SellerInfo) -> Optional[SellerInfo]:
        response = (
            self.supabase.table("seller_info").upsert(seller_info.dict()).execute()
        )

        if len(response.data) > 0:
            row = response.data[0]
            return SellerInfo(**row)
        return None

    async def upsert_buyer_info(self, buyer_info: BuyerInfo) -> Optional[BuyerInfo]:
        response = self.supabase.table("buyer_info").upsert(buyer_info.dict()).execute()

        if len(response.data) > 0:
            row = response.data[0]
            return BuyerInfo(**row)
        return None

    async def get_listings(
        self, listing_ids: Optional[List[str]] = None
    ) -> List[Listing]:
        if listing_ids is not None:
            if len(listing_ids) == 0:
                return []

            response = (
                self.supabase.table("listings")
                .select("*")
                .filter("id", "in", f"({','.join(listing_ids)})")
                .execute()
            )
        else:
            response = self.supabase.table("listings").select("*").execute()
        if len(response.data) > 0:
            return [Listing(**row) for row in response.data]
        return []

    async def get_new_listings(self) -> List[Listing]:
        a_week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
        response = (
            self.supabase.table("listings")
            .select("*")
            .filter("approved_at", "gte", get_supabase_timestamp(a_week_ago))
            .execute()
        )
        if len(response.data) > 0:
            return [Listing(**row) for row in response.data]
        return []

    async def get_listings_with_contact_info(
        self, listing_ids: Optional[List[str]] = None
    ) -> List[ListingWithContactInfo]:
        if listing_ids:
            response = (
                self.supabase.table("listings")
                .select("*")
                .filter("id", "in", f"({','.join(listing_ids)})")
                .execute()
            )
        else:
            response = self.supabase.table("listings").select("*").execute()
        if len(response.data) > 0:
            result = []
            for row in response.data:
                result.append(ListingWithContactInfo(**row))
            return result
        return []

    async def upsert_listing(self, listing: Listing) -> Listing:
        to_upsert = listing.dict()
        # remove created_at field
        del to_upsert["created_at"]
        response = self.supabase.table("listings").upsert(to_upsert).execute()

        return Listing(**response.data[0])

    async def upsert_listing_with_contact_info(
        self, listing: ListingWithContactInfo
    ) -> ListingWithContactInfo:
        to_upsert = listing.dict()
        # remove created_at field
        del to_upsert["created_at"]
        response = self.supabase.table("listings").upsert(to_upsert).execute()
        return ListingWithContactInfo(**response.data[0])

    async def add_message_to_listing(
        self,
        app_config: AppConfig,
        message: Message,
        listing: ListingWithContactInfo,
        buyer_info: Optional[BuyerInfo],
    ) -> None:
        messages = listing.messages or []
        # if there isnt already a message from this user, add it
        if not any(m.sender_user_id == message.sender_user_id for m in messages):
            messages.append(message)

        # make the messages jsons serializable
        resulting_messages = [m.dict() for m in messages]

        print("updating messages array")

        response = (
            self.supabase.table("listings")
            .update({"messages": resulting_messages})
            .filter("id", "eq", listing.id)
            .execute()
        )

        if not buyer_info:
            buyer_info = BuyerInfo(
                user_id=app_config.user_id, listings_messaged=[listing.id]
            )
        else:
            listings_messaged_set = set(buyer_info.listings_messaged)
            listings_messaged_set.add(listing.id)
            buyer_info.listings_messaged = list(listings_messaged_set)

        response = self.supabase.table("buyer_info").upsert(buyer_info.dict()).execute()

    async def get_listing(self, listing_id: str) -> Optional[Listing]:
        response = (
            self.supabase.table("listings")
            .select("*")
            .filter("id", "eq", listing_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Listing(**row)
        return None

    async def get_listing_with_contact_info(
        self, listing_id: str
    ) -> Optional[ListingWithContactInfo]:
        response = (
            self.supabase.table("listings")
            .select("*")
            .filter("id", "eq", listing_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return ListingWithContactInfo(**row)
        return None

    async def set_user_fields(
        self,
        config: AppConfig,
        is_seller: Optional[bool] = None,
        completed_onboarding: Optional[bool] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        calendar_link: Optional[str] = None,
        source: Optional[UserSource] = None,
        utm_source: Optional[str] = None,
    ) -> Optional[User]:
        payload = {}
        if is_seller is not None:
            payload["is_seller"] = is_seller
        if completed_onboarding is not None:
            payload["completed_onboarding"] = completed_onboarding
        if first_name:
            payload["first_name"] = first_name
        if last_name:
            payload["last_name"] = last_name
        if calendar_link:
            payload["calendar_link"] = calendar_link
        if source:
            payload["source"] = source
        if utm_source:
            payload["utm_source"] = utm_source
        response = (
            self.supabase.table("dealwise_users")
            .update(
                payload,
            )
            .filter("id", "eq", config.user_id)
            .execute()
        )
        print(response)
        if len(response.data) > 0:
            return User(**response.data[0])
        return None

    async def message_request_from_listing_and_message(
        self, listing: ListingWithContactInfo, message: Message
    ) -> Optional[MessageRequest]:
        if not message.sender_user_id:
            # use the app id to get the user id
            sender = await self.get_user(app_id=message.sender_app_id)
            if sender is None:
                print("nonexistent sender", sender)
                return None

            message.sender_user_id = sender.id
        buyer_info = await self.get_buyer_info(user_id=message.sender_user_id)

        if buyer_info is None or not buyer_info.first_name:
            return None

        return MessageRequest(
            listing_id=listing.id,
            listing_name=listing.description,
            message=message,
            message_sender_full_name=buyer_info.first_name + " " + buyer_info.last_name,
            message_sender_linkedin_profile=buyer_info.linkedin_profile,
            message_sender_company_name=buyer_info.company_name,
            message_sender_company_website=buyer_info.company_website,
        )

    async def get_filters(self, config: AppConfig) -> Optional[Filters]:
        response = (
            self.supabase.table("filters")
            .select("*")
            .filter("user_id", "eq", config.user_id)
            .execute()
        )

        if len(response.data) > 0:
            row = response.data[0]
            return Filters(**row)
        return None

    async def upsert_filters(self, filters: Filters):
        response = self.supabase.table("filters").upsert(filters.dict()).execute()

        if len(response.data) > 0:
            row = response.data[0]
            return Filters(**row)
        return None

    async def approve_listing(
        self, listing_id: str, should_set_approved_at: bool
    ) -> Optional[ListingWithContactInfo]:
        payload = {
            "status": ApprovalStatus.approved,
        }
        if should_set_approved_at:
            payload["approved_at"] = get_supabase_timestamp()
        response = (
            self.supabase.table("listings")
            .update(payload)
            .filter("id", "eq", listing_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return ListingWithContactInfo(**row)
        return None

    async def get_all_filters(self) -> List[Filters]:
        response = self.supabase.table("filters").select("*").execute()
        if len(response.data) > 0:
            return [Filters(**row) for row in response.data]
        return []

    # get buyers with filters matching the listing
    async def get_users_with_matching_filters(
        self,
        listing: Listing,
    ) -> List[User]:
        filters = await self.get_all_filters()

        filters = [filter for filter in filters if filter.alerts]

        matching_filters: List[Filters] = []
        ranking_helper = RankingHelper()
        for filter in filters:
            if ranking_helper.listing_matches_filters(listing, filter):
                matching_filters.append(filter)

        matching_user_ids = [filter.user_id for filter in matching_filters]

        matching_buyers = []
        for user_id in matching_user_ids:
            user = await self.get_user_by_id(user_id)
            if user:
                matching_buyers.append(user)

        return matching_buyers

    async def get_buyers_with_message_requests(self) -> List[BuyerInfo]:
        response = (
            self.supabase.table("buyer_info")
            .select("*")
            .filter("listings_messaged", "neq", "{}")
            .execute()
        )

        if len(response.data) > 0:
            return [BuyerInfo(**row) for row in response.data]
        return []

    async def get_sellers_with_message_requests(self) -> List[SellerInfo]:
        response = (
            self.supabase.table("seller_info")
            .select("*")
            .filter("listings", "neq", "{}")
            .execute()
        )

        if len(response.data) > 0:
            return [SellerInfo(**row) for row in response.data]
        return []

    async def get_latest_newsletter(self) -> Optional[NewsletterIssue]:
        response = (
            self.supabase.table("newsletters")
            .select("*")
            .order("id", desc=True)
            .limit(1)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return NewsletterIssue(**row)
        return None

    async def upsert_newsletter(
        self, newsletter: NewsletterIssue
    ) -> Optional[NewsletterIssue]:
        response = (
            self.supabase.table("newsletters").upsert(newsletter.dict()).execute()
        )

        if len(response.data) > 0:
            row = response.data[0]
            return NewsletterIssue(**row)
        return None
