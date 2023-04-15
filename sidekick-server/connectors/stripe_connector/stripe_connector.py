import requests
import os
import json
from typing import Dict, List
from models.models import Source, AppConfig, Document, DocumentMetadata, DataConnector, AuthorizationResult
from appstatestore.statestore import StateStore
import stripe 
import uuid 

BASE_URL = "https://api.notion.com"


class StripeConnector(DataConnector):
    source_type: Source = Source.stripe
    connector_id: int = 8
    config: AppConfig
    headers: Dict = {}

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize(self, api_key: str, subdomain: str, email: str) -> AuthorizationResult:
        try:
            stripe.api_key = api_key
            charges = stripe.Charge.list(limit=100)
        except Exception as e:
            print(e)
            return AuthorizationResult(authorized=False)
        StateStore().save_credentials(self.config, api_key, self)
        return AuthorizationResult(authorized=True)

    async def load(self, source_id: str) -> List[Document]:
        api_key = StateStore().load_credentials(self.config, self)
        stripe.api_key = api_key

        documents: List[Document] = []


        # Get charges
        charges = stripe.Charge.list(limit=100)  # Limit can be 1 to 100, 10 is default
        charge_list = charges.get("data")

        for charge in charge_list:
            text = """
Amount: {}
Amount Refunded: {}
Billing Details: {}
Created: {}
Currency: {}
Description: {}""".format(
    charge.get("amount"),
    charge.get("amount_refunded"),
    charge.get("billing_details"),
    charge.get("created"),
    charge.get("currency"),
    charge.get("description")
)
            documents.append(
                Document(
                    title="Charge",
                    text=text,
                    url=charge.get("receipt_url"),
                    source_type=Source.stripe,
                    metadata=DocumentMetadata(
                        document_id=str(uuid.uuid4()),
                        source_id=source_id,
                        tenant_id=self.config.tenant_id
                    )
                )
            )


        # Get refunds
        refunds = stripe.Refund.list(limit=100)
        refund_list = refunds.get("data")

        for refund in refund_list:
            text = """
Amount: {}
Currency: {}
Reason: {}
Created: {}
Status: {}""".format(
    refund.get("amount"),
    refund.get("currency"),
    refund.get("reason"),
    refund.get("created"),
    refund.get("status")
)
            documents.append(
                Document(
                    title="Refund",
                    text=text,
                    url="N/A",
                    source_type=Source.stripe,
                    metadata=DocumentMetadata(
                        document_id=str(uuid.uuid4()),
                        source_id=source_id,
                        tenant_id=self.config.tenant_id
                    )
                )
            )

        # Get transfers
        transfers = stripe.Transfer.list(limit=100)
        transfer_list = transfers.get("data")

        for transfer in transfer_list:
            text = """
Amount: {}
Currency: {}
Description: {}
Created: {}
Status: {}""".format(
    transfer.get("amount"),
    transfer.get("currency"),
    transfer.get("description"),
    transfer.get("created"),
    transfer.get("status")
)
            documents.append(
                Document(
                    title="Transfer",
                    text=text,
                    url="N/A",
                    source_type=Source.stripe,
                    metadata=DocumentMetadata(
                        document_id=str(uuid.uuid4()),
                        source_id=source_id,
                        tenant_id=self.config.tenant_id
                    )
                )
            )

        return documents
