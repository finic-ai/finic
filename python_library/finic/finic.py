from typing import Dict, Optional, List
from functools import wraps
import json
import os
from enum import Enum
import requests
import datetime
import sys
from pydantic import BaseModel
from typing import Any
from playwright.sync_api import sync_playwright, Browser, BrowserContext
from playwright.async_api import async_playwright, Browser as AsyncBrowser, BrowserContext as AsyncBrowserContext

class FinicEnvironment(str, Enum):
    LOCAL = "local"
    PROD = "prod"


class LogSeverity(str, Enum):
    DEFAULT = "DEFAULT"
    WARNING = "WARNING"
    ERROR = "ERROR"


class ExecutionLog(BaseModel):
    severity: LogSeverity
    message: str
    timestamp: Optional[datetime.datetime] = None

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat() if v else None}


class ExecutionAttempt(BaseModel):
    success: bool
    attempt_number: int
    logs: List[ExecutionLog] = []


class LogExecutionAttemptRequest(BaseModel):
    execution_id: str
    agent_id: str
    results: Dict[str, Any]
    attempt: ExecutionAttempt


class StdoutLogger:
    def __init__(self, original_stdout):
        self.logs: List[ExecutionLog] = []
        self.original_stdout = original_stdout

    def write(self, message):
        if message.strip():  # Avoid logging empty messages
            log = ExecutionLog(
                severity=LogSeverity.DEFAULT,
                timestamp=datetime.datetime.now(datetime.timezone.utc),
                message=message.strip(),
            )
            self.logs.append(log)
            self.original_stdout.write(
                f"{log.timestamp} [{log.severity.value}] {log.message}\n"
            )

    def flush(self):
        pass

    def get_logs(self):
        return self.logs

def on_browser_disconnected(browser: Browser):
    print("Browser disconnected")
    if len(browser.contexts) > 0:
        storage_state_path = os.path.join(os.getcwd(), f"storage_state.json")
        browser.contexts[0].storage_state(path=storage_state_path)
        print(f"Browser context saved to: {storage_state_path}")

class Finic:
    api_key: Optional[str] = None
    env: Optional[FinicEnvironment] = None
    context_storage_path: Optional[str] = "storage_state.json"

    def __init__(
        self,
        api_key: Optional[str] = None,
        environment: Optional[FinicEnvironment] = None
    ):

        default_env = os.environ.get("FINIC_ENV") or FinicEnvironment.LOCAL
        self.environment = environment if environment else FinicEnvironment(default_env)
        if api_key:
            self.api_key = api_key
        else:
            self.api_key = os.getenv("FINIC_API_KEY")
    
    def save_context(self, context: BrowserContext, path: Optional[str] = None):
        if path:
            self.context_storage_path = path
        context.storage_state(path=self.context_storage_path)
        print(f"Browser context saved to: {self.context_storage_path}")
    
    def launch_browser_sync(self, cdp_url: Optional[str] = None, **kwargs) -> BrowserContext:
        playwright = sync_playwright().start()
        if cdp_url:
            try:
                browser = playwright.chromium.connect_over_cdp(
                    endpoint_url=cdp_url,
                    timeout=kwargs.get('timeout'),
                    slow_mo=kwargs.get('slow_mo'),
                    headers=kwargs.get('headers')
                )
                context = browser.contexts[0]
            except Exception as e:
                print(f"Error connecting to remote browser: {e}")
                raise e
        else:
            
            browser = playwright.chromium.launch(**kwargs)
            context = browser.new_context()
            context.on("close", on_browser_disconnected)
            try:
                if os.path.exists(self.context_storage_path):
                    with open(self.context_storage_path, 'r') as f:
                        storage_state = json.load(f)
                        cookies = storage_state.get('cookies', [])
                        context.add_cookies(cookies)
            except Exception as e:
                print(f"Error loading storage state: {e}")

        return context
    
    async def launch_browser_async(self, cdp_url: Optional[str] = None, **kwargs) -> AsyncBrowserContext:
        playwright = async_playwright().start()
        if cdp_url:
            try:
                browser = playwright.chromium.connect_over_cdp(
                    endpoint_url=cdp_url,
                    timeout=kwargs.get('timeout'),
                    slow_mo=kwargs.get('slow_mo'),
                    headers=kwargs.get('headers')
                )
                context = browser.contexts[0]
            except Exception as e:
                print(f"Error connecting to remote browser: {e}")
                raise e
        else:
            browser = await playwright.chromium.launch(**kwargs)
            browser.on("disconnected", on_browser_disconnected)
            context = await browser.new_context()
        
            try:
                if os.path.exists(self.context_storage_path):
                    with open(self.context_storage_path, 'r') as f:
                        storage_state = json.load(f)
                        cookies = storage_state.get('cookies', [])
                        context.add_cookies(cookies)
            except Exception as e:
                print(f"Error loading storage state: {e}")

        return context