import os
from typing import List, Any, Optional, Tuple
from docx.shared import Inches
import pdb

from models.models import (
    LOI,
)
from docx import Document
from docx.document import Document as DocxDocument
from docx.shared import Inches

class LOIDocument():
    loi: LOI
    document: Optional[DocxDocument] = None
    
    def __init__(self, loi: LOI):
        self.loi = loi

    def construct_docx(self) -> None:
        pass

    def save(self) -> None:
        pass