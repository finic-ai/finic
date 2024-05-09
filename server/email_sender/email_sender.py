import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from sendgrid.helpers.mail import To, From, ReplyTo

from models.models import (
    BuyerInfo,
    SellerInfo,
    User,
    MessageRequest,
    ListingWithContactInfo,
    ListingActivityStatus,
    Message,
)

from typing import List, Any, Optional, Tuple
from database import Database
import json
import re


def extract_reply(text, address):
    regex_arr = [
        re.compile(r"From:\s*" + re.escape(address), re.IGNORECASE),
        re.compile(r"^.*On.*wrote:", re.IGNORECASE | re.MULTILINE),
        re.compile(r"<" + re.escape(address) + r">", re.IGNORECASE),
        re.compile(re.escape(address) + r"\s+wrote:", re.IGNORECASE),
        re.compile(r"-+original\s+message-+\s*$", re.IGNORECASE),
        re.compile(r"from:\s*$", re.IGNORECASE),
    ]

    text_length = len(text)
    # Calculates the matching regex closest to the top of the page
    index = text_length
    for regex in regex_arr:
        match = regex.search(text)
        if match:
            index = min(index, match.start())

    return text[0:index].strip()


def extract_channel_url(html):
    # find channel url from DEALWISE_CHANNEL_URL_START{channel_url}DEALWISE_CHANNEL_URL_END
    match = re.search(
        r"DEALWISE_CHANNEL_URL_START(.*)DEALWISE_CHANNEL_URL_END", html, re.IGNORECASE
    )
    if match:
        return match.group(1)
    return ""


def extract_recipient_id(html):
    # find recipient_id from RECIPIENT_ID_START{recipient_id}RECIPIENT_ID_END
    match = re.search(r"RECIPIENT_ID_START(.*)RECIPIENT_ID_END", html, re.IGNORECASE)
    if match:
        return match.group(1)
    return ""


