from models.models import DOMNodeDetails
from pydantic import BaseModel
from baml_client import b as baml
from baml_client.types import Element, Attribute, ResponseFormat
from baml_py import ClientRegistry
from typing import Literal

client_registry = ClientRegistry()

async def generate_code(
        intent: str, 
        element: DOMNodeDetails, 
        existing_code: str, 
        provider: Literal["openai", "anthropic"] = "anthropic", 
        model: str = "claude-3-5-sonnet-20240620", 
        provider_api_key: str = None
    ) -> ResponseFormat:
    client_registry.add_llm_client(name="FinicLLMClient", 
    provider=provider, 
    options={
        "api_key": provider_api_key,
        "model": model
        })
    client_registry.set_primary("FinicLLMClient")
    element = Element(
        tagName=element.nodeName,
        attributes=[Attribute(name=attr["name"], value=attr["value"]) for attr in element.attributes],
        textContent=element.textContent,
        outerHTML=element.outerHTML
    )

    code = baml.GeneratePlaywrightCode(intent, element, existing_code)
    return code