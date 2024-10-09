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
from dotenv import load_dotenv

class FinicEnvironment(str, Enum):
    LOCAL = "local"
    PROD = "production"
    DEV = "development"


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
        environment: Optional[FinicEnvironment] = None,
        url: Optional[str] = None
    ):

        default_env = os.environ.get("FINIC_ENVIRONMENT") or FinicEnvironment.LOCAL
        self.environment = environment if environment else FinicEnvironment(default_env)
        if api_key:
            self.api_key = api_key
        else:
            self.api_key = os.getenv("FINIC_API_KEY")
        self.url = url or "https://api.finic.io"

    def get_agent_input(self) -> Optional[Dict[str, Any]]:
        if self.environment == FinicEnvironment.LOCAL:
            path = os.path.join(os.getcwd(), "finic_input.json")
            if os.path.exists(path):
                with open(path, 'r') as f:
                    return json.load(f)
            else:
                raise Exception("No finic_input.json file found in the current directory")
        else:
            load_dotenv()
            if os.getenv("FINIC_INPUT"):
                return json.loads(os.getenv("FINIC_INPUT"))
        return None
    
    def save_browser_context(self, context: BrowserContext, browser_id: Optional[str] = None):
        if self.environment == FinicEnvironment.LOCAL:
            path = os.path.join(os.getcwd(), f"browser_state.json")
            context.storage_state(path=path)
            print(f"Browser context saved to: {path}")
        else:
            if not browser_id:
                browser_id = os.getenv("FINIC_BROWSER_ID")
            browser_context = context.storage_state()
            response = requests.post(
                f"{self.url}/browser-state/{browser_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=browser_context
            )
            response.raise_for_status()
            browser = response.json()
            print(f"Browser context saved for browser: {browser['id']}")

    def get_browser_context(self, browser_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        if self.environment == FinicEnvironment.LOCAL:
            path = os.path.join(os.getcwd(), f"browser_state.json")
            if os.path.exists(path):
                with open(path, 'r') as f:
                    return json.load(f)
            else:
                return None
        else:
            if not browser_id:
                browser_id = os.getenv("FINIC_BROWSER_ID")
            response = requests.get(
                f"{self.url}/browser-state/{browser_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()
            browser = response.json()
            return browser.get('state')
        
    def save_session_results(self, results: Dict):
        if self.environment == FinicEnvironment.LOCAL:
            path = os.path.join(os.getcwd(), f"results.json")
            with open(path, 'w') as f:
                json.dump(results, f, ensure_ascii=False, indent=4, default=lambda o: o.dict())
            print(f"Session results saved to: {path}")
        else:
            session_id = os.getenv("FINIC_SESSION_ID")
            response = requests.post(
                f"{self.url}/session-results/{session_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=results
            )
            response.raise_for_status()
            print(f"Session results saved for session: {session_id}")

    def get_session_results(self, session_id: Optional[str] = None) -> Optional[Dict]:
        if self.environment == FinicEnvironment.LOCAL:
            path = os.path.join(os.getcwd(), f"results.json")
            if os.path.exists(path):    
                with open(path, 'r') as f:
                    return json.load(f)
            else:
                return None
        else:
            if not session_id:
                session_id = os.getenv("FINIC_SESSION_ID")
            response = requests.get(
                f"{self.url}/session-results/{session_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()
            return response.json()
    
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
    
    def deploy_agent(self, agent_id: str, agent_name: str, num_retries: int, zip_file: str) -> bool:
        with open(zip_file, 'rb') as f:
            upload_file = f.read()
        response = requests.post(
            f"{self.url}/agent-upload-link/{agent_id}",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"agent_id": agent_id, "agent_name": agent_name, "num_retries": num_retries}
        )
        response.raise_for_status()
        upload_url = response.json()["upload_url"]
        response = requests.put(upload_url, data=upload_file)
        response.raise_for_status()
        return True
    
    