class EmailSender:
    def __init__(self):
        self.sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
        self.from_email = From(email="support@godealwise.com", name="Dealwise")

    def send_email(self, to, subject, message) -> bool:
        message = Mail(
            from_email=self.from_email,
            to_emails=to,
            subject=subject,
            html_content=message,
            reply_to=ReplyTo(
                email="team@godealwise.com",
                name="Dealwise Team",
            ),
        )
        try:
            sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
            response = sg.send(message)
            return True
        except Exception as e:
            print(e.message)
            return False

    def send_template_email(
        self,
        to_emails: List[str],
        template_id: str,
        dynamic_template_data: Any,
        cc_team=True,
        is_messaging_notification=False,
    ) -> bool:

        if cc_team:
            to_emails += [
                "team@godealwise.com",
            ]

        message = Mail(
            from_email=self.from_email,
            to_emails=to_emails,
        )

        message.dynamic_template_data = dynamic_template_data
        message.template_id = template_id
        message.reply_to = (
            ReplyTo(
                email="team@messaging.godealwise.com",
                name="Dealwise Team",
            )
            if is_messaging_notification
            else ReplyTo(
                email="team@godealwise.com",
                name="Dealwise Team",
            )
        )
        try:
            sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
            response = sg.send(message)
            return True
        except Exception as e:
            print(e.message)
            return False

    def send_buyer_onboarding_email(self, to, first_name) -> bool:

        dynamic_template_data = {}
        if first_name:
            dynamic_template_data = {
                "first_name": first_name,
            }

        return self.send_template_email(
            [to],
            "d-f550c50a664b47fc992a5ce8c2306dec",
            dynamic_template_data,
            cc_team=False,
        )

    def send_buyer_message_request_email(
        self,
        to,
        seller_first_name,
        seller_company_name,
        buyer_full_name,
        buyer_linkedin,
        buyer_company_name,
        buyer_company_website,
        message,
        listing_id,
    ) -> bool:
        frontend_url = os.environ.get("FRONTEND_URL")

        escaped_message = message.replace("\n", "<br>")

        escaped_message = f'<blockquote>"{escaped_message}"</blockquote>'

        return self.send_template_email(
            [to],
            "d-1f4e06c317254efaac8a7f76afa8d542",
            {
                "seller_first_name": seller_first_name,
                "seller_company_name": seller_company_name,
                "buyer_full_name": buyer_full_name,
                "buyer_linkedin": buyer_linkedin,
                "buyer_company_name": buyer_company_name,
                "buyer_company_website": buyer_company_website,
                "message": escaped_message,
                "accept_request_url": frontend_url
                + "/message-requests?onboard_with_listing="
                + listing_id,
                "ignore_request_url": frontend_url
                + "/message-requests?onboard_with_listing="
                + listing_id,
            },
        )

    def send_seller_responded_to_request_email(
        self,
        buyer_email: str,
        seller_email: str,
        accepted: bool,
        buyer_first_name: str,
        seller_first_name: str,
        seller_full_name: str,
        seller_company_name: str,
        listing_name: str,
    ) -> bool:
        frontend_url = os.environ.get("FRONTEND_URL")
        if not accepted:
            return self.send_template_email(
                [buyer_email],
                "d-2da752af75cc4ef68f71f32c7256ed1a",
                {
                    "buyer_first_name": buyer_first_name,
                    "listing_name": listing_name,
                },
            )
        return self.send_template_email(
            [buyer_email, seller_email],
            "d-61adfe11dea04ae485bf5d70ef8b9e54",
            {
                "seller_full_name": seller_full_name,
                "seller_first_name": seller_first_name,
                "seller_company_name": seller_company_name,
                "buyer_first_name": buyer_first_name,
                "listing_name": listing_name,
                "url": frontend_url + "/messages",
            },
        )

    async def send_inactive_warning_email(
        self, to, first_name, listing: ListingWithContactInfo
    ) -> bool:
        print("Sending email to: " + to)
        is_inactive_day_1 = (
            listing.activity_status == ListingActivityStatus.inactive_day_1
        )

        time_left = "in 7 days" if is_inactive_day_1 else "tomorrow"

        return self.send_template_email(
            [to],
            "d-a0b97489e0994544a95aea535a2742bd",
            {
                "seller_first_name": first_name,
                "listing_name": listing.description,
                "listing_url": os.environ.get("FRONTEND_URL")
                + "/listing?id="
                + listing.id,
                "time_left": time_left,
                "message_requests_url": os.environ.get("FRONTEND_URL")
                + "/message-requests",
            },
        )

    async def send_pending_message_request_reminder_email(
        self,
        to,
        first_name,
        listing: ListingWithContactInfo,
        pending_messages: List[Message],
        db: Database,
    ) -> bool:
        print("Sending email to: " + to)

        message_request = await db.message_request_from_listing_and_message(
            listing=listing, message=pending_messages[0]
        )

        return self.send_template_email(
            [to],
            "d-f36384c2feae4951898ab7d71d706acd",
            {
                "seller_first_name": first_name,
                "seller_company_name": listing.company_name,
                "num_buyers": f"{len(pending_messages)}",
                "and_x_buyers": (
                    f" and {len(pending_messages) - 1} others"
                    if len(pending_messages) > 1
                    else ""
                ),
                "multiple_messages": len(pending_messages) > 1,
                "message_requests_url": os.environ.get("FRONTEND_URL")
                + "/message-requests",
                "buyer_full_name": message_request.message_sender_full_name,
                "buyer_linkedin": message_request.message_sender_linkedin_profile,
            },
        )

    async def send_listing_approved_email(
        self,
        to,
        listing: ListingWithContactInfo,
    ) -> bool:
        print("Sending email to: " + to)

        return self.send_template_email(
            [to],
            "d-cd8e6b510fc647ee9678bcb81fecd24e",
            {
                "seller_first_name": listing.name,
                "listing_name": listing.description,
                "listing_url": os.environ.get("FRONTEND_URL")
                + "/listing?id="
                + listing.id,
                "message_requests_url": os.environ.get("FRONTEND_URL")
                + "/message-requests",
            },
        )

    async def send_new_listing_alert_emails(
        self,
        listing: ListingWithContactInfo,
        users: List[User],
    ) -> bool:

        success = True
        for user in users:

            if user is None:
                continue

            if user.email is None:
                continue

            dynamic_template_data = {
                "listing_name": listing.description,
                "listing_url": os.environ.get("FRONTEND_URL")
                + "/listing?id="
                + listing.id,
                "all_listings_url": os.environ.get("FRONTEND_URL"),
            }

            if user.first_name:
                dynamic_template_data["first_name"] = user.first_name

            result = self.send_template_email(
                to_emails=[user.email],
                template_id="d-95c101d8ea9240f5832b2470f4cd5c14",
                dynamic_template_data=dynamic_template_data,
            )

            if not result:
                success = False

        return success

    async def send_unread_message_reminder_email(
        self,
        to: str,
        is_seller: bool,
        first_name: str,
        unread_messages: int,
    ) -> bool:
        print("Sending email to: " + to)

        return self.send_template_email(
            [to],
            "d-1dc6936f1c5c401eafe366e98563f745",
            {
                "first_name": first_name,
                "unread_messages": unread_messages,
                "is_seller": is_seller,
                "multiple_messages": unread_messages > 1,
                "messages_url": os.environ.get("FRONTEND_URL") + "/messages",
            },
        )

    async def send_chat_message_received_email(
        self,
        to: str,
        recipient_first_name: str,
        recipient_id: str,
        sender_full_name: str,
        sender_first_name: str,
        message: str,
        channel_url: str,
    ) -> bool:
        print("Sending email to: " + to)

        escaped_message = message.replace("\n", "<br>")

        escaped_message = f'<blockquote>"{escaped_message}"</blockquote>'

        identifiers = f'<div style="display: none;">DEALWISE_CHANNEL_URL_START{channel_url}DEALWISE_CHANNEL_URL_END RECIPIENT_ID_START{recipient_id}RECIPIENT_ID_END</div>'

        return self.send_template_email(
            to_emails=[to],
            template_id="d-059f7237129f4cd3ae49d721b51f7c80",
            dynamic_template_data={
                "recipient_first_name": recipient_first_name,
                "sender_full_name": sender_full_name,
                "sender_first_name": sender_first_name,
                "message": escaped_message,
                "view_message_url": os.environ.get("FRONTEND_URL") + "/messages",
                "identifiers": identifiers,
            },
            is_messaging_notification=True,
        )

    def parse_email_received_webhook(self, form_data) -> Tuple[str, str, str, str]:

        envelope = json.loads(form_data.get("envelope"))
        from_email_address = envelope.get("from")

        html = form_data.get("html")
        print(html)

        channel_url = extract_channel_url(html)

        text = form_data.get("text")
        message = extract_reply(text, "support@godealwise.com")
        recipient_id = extract_recipient_id(html)

        return from_email_address, channel_url, message, recipient_id
