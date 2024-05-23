import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To, From, ReplyTo, Attachment

from models.models import (
    User,
    BusinessFiles,
    Business,
    Lender,
)

from typing import List, Any, Optional, Tuple
from database import Database
import json
import re
import base64


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
        self.from_email = From(email="ayan@godealwise.com", name="Ayan Bandyopadhyay")
        self.test_borrower_ids = ["058b8065-0a23-46b5-adfa-9ef11e83eedc"]

    def send_email_with_attachments(
        self,
        to_emails: List[str],
        subject: str,
        message: str,
        attachments: List[Attachment],
        cc_team=True,
    ) -> bool:

        if cc_team:
            to_emails.append("ayan@godealwise.com")
            to_emails.append("jason@godealwise.com")
            to_emails.append("garrett@godealwise.com")

        message = Mail(
            from_email=self.from_email,
            to_emails=to_emails,
            subject=subject,
            html_content=message,
        )
        message.reply_to = ReplyTo(
            email="team@godealwise.com",
            name="Dealwise Team",
        )

        for attachment in attachments:
            message.add_attachment(attachment)

        try:
            response = self.sg.send(message)
            return True
        except Exception as e:
            print(e)
            return False

    def send_application_email(
        self,
        business: Business,
        borrower: User,
        lender: Lender,
        business_files: BusinessFiles,
    ) -> bool:
        subject = f"Dealwise - SBA Loan: {borrower.first_name} <> {lender.name}"
        lender_first_name = lender.contact_name.split(" ")[0]

        formatted_loan_amount = "{:,.2f}".format(business.loan_amount)

        if business.under_loi:
            message = f"""Hi {lender_first_name},<br><br> 

            I'm reaching out to you on behalf of a client who is interested in applying for an SBA loan.
            {borrower.first_name} {borrower.last_name} is under LOI to acquire a business, and wants to finance the acquisition with an SBA loan of ${formatted_loan_amount}. 
            The business is called {business.company_name} and is located in {business.company_state}. Their website is {business.company_website}.<br><br>
            I have attached {borrower.first_name}'s resume, financials, and LOI, as well as the business's financials. An executive summary of the business is also attached.
            I have also cc'ed {borrower.first_name}, who can answer any follow up questions about the application.<br><br>"""
        else:
            message = f"""Hi {lender_first_name},<br><br> 

            I'm reaching out to you on behalf of a client who is interested in applying for prequalification for an SBA loan.
            {borrower.first_name} {borrower.last_name} is not yet under LOI, but is looking to purchase a business with an SBA loan of ${formatted_loan_amount}. 
            The business is called {business.company_name} and is located in {business.company_state}. Their website is {business.company_website}.<br><br>
            I have attached {borrower.first_name}'s resume and financials, as well as the business's financials.
            I have also cc'ed {borrower.first_name}, who can answer any follow up questions about the application.<br><br>"""

        attachments = []

        # Loop over BusinessFiles keys and values
        for key, value in business_files.dict().items():
            if value:
                attachments.append(
                    Attachment(
                        file_content=base64.b64encode(value).decode(),
                        file_name=key + ".pdf",
                        file_type="application/pdf",
                        disposition="attachment",
                    )
                )

        emails = [lender.contact_email, borrower.email]
        # TODO: remove this line
        is_test_mode = (
            os.environ.get("ENVIRONMENT") == "development"
            or borrower.id in self.test_borrower_ids
        )
        if is_test_mode:
            emails = ["ayan@psychic.dev"]
            print("development env")

        return self.send_email_with_attachments(
            to_emails=emails,
            subject=subject,
            message=message,
            attachments=attachments,
            cc_team=(not is_test_mode),
        )
