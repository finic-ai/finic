from models.models import (
    BuyerInfo,
    User,
    ListingWithContactInfo,
    Listing,
    NewsletterIssue,
)
import requests
from email_sender.email_sender import EmailSender
from typing import Optional, List
from newsletter import Newsletter


class NotificationsManager:
    def __init__(self):
        self.buyer_approvals_slack_webhook = (
            "https://hook.us1.make.com/thi4h52wb69cluuubpps6nyjsrztnomy"
        )
        self.buyer_seller_messages_webhook = (
            "https://hook.us1.make.com/18d7ckfgnp7ywi16ou1q8qc8up6g53e1"
        )

        self.newsletter_slack_webhook = (
            "https://hook.us1.make.com/wgi7uihtlwqzeleioo1z0pdv1kehx76q"
        )

        self.email_sender = EmailSender()

    def send_buyer_approval_required_notification(
        self, buyer_info: BuyerInfo, buyer: User
    ):

        slack_message = f"New buyer pending approval: {buyer_info.first_name} {buyer_info.last_name}"
        slack_message += (
            f"\nCompany: {buyer_info.company_name} ({buyer_info.company_website})"
        )
        slack_message += f"\nEmail: {buyer.email}"
        slack_message += f"\nLinkedIn: {buyer_info.linkedin_profile}"

        slack_message += f"\nSupabase link: https://supabase.com/dashboard/project/gbifoxptaqxnlrfucmfo/editor/40134?filter=user_id%3Aeq%3A{buyer_info.user_id}"
        slack_message += f"\nApproval link: https://dealwise-marketplace-ezml2kwdva-uc.a.run.app/approve-buyer?user_id={buyer_info.user_id}&bearer=d4e459ca-b9a7-4403-af08-d21759681c5b"
        data = {"message": slack_message}

        requests.post(self.buyer_approvals_slack_webhook, json=data)

    def send_message_request_notification(
        self,
        seller: Optional[User],
        buyer: User,
        listing: ListingWithContactInfo,
        buyer_info: BuyerInfo,
        message: str,
    ):
        if seller is None:
            seller_full_name = listing.name
            seller_email = listing.contact_email
        else:
            if seller.first_name and seller.last_name:
                seller_full_name = f"{seller.first_name} {seller.last_name}"
            elif seller.full_name:
                seller_full_name = seller.full_name
            else:
                seller_full_name = listing.name
            seller_email = seller.email

        buyer_full_name = f"{buyer_info.first_name} {buyer_info.last_name}"
        data = {
            "message": f"Listing: {listing.description}\nNew message from {buyer_full_name} ({buyer.email}, linkedin: {buyer_info.linkedin_profile}) from {buyer_info.company_name} ({buyer_info.company_website}) for {seller_full_name} ({seller_email}): {message}"
        }

        seller_first_name = seller_full_name.split(" ")[0] if seller_full_name else ""

        EmailSender().send_buyer_message_request_email(
            to=seller_email,
            seller_first_name=seller_first_name,
            seller_company_name=listing.company_name,
            buyer_full_name=buyer_full_name,
            buyer_linkedin=buyer_info.linkedin_profile,
            buyer_company_name=buyer_info.company_name,
            buyer_company_website=buyer_info.company_website,
            message=message,
            listing_id=listing.id,
        )

        response = requests.post(self.buyer_seller_messages_webhook, json=data)

    def send_newsletter_notification(
        self, listings: List[Listing], previous_issue: NewsletterIssue
    ) -> NewsletterIssue:

        new_issue = Newsletter().generate_newsletter(listings, previous_issue)

        data = {"message": new_issue.content}

        requests.post(self.newsletter_slack_webhook, json=data)

        return new_issue
