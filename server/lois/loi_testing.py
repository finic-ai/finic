import os
from typing import List, Any, Optional, Tuple
from pydantic import BaseModel
import datetime
from docx.shared import Inches
import pdb

from models.models import LOI
from docx import Document
from docx.document import Document as DocxDocument
from docx.shared import Inches
from lois.templates.stanford_basic import StanfordBasicLOI, TestLOI

test_loi = TestLOI(
    id="1",
    status="draft",
    created_by="1234",
    business_name="Test Business",
    buyer_name="Jane Buyer",
    legal_entity="Test Legal Entity",
    biz_revenue=1000000,
    biz_ebitda=500000,
    financials_period="ttm",
    purchase_price=10000000,
    note_percent=0.1,
    note_interest_rate=0.05,
    note_term=5,
    note_standby=0,
    transaction_type="asset",
    earnout_description="Test Earnout description",
    escrow_percent=0.1,
    closing_date="2023-01-01",
    exclusivity_start_date="2022-01-01",
    exclusivity_end_date="2022-02-01",
    termination_fee_type="mutual",
    termination_fee_amount=10000,
    governing_law="Delaware",
    expiration_date="2022-12-31",
    ## these need to be added to the form
    business_entity_type="C Corp",
    business_address="123 Main St.",
    business_state="CA",
    buyer_title="CEO",
    seller_name="John Seller",
    equity_rollover_percent=0.2,
    bullet_payment_anniversary=4,
    escrow_cap=500000,
    escrow_tipping_basket=100000,
    due_diligence_items=["item 1", "item 2"],
    exclusivity_days=30,
)

loi = StanfordBasicLOI(test_loi)
loi.construct_docx()
loi.save("stanford_basic_loi.docx")