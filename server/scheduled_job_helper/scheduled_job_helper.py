from models.models import (
    AppConfig,
    Listing,
    BuyerInfo,
    ApprovalStatus,
    ListingActivityStatus,
    ListingWithContactInfo,
)
from ranking_helper.ranking_helper import RankingHelper
from database import Database
from email_sender import EmailSender
import requests
from typing import List
from chat import Chat
from newsletter import Newsletter
from notifications_manager import NotificationsManager


class ScheduledJobHelper:
    def __init__(self, db: Database) -> None:
        self.db = db
        self.ranking = RankingHelper()
        self.inactive_sellers_slack_channel_url = (
            "https://hook.us1.make.com/igkjatq85mlupeasghu6vffo5qfrnn0p"
        )

    async def handle_inactive_listings(self) -> None:
        listings = await self.db.get_listings_with_contact_info()
        # skip test listings and unapproved listings and inactive listings
        listings = [
            listing
            for listing in listings
            if not listing.is_test_listing
            and listing.status == ApprovalStatus.approved
            and not listing.activity_status
            == ListingActivityStatus.permanently_inactive
        ]

        permanently_inactive_listings = [
            listing
            for listing in listings
            if listing.activity_status == ListingActivityStatus.permanently_inactive
        ]

        inactive_warning_week_listings: List[ListingWithContactInfo] = []

        for listing in listings:
            if (
                listing.activity_status == ListingActivityStatus.inactive_day_1
                or listing.activity_status == ListingActivityStatus.inactive_day_7
            ):
                # send warning email

                seller_full_name = listing.name
                seller_email = listing.contact_email

                await EmailSender().send_inactive_warning_email(
                    to=seller_email,
                    first_name=seller_full_name.split(" ")[0],
                    listing=listing,
                )
            self.ranking.update_listing_activity_status(listing)

            if listing.activity_status == ListingActivityStatus.permanently_inactive:
                permanently_inactive_listings.append(listing)
            elif not listing.activity_status == ListingActivityStatus.active:
                inactive_warning_week_listings.append(listing)
            await self.db.upsert_listing_with_contact_info(listing=listing)

        slack_message = f"Permanently inactive listings: \n"
        i = 1
        for listing in permanently_inactive_listings:
            slack_message += f"{i}. <https://app.godealwise.com/listing?id={listing.id}|{listing.description}>\n"
            slack_message += f" - Contact: {listing.name} {listing.contact_email} \n"
            i += 1

        slack_message += f"\nInactive listings to be deactivated within a week: \n"
        i = 1
        for listing in inactive_warning_week_listings:
            slack_message += f"{i}. <https://app.godealwise.com/listing?id={listing.id}|{listing.description}>\n"
            slack_message += f" - Contact: {listing.name} {listing.contact_email}\n"
            i += 1
        data = {"message": slack_message}
        response = requests.post(self.inactive_sellers_slack_channel_url, json=data)

    async def handle_pending_message_request_reminders(self) -> None:
        listings = await self.db.get_listings_with_contact_info()
        # skip test listings and unapproved listings and inactive listings
        listings = [
            listing
            for listing in listings
            if not listing.is_test_listing
            and listing.status == ApprovalStatus.approved
            and not listing.activity_status
            == ListingActivityStatus.permanently_inactive
        ]

        active_listings_with_pending_messages: List[ListingWithContactInfo] = []

        for listing in listings:
            pending_messages = self.ranking.get_pending_messages(listing)
            if len(pending_messages) > 0:
                active_listings_with_pending_messages.append(listing)
                # send reminder email
                seller_full_name = listing.name
                seller_email = listing.contact_email

                await EmailSender().send_pending_message_request_reminder_email(
                    to=seller_email,
                    first_name=seller_full_name.split(" ")[0],
                    listing=listing,
                    pending_messages=pending_messages,
                    db=self.db,
                )

        slack_message = f"Active listings with pending messages: \n"
        i = 1
        for listing in active_listings_with_pending_messages:
            num_pending_messages = len(self.ranking.get_pending_messages(listing))
            slack_message += f"{i}. <https://app.godealwise.com/listing?id={listing.id}|{listing.description}> ({num_pending_messages} messages)\n"
            slack_message += f" - Contact: {listing.name} {listing.contact_email} \n"
            i += 1

        data = {"message": slack_message}
        response = requests.post(self.inactive_sellers_slack_channel_url, json=data)

    async def handle_unread_message_reminders(self) -> None:
        buyers = await self.db.get_buyers_with_message_requests()
        buyer_ids = [buyer.user_id for buyer in buyers]

        chat = Chat()
        buyer_unread_counts = await chat.get_user_ids_with_unread_messages(buyer_ids)

        for user_id, unread_count in buyer_unread_counts:
            buyer_info = next(buyer for buyer in buyers if buyer.user_id == user_id)
            user = await self.db.get_user_by_id(user_id)

            first_name = user.first_name
            if not first_name:
                first_name = buyer_info.first_name
            await EmailSender().send_unread_message_reminder_email(
                to=user.email,
                is_seller=False,
                first_name=first_name,
                unread_messages=unread_count,
            )

        sellers = await self.db.get_sellers_with_message_requests()
        seller_ids = [seller.user_id for seller in sellers]
        seller_unread_counts = await chat.get_user_ids_with_unread_messages(seller_ids)

        for user_id, unread_count in seller_unread_counts:
            seller_info = next(
                seller for seller in sellers if seller.user_id == user_id
            )
            user = await self.db.get_user_by_id(user_id)

            first_name = user.first_name
            if not first_name:
                first_name = seller_info.first_name
            await EmailSender().send_unread_message_reminder_email(
                to=user.email,
                is_seller=True,
                first_name=first_name,
                unread_messages=unread_count,
            )

    async def generate_newsletter(self) -> str:

        listings = await self.db.get_new_listings()

        old_issue = await self.db.get_latest_newsletter()

        new_issue = NotificationsManager().send_newsletter_notification(
            listings, old_issue
        )

        await self.db.upsert_newsletter(new_issue)
