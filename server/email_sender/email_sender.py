import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To, From, ReplyTo, Attachment

from models.models import (
    User,
    BusinessFiles,
    Business,
    Lender,
    BusinessFile,
)

from typing import List, Any, Optional, Tuple
from database import Database
import json
import re
import base64
import uuid
import io
import zipfile


MAX_ZIP_SIZE = 25 * 1024 * 1024  # 20 MB


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


def create_zip_file(
    files: List[BusinessFile], filenames: List[str], split: bool
) -> List[io.BytesIO]:

    if split:
        # add files to the zip file until the size exceeds 20MB. Then create a new zip file
        zip_files = []
        current_zip = io.BytesIO()
        current_zip_size = 0

        z = zipfile.ZipFile(current_zip, "w", zipfile.ZIP_DEFLATED)

        for i, file in enumerate(files):
            print({"filename": filenames[i]})
            print("type of file: ", type(file))
            file_data = file.content.getvalue()
            file_size = len(file_data)
            if current_zip_size + file_size > MAX_ZIP_SIZE:
                z.close()
                current_zip.seek(0)
                zip_files.append(current_zip)
                current_zip = io.BytesIO()
                z = zipfile.ZipFile(current_zip, "w", zipfile.ZIP_DEFLATED)
                current_zip_size = 0

            z.writestr(file.filename, file_data)
            current_zip_size += file_size

        z.close()
        if current_zip.tell() > 0:
            current_zip.seek(0)
            print("current_zip.tell()", current_zip.tell())
            print("type of current_zip", type(current_zip))
            zip_files.append(current_zip)

        return zip_files
    else:
        zip_file = io.BytesIO()
        with zipfile.ZipFile(zip_file, "w", zipfile.ZIP_DEFLATED) as z:
            for i, file in enumerate(files):
                z.writestr(filenames[i], file.getvalue())
        zip_file.seek(0)
        return [zip_file]


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
            email="ayan@godealwise.com",
            name="Dealwise Team",
        )

        for attachment in attachments:
            message.add_attachment(attachment)

        try:
            payload = message.get()
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
            I have also cc'ed {borrower.first_name}, who can answer any follow up questions about the application. Please communicate with {borrower.first_name} directly in this email thread but keep the Dealwise team in the loop by using 'Reply All' <br><br>"""
        else:
            message = f"""Hi {lender_first_name},<br><br> 

            I'm reaching out to you on behalf of a client who is interested in applying for prequalification for an SBA loan.
            {borrower.first_name} {borrower.last_name} is not yet under LOI, but is looking to purchase a business with an SBA loan of ${formatted_loan_amount}. 
            The business is called {business.company_name} and is located in {business.company_state}. Their website is {business.company_website}.<br><br>
            I have attached {borrower.first_name}'s resume and financials, as well as the business's financials.
            I have also cc'ed {borrower.first_name}, who can answer any follow up questions about the application. Please communicate with {borrower.first_name} directly in this email thread but keep the Dealwise team in the loop by using 'Reply All'<br><br>"""

        emails = [lender.contact_email, borrower.email]
        is_test_mode = (
            os.environ.get("ENVIRONMENT") == "development"
            or borrower.id in self.test_borrower_ids
        )
        if is_test_mode:
            emails = ["ayan@psychic.dev"]

        attachments = []

        attachment_size = 0

        exceeded_attachment_size = False
        # Loop over BusinessFiles keys and values
        filenames = [
            key + ".pdf" for key, value in business_files.__dict__.items() if value
        ]

        files: List[BusinessFile] = [
            value for key, value in business_files.__dict__.items() if value
        ]

        file_size = sum([file.content.getbuffer().nbytes for file in files])
        print("file size", file_size)
        # for key, value in business_files.__dict__.items():
        #     if value:
        #         attachment_size += value.getbuffer().nbytes
        #         if attachment_size > 20 * 1024 * 1024:
        #             print("Attachment size exceeded 25MB")
        #             exceeded_attachment_size = True
        #             break
        #         attachments.append(
        #             Attachment(
        #                 file_content=base64.b64encode(value.getvalue()).decode(),
        #                 file_name=key + ".pdf",
        #                 file_type="application/pdf",
        #                 disposition="attachment",
        #             )
        #         )

        for file in files:
            print(file.__dict__)

        zip_files = create_zip_file(files, filenames, True)

        # if zip_file.getbuffer().nbytes > 20 * 1024 * 1024:
        #     print("Attachment size exceeded 20MB")
        #     exceeded_attachment_size = True
        #     # split into 2 zip files based on file size

        #     first_zip_file = create_zip_file(
        #         files[: len(files) // 2], filenames[: len(files) // 2]
        #     )
        #     second_zip_file = create_zip_file(
        #         files[len(files) // 2 :], filenames[len(files) // 2 :]
        #     )

        print("type of zip_files", type(zip_files))
        print("type of first_zip_file", type(zip_files[0]))
        # print("type of second_zip_file", type(zip_files[1]))

        if len(zip_files) > 1:
            self.send_email_with_attachments(
                to_emails=emails,
                subject=subject,
                message=message
                + " Because the attachment size exceeded 20MB, I have split the attachments into two separate emails. Please find the first attachment below.",
                attachments=[
                    Attachment(
                        file_content=base64.b64encode(zip_files[0].getvalue()).decode(),
                        file_name="attachments.zip",
                        file_type="application/zip",
                        disposition="attachment",
                    )
                ],
                cc_team=(not is_test_mode),
            )

            self.send_email_with_attachments(
                to_emails=emails,
                subject=subject,
                message="Please find the second attachment below.",
                attachments=[
                    Attachment(
                        file_content=base64.b64encode(zip_files[1].getvalue()).decode(),
                        file_name="attachments.zip",
                        file_type="application/zip",
                        disposition="attachment",
                    )
                ],
                cc_team=(not is_test_mode),
            )
        else:
            self.send_email_with_attachments(
                to_emails=emails,
                subject=subject,
                message=message,
                attachments=[
                    Attachment(
                        file_content=base64.b64encode(zip_files[0].getvalue()).decode(),
                        file_name="attachments.zip",
                        file_type="application/zip",
                        disposition="attachment",
                    )
                ],
                cc_team=(not is_test_mode),
            )
