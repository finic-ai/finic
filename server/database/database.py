import io
from fastapi import UploadFile
from typing import List, Optional, Tuple
from models.models import (
    AppConfig,
    User,
    Business,
    Lender,
    LoanApplication,
    LoanStatus,
    LOI,
    BusinessFiles,
    BusinessFile,
)
from supabase import create_client, Client
import os
from storage3.utils import StorageException

from io import StringIO
from bs4 import BeautifulSoup
import pandas as pd
import httpx
import datetime
from pypdf import PdfWriter, PdfReader
import tempfile


def get_supabase_timestamp(date: Optional[datetime.datetime] = None):
    supabase_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    if date:
        return date.strftime(supabase_format)
    return datetime.datetime.now().strftime(supabase_format)


def get_file_size(file: io.BytesIO) -> int:
    return file.getbuffer().nbytes


class Database:
    def __init__(self):
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        self.supabase = create_client(supabase_url, supabase_key)

    async def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = (
            self.supabase.table("lending_users")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(user_id=row["id"])
        return None

    async def get_user(self, user_id: str) -> Optional[User]:
        response = (
            self.supabase.table("lending_users")
            .select("*")
            .filter("id", "eq", user_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None

    async def get_user_by_id(self, user_id: Optional[str]) -> Optional[User]:
        if not user_id:
            return None
        response = (
            self.supabase.table("lending_users")
            .select("*")
            .filter("id", "eq", user_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return User(**row)
        return None

    async def set_user_fields(
        self,
        config: AppConfig,
        completed_onboarding: Optional[bool] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        phone_number: Optional[str] = None,
    ) -> Optional[User]:
        payload = {}
        if completed_onboarding is not None:
            payload["completed_onboarding"] = completed_onboarding
        if first_name:
            payload["first_name"] = first_name
        if last_name:
            payload["last_name"] = last_name
        if phone_number:
            payload["phone_number"] = phone_number
        response = (
            self.supabase.table("lending_users")
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

    async def upsert_business(self, business: Business) -> Optional[Business]:
        response = (
            self.supabase.table("businesses")
            .upsert(
                business.dict(),
            )
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Business(**row)
        return None

    async def get_businesses_for_user(self, user_id: str) -> List[Business]:
        response = (
            self.supabase.table("businesses")
            .select("*")
            .filter("borrower_id", "eq", user_id)
            .execute()
        )
        return [Business(**row) for row in response.data]

    async def get_lenders(
        self, sort_by, descending: bool = False, limit: int = 3
    ) -> List[Lender]:
        response = (
            self.supabase.table("lender")
            .select("*")
            .order(sort_by, desc=descending)
            .limit(limit)
            .execute()
        )

        return [Lender(**row) for row in response.data]

    async def get_lender(self, lender_id: str) -> Optional[Lender]:
        response = (
            self.supabase.table("lender")
            .select("*")
            .filter("id", "eq", lender_id)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return Lender(**row)
        return None

    async def upsert_loan_application(
        self,
        business: Business,
        lender: Lender,
        borrower_id: str,
    ):
        loan_application = LoanApplication(
            lender_id=lender.id,
            business_id=business.id,
            borrower_id=borrower_id,
            status=LoanStatus.applied,
            lender_name=lender.name,
        )

        loan_dict = loan_application.dict()
        # remove the lender field
        loan_dict.pop("lender")
        response = self.supabase.table("loan_applications").upsert(loan_dict).execute()
        if len(response.data) > 0:
            row = response.data[0]
            return LoanApplication(**row)

    async def bucket_exists(self, business: Business) -> bool:
        try:
            self.supabase.storage.get_bucket(business.id)
            return True
        except StorageException as e:
            return False

    async def num_files_in_bucket(self, user_id: str, business: Business) -> int:
        try:
            bucket = self.supabase.storage.from_("loan_docs").list(
                f"{user_id}/{business.id}"
            )
            return len(bucket)
        except StorageException as e:
            return 0

    async def upload_business_files(
        self, business: Business, files: List[UploadFile]
    ) -> bool:
        res = self.supabase.storage.create_bucket(business.id)

        # upload the files

        new_file_names = [
            "buyer_resume.pdf",
            "buyer_credit_score.pdf",
            "buyer_2021_tax_return.pdf",
            "buyer_2022_tax_return.pdf",
            "buyer_2023_tax_return.pdf",
            "buyer_form_413.pdf",
            "cim.pdf",
            "business_2021_tax_return.pdf",
            "business_2022_tax_return.pdf",
            "business_2023_tax_return.pdf",
            "business_2024_pnl.pdf",
            "business_2024_balance_sheet.pdf",
            "loi.pdf",
        ]

        i = 0
        print(len(files))
        for file in files:
            filename = new_file_names[i]
            print(filename)
            file_bytes = await file.read()
            self.supabase.storage.from_(business.id).upload(
                file=file_bytes, path=filename
            )
            i += 1

        print("finished uploading files")

        return True

    async def get_file(self, file_path: str) -> io.BytesIO:
        file_bytes = self.supabase.storage.from_("loan_docs").download(file_path)
        return io.BytesIO(file_bytes)

    async def get_diligence_file(self, file_path: str) -> io.BytesIO:
        file_bytes = self.supabase.storage.from_("diligence_docs").download(file_path)
        return io.BytesIO(file_bytes)

    async def get_signed_url(self, file_path: str) -> str:
        return self.supabase.storage.from_("loan_docs").create_signed_url(file_path, 60)

    async def get_business_files(
        self, user_id: str, business: Business
    ) -> BusinessFiles:
        bucket = self.supabase.storage.from_("loan_docs").list(
            f"{user_id}/{business.id}"
        )

        filenames = [file["name"] for file in bucket]

        # download the files
        business_files = BusinessFiles()
        for filename in filenames:
            file_bytes = self.supabase.storage.from_("loan_docs").download(
                f"{user_id}/{business.id}/{filename}"
            )
            filename_without_ext = filename.split(".")[0]
            ext = filename.split(".")[1]
            if ext == "pdf":
                content_type = "application/pdf"
            elif ext == "png":
                content_type = "image/png"
            elif ext == "jpg":
                content_type = "image/jpeg"
            elif ext == "xlsx":
                content_type = (
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
            elif ext == "docx":
                content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            elif ext == "doc":
                content_type = "application/msword"
            else:
                content_type = "application/octet-stream"
            setattr(
                business_files,
                filename_without_ext,
                BusinessFile(
                    content_type=content_type,
                    filename=filename,
                    content=io.BytesIO(file_bytes),
                ),
            )

        return business_files

    async def get_business_file_paths(
        self, user_id: str, business: Business
    ) -> List[str]:
        try:
            bucket = self.supabase.storage.from_("loan_docs").list(
                f"{user_id}/{business.id}"
            )

            filenames = [file["name"] for file in bucket]

            return [f"{user_id}/{business.id}/{filename}" for filename in filenames]
        except StorageException as e:
            return []

    async def get_diligence_file_paths(self, user_id: str) -> List[str]:
        try:
            bucket = self.supabase.storage.from_("diligence_docs").list(
                user_id,
            )

            filenames = [file["name"] for file in bucket]

            return [f"{user_id}/{filename}" for filename in filenames]
        except StorageException as e:
            return []

    async def get_loan_applications(self, business: Business) -> List[LoanApplication]:
        # get all loans with business_id = business.id and then join with the lenders table to get the lender details
        # order by lender.avg_interest_rate
        response = (
            self.supabase.table("loan_applications")
            .select(
                "*, lender(id, name, type, website, contact_name, contact_email, avg_interest_rate, avg_fixed_rate, avg_variable_rate, num_loans, logo_url, has_referral_fee)"
            )
            .filter("business_id", "eq", business.id)
            .execute()
        )

        result = [LoanApplication(**row) for row in response.data]

        print(result)

        # sort the loan applications by lender avg interest rate
        result.sort(key=lambda x: x.lender.avg_interest_rate)
        return result

    async def upsert_loan_applications(
        self, lenders: List[Lender], business: Business, borrower_id: str
    ):
        upsert_data = [
            {
                "lender_id": lender.id,
                "business_id": business.id,
                "borrower_id": borrower_id,
                "status": LoanStatus.not_yet_applied,
                "lender_name": lender.name,
            }
            for lender in lenders
        ]
        response = (
            self.supabase.table("loan_applications")
            .upsert(
                upsert_data,
            )
            .execute()
        )

        result = [LoanApplication(**row) for row in response.data]

        # add the lender details to the loan application using the lenders list
        for loan_application in result:
            lender = next(
                (
                    lender
                    for lender in lenders
                    if lender.id == loan_application.lender_id
                ),
                None,
            )
            loan_application.lender = lender

        return result
    
    async def get_lois(self, user_id: str, loi_id: str = None) -> List[LOI]:
        if loi_id:
            response = (
                self.supabase.table("letters_of_intent")
                .select("*")
                .filter("id", "eq", loi_id)
                .filter("created_by", "eq", user_id)
                .execute()
            )
            return [LOI(**row) for row in response.data]
        
        response = (
            self.supabase.table("letters_of_intent")
            .select("*")
            .filter("created_by", "eq", user_id)
            .execute()
        )
        return [LOI(**row) for row in response.data]

    async def upsert_loi(self, loi: LOI) -> Optional[LOI]:
        loi_dict = loi.dict()
        loi_dict.pop('document', None)
        for key, value in loi_dict.items():
            if isinstance(value, datetime.date):
                loi_dict[key] = value.isoformat()
        response = (
            self.supabase.table("letters_of_intent")
            .upsert(
                loi_dict,
            )
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return LOI(**row)
        return None
    
    async def get_lois(self, user_id: str, loi_id: str = None) -> List[LOI]:
        if loi_id:
            response = (
                self.supabase.table("letters_of_intent")
                .select("*")
                .filter("id", "eq", loi_id)
                .filter("created_by", "eq", user_id)
                .filter("status", "neq", "deleted")
                .execute()
            )
            return [LOI(**row) for row in response.data]
        
        response = (
            self.supabase.table("letters_of_intent")
            .select("*")
            .filter("created_by", "eq", user_id)
            .filter("status", "neq", "deleted")
            .execute()
        )
        return [LOI(**row) for row in response.data]

    async def delete_lois(self, loi_ids: List[str]) -> Optional[List[LOI]]:
        response = (
            self.supabase.table("letters_of_intent")
            .update({"status": "deleted"})
            .in_("id", loi_ids)
            .execute()
        )
        if getattr(response, 'error', None) is not None:
            raise Exception(f"Failed to delete LOIs: {response.error.message}")
        return [LOI(**row) for row in response.data]

    async def upload_loi_files(self, loi: LOI) -> Optional[List[LOI]]:
        import pdb
        with tempfile.NamedTemporaryFile(delete=True) as tmp_file:
            loi.document.save(tmp_file.name)
            
            bucket_name = "lois"
            file_name = f"{loi.id}.docx"
            
            # Upload the file
            try:
                response = self.supabase.storage.from_(bucket_name).upload(file_name, tmp_file.name)
            except StorageException as e:
                if "Duplicate" in str(e):
                    self.supabase.storage.from_(bucket_name).remove(file_name)
                    response = self.supabase.storage.from_(bucket_name).upload(file_name, tmp_file.name)
        if response.status_code == 200:
            return response.content
        else:
            raise Exception(f"Failed to upload LOI files")

