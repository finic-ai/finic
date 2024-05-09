from __future__ import unicode_literals
import requests
import os
from typing import Tuple, List
from database import Database
from models.models import User, SendbirdMessageSendWebhookPayload
import asyncio
import aiohttp

import hashlib, hmac


class Chat:
    def __init__(self):
        self.sendbird_app_id = os.environ.get("SENDBIRD_APP_ID")
        self.sendbird_api_token = os.environ.get("SENDBIRD_API_TOKEN")

    async def create_channel(
        self,
        buyer_user_id: str,
        seller_user_id: str,
        buyer_name: str,
        seller_name: str,
        listing_name: str,
        listing_id: str,
    ) -> bool:
        # create a sendbird channel
        print("sendbird api token", self.sendbird_api_token)

        # check if users already exist or not

        buyer_exists = await self.create_chat_user_if_does_not_exist(
            buyer_user_id, buyer_name
        )

        seller_exists = await self.create_chat_user_if_does_not_exist(
            seller_user_id, seller_name
        )

        if not buyer_exists or not seller_exists:
            print("unable to create sendbird users")
            return False

        response = requests.post(
            f"https://api-{self.sendbird_app_id}.sendbird.com/v3/group_channels",
            headers={
                "Api-Token": self.sendbird_api_token,
                "Content-Type": "application/json; charset=utf8",
            },
            json={
                # "name": f"{buyer_name}, {seller_name}. Listing: {listing_name}",
                "user_ids": [buyer_user_id, seller_user_id],
                "custom_type": "buyer_seller_convo",
                "data": f'{{"listing_id": "{listing_id}", "listing_name": "{listing_name}"}}',
                "is_distinct": True,
                "channel_url": f"{buyer_user_id}_{seller_user_id}",
            },
        )

        if response.status_code != 200:
            print("Error creating sendbird channel", response.json())
            return False

        return True

    async def send_message_in_channel(
        self,
        channel_url: str,
        user_id: str,
        message: str,
    ) -> bool:
        response = requests.post(
            f"https://api-{self.sendbird_app_id}.sendbird.com/v3/group_channels/{channel_url}/messages",
            headers={
                "Api-Token": self.sendbird_api_token,
                "Content-Type": "application/json; charset=utf8",
            },
            json={
                "message_type": "MESG",
                "user_id": user_id,
                "message": message,
            },
        )

        if response.status_code != 200:
            print("Error sending sendbird message", response.json())
            return False

        return True

    async def send_message_from_buyer_to_seller(
        self,
        buyer_id: str,
        seller_id: str,
        message: str,
    ) -> bool:
        channel_url = f"{buyer_id}_{seller_id}"
        response = await self.send_message_in_channel(channel_url, buyer_id, message)
        return response

    def get_buyer_and_seller_from_channel_url(
        self, channel_url: str
    ) -> Tuple[str, str]:
        buyer_id, seller_id = channel_url.split("_")
        return buyer_id, seller_id

    async def create_chat_user_if_does_not_exist(
        self, user_id: str, user_name: str
    ) -> bool:
        response = requests.get(
            f"https://api-{self.sendbird_app_id}.sendbird.com/v3/users/{user_id}",
            headers={
                "Api-Token": self.sendbird_api_token,
                "Content-Type": "application/json; charset=utf8",
            },
        )

        print(user_id, response.json())

        if response.json().get("code") == 400201:
            # user does not exist

            create_buyer_response = requests.post(
                f"https://api-{self.sendbird_app_id}.sendbird.com/v3/users",
                headers={
                    "Api-Token": self.sendbird_api_token,
                    "Content-Type": "application/json; charset=utf8",
                },
                json={
                    "user_id": user_id,
                    "nickname": user_name,
                    "profile_url": "",
                },
            )

            if create_buyer_response.status_code != 200:
                print(
                    "Error creating sendbird user ",
                    user_id,
                    create_buyer_response.json(),
                )
                # check if it's because user already exists, code 400202

                if create_buyer_response.json().get("code") == 400202:
                    return True

                return False

        return True

    async def get_user_ids_with_unread_messages(self):
        response = requests.get(
            f"https://api-{self.sendbird_app_id}.sendbird.com/v3/users",
            headers={
                "Api-Token": self.sendbird_api_token,
                "Content-Type": "application/json; charset=utf8",
            },
        )

        if response.status_code != 200:
            print("Error getting sendbird users", response.json())
            return False

        return response.json().get("users")

    async def get_unread_message_count(self, user_id: str) -> int:
        response = requests.get(
            f"https://api-{self.sendbird_app_id}.sendbird.com/v3/users/{user_id}/unread_message_count",
            headers={
                "Api-Token": self.sendbird_api_token,
                "Content-Type": "application/json; charset=utf8",
            },
        )

        if response.status_code != 200:
            print("Error getting unread message count", response.json())
            return False

        return response.json().get("unread_count")

    async def get_unread_messages_for_user(self, session, user_id: str) -> int:
        async with session.get(
            f"https://api-{self.sendbird_app_id}.sendbird.com/v3/users/{user_id}/unread_message_count",
            headers={
                "Api-Token": self.sendbird_api_token,
                "Content-Type": "application/json; charset=utf8",
            },
        ) as response:
            if response.status != 200:
                print("Error getting unread message count", await response.text())
                return 0

            data = await response.json()
            return data.get("unread_count")

    async def get_user_ids_with_unread_messages(
        self, user_ids: List[str]
    ) -> List[Tuple[str, int]]:

        unread_message_counts = []

        async with aiohttp.ClientSession() as session:
            while user_ids:
                # Take 60 buyers at a time
                batch = user_ids[:60]
                user_ids = user_ids[60:]

                tasks = [
                    self.get_unread_messages_for_user(session, user_id)
                    for user_id in batch
                ]
                results = await asyncio.gather(*tasks)

                for buyer, unread_message_count in zip(batch, results):
                    if unread_message_count:
                        unread_message_counts.append((buyer, unread_message_count))
                await asyncio.sleep(1)

        return unread_message_counts

    async def signature_is_valid(self, request) -> bool:
        raw_body = await request.body()
        payload = raw_body.decode("utf-8")
        request_headers = request.headers

        signature_to_compare = hmac.new(
            key=self.sendbird_api_token.encode("utf8"),
            msg=bytes(payload.encode("utf8")),
            digestmod=hashlib.sha256,
        ).hexdigest()
        return signature_to_compare == request_headers.get("x-sendbird-signature")

    def parse_message_send_webhook(
        self, payload: dict
    ) -> SendbirdMessageSendWebhookPayload:
        message_sender = payload["sender"]["user_id"]

        message_recipient = None

        for member in payload["members"]:
            if member["user_id"] != message_sender:
                message_recipient = member["user_id"]
                break

        message = payload["payload"]["message"]

        channel_url = payload["channel"]["channel_url"]

        return SendbirdMessageSendWebhookPayload(
            message_sender_id=message_sender,
            message_recipient_id=message_recipient,
            message=message,
            channel_url=channel_url,
        )
