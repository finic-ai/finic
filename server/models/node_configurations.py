from pydantic import BaseModel, ConfigDict, Field, ValidationError
from enum import Enum
from typing import List, Optional, Dict, Any, Tuple, Type, Union
from typing_extensions import Literal


#  Define the SourceType, DestinationType, and TransformationType enums


class IntegrationType(str, Enum):
    google_cloud_storage = "google_cloud_storage"
    snowflake = "snowflake"


class TransformType(str, Enum):
    python = "python"
    sql = "sql"
    mapping = "mapping"
    join_tables = "join"
    split = "split"
    filter = "filter"
    conditional = "conditional"


# Source Configuration classes


class GCSSourceConfig(BaseModel):
    source_type: Literal[IntegrationType.google_cloud_storage] = (
        IntegrationType.google_cloud_storage
    )
    has_credentials: bool
    bucket: str
    filename: str


# Destination Configuration classes


class SnowflakeDestinationConfig(BaseModel):
    destination_type: Literal[IntegrationType.snowflake] = IntegrationType.snowflake
    has_credentials: bool
    account: str
    warehouse: str
    database: str
    table_schema: str
    table: str


# Transformation Configuration classes
class ColumnMapping(BaseModel):
    old_name: str
    new_name: str


class MappingTransformConfig(BaseModel):
    transform_type: Literal[TransformType.mapping] = TransformType.mapping
    mappings: List[ColumnMapping]


class PythonTransformConfig(BaseModel):
    transform_type: Literal[TransformType.python] = TransformType.python
    code: str
    dependencies: List[str] = []


class JoinTransformConfig(BaseModel):
    transform_type: Literal[TransformType.join_tables] = TransformType.join_tables
    join_column: str
