from pydantic import BaseModel


class InputSchema(BaseModel):
    user_id: str
