from typing import Dict, Optional, List
from functools import wraps
import json
import yaml
import os
from enum import Enum
import requests
import datetime
import sys
from pydantic import BaseModel
from typing import Any, Union, Literal
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page, ElementHandle
from playwright.async_api import async_playwright, Browser as AsyncBrowser, BrowserContext as AsyncBrowserContext, Page as AsyncPage, ElementHandle as AsyncElementHandle
from dotenv import load_dotenv
from typing import Tuple

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

class AuthException(Exception):
    pass

class SelectorException(Exception):
    pass

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

class SelectorService:
    def __init__(self, selectors: Dict[str, str]):
        self.selectors = selectors

    def get(self, key: str) -> str:
        return self.selectors.get(key)
    
    def set(self, key: str, value: str):
        self.selectors[key] = value

class Finic:
    api_key: Optional[str] = None
    env: Optional[FinicEnvironment] = None
    context_storage_path: Optional[str] = None
    finic_url: Optional[str] = None
    selectors: Optional[SelectorService] = None

    def __init__(
        self,
        api_key: Optional[str] = None,
        environment: Optional[FinicEnvironment] = None,
        finic_url: Optional[str] = None,
        context_storage_path: Optional[str] = "browser_state.json",
        selector_source: Literal["file", "cloud"] = None,
        selector_file_path: Optional[str] = "selectors.yaml"
    ):

        default_env = os.environ.get("FINIC_ENVIRONMENT") or FinicEnvironment.LOCAL
        self.environment = environment if environment else FinicEnvironment(default_env)
        self.context_storage_path = context_storage_path
        if selector_source == "file":
            with open(selector_file_path, 'r') as file:
                self.selectors = SelectorService(yaml.safe_load(file))
        elif selector_source == "cloud":
            raise NotImplementedError("Cloud selector source not implemented")
        if api_key:
            self.api_key = api_key
        else:
            self.api_key = os.getenv("FINIC_API_KEY")
        self.finic_url = finic_url or "https://api.finic.io"

    def get_agent_input(self) -> Optional[Dict[str, Any]]:
        load_dotenv()
        if os.getenv("FINIC_INPUT"):
            return json.loads(os.getenv("FINIC_INPUT"))
        return None
    
    def save_browser_context(self, context: BrowserContext, browser_id: Optional[str] = None):
        if self.environment == FinicEnvironment.LOCAL:
            path = os.path.join(os.getcwd(), self.context_storage_path)
            context.storage_state(path=path)
            print(f"Browser context saved to: {path}")
        else:
            
            browser_id = browser_id or os.getenv("FINIC_BROWSER_ID")
            if not browser_id:
                return
            browser_context = context.storage_state()
            response = requests.post(
                f"{self.finic_url}/browser-state/{browser_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=browser_context
            )
            response.raise_for_status()
            browser = response.json()
            print(f"Browser context saved for browser: {browser['id']}")

    def get_browser_context(self, browser_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        if self.environment == FinicEnvironment.LOCAL:
            path = os.path.join(os.getcwd(), self.context_storage_path)
            if os.path.exists(path):
                with open(path, 'r') as f:
                    return json.load(f)
            else:
                return None
        else:
            browser_id = browser_id or os.getenv("FINIC_BROWSER_ID")
            if not browser_id:
                return None
            response = requests.get(
                f"{self.finic_url}/browser-state/{browser_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()
            browser = response.json()
            if browser and browser.get('state'):
                return browser.get('state')
            else:
                return None
        
    def save_session_results(self, results: List[Dict]):
        if self.environment == FinicEnvironment.LOCAL:
            path = os.path.join(os.getcwd(), f"results.json")
            with open(path, 'w') as f:
                json.dump(results, f, ensure_ascii=False, indent=4, default=lambda o: o.dict())
            print(f"Session results saved to: {path}")
        else:
            session_id = os.getenv("FINIC_SESSION_ID")
            response = requests.post(
                f"{self.finic_url}/session/{session_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"results": results}
            )
            response.raise_for_status()
            print(f"Session results saved for session: {session_id}")

    def get_session_results(self, session_id: Optional[str] = None) -> Optional[List[Dict]]:
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
                f"{self.finic_url}/session/{session_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()
            return response.json().get("results")
    
    def launch_browser_sync(self, **kwargs) -> Tuple[Page, BrowserContext]:
        video_dir = os.path.join(os.getcwd(), "session_recording")
        # If it doesn't exist, create it
        if not os.path.exists(video_dir):
            os.makedirs(video_dir)
        else:
            # Delete all files in the video directory
            for file in os.listdir(video_dir):
                os.remove(os.path.join(video_dir, file))
        playwright = sync_playwright().start()
        browser = playwright.chromium.launch(**kwargs)
        saved_context = self.get_browser_context()
        context = browser.new_context(storage_state=saved_context, record_video_dir=video_dir)
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)

        
        initial_page = context.new_page()
        recording_path_file = os.getenv("FINIC_SESSION_RECORDING_PATH")
        if recording_path_file:
            # Save the video path to the file
            with open(recording_path_file, "w") as f:
                path = initial_page.video.path()
                f.write(str(path))

        def disable_video(page: Page):
            page.on("close", lambda p: p.video.delete())

        context.on("page", disable_video)

        return initial_page, context
    
    async def launch_browser_async(self, browser_type: Optional[Literal["chromium", "firefox", "webkit"]] = "chromium", **kwargs) -> AsyncBrowserContext:
        playwright = async_playwright().start()
        browser = await getattr(playwright, browser_type).launch(**kwargs)
        context = await browser.new_context()
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
        
        try:
            if os.path.exists(self.context_storage_path):
                with open(self.context_storage_path, 'r') as f:
                    storage_state = json.load(f)
                    cookies = storage_state.get('cookies', [])
                    context.add_cookies(cookies)
        except Exception as e:
            print(f"Error loading storage state: {e}")

        return context
    
    @classmethod
    def screenshot(self, page: Union[Page, AsyncPage], selector: str, path: str) -> None:
        # Create a new div for screenshot
        page.evaluate("""() => {
            const outerContainer = document.createElement('div');
            outerContainer.id = 'screenshotOuterContainer';
            outerContainer.style.position = 'fixed';
            outerContainer.style.zIndex = '2147483647'; // Maximum z-index value
            outerContainer.style.top = '0';
            outerContainer.style.left = '0';
            outerContainer.style.width = '100%';
            outerContainer.style.height = '100%';
            outerContainer.style.backgroundColor = 'white';
            outerContainer.style.display = 'flex';
            outerContainer.style.justifyContent = 'center';
            outerContainer.style.alignItems = 'center';

            const innerContainer = document.createElement('div');
            innerContainer.id = 'screenshotInnerContainer';
            innerContainer.style.display = 'inline-block';

            outerContainer.appendChild(innerContainer);
            document.body.appendChild(outerContainer);
        }""")

        # Move the ad into the screenshot container
        cloned_element = page.evaluate_handle("""(selector) => {
            const innerContainer = document.getElementById('screenshotInnerContainer');
            const adElement = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            
            if (innerContainer && adElement) {
                const clone = adElement.cloneNode(true);
                const styles = window.getComputedStyle(adElement);
                
                clone.style.cssText = Array.from(styles).reduce((str, property) => {
                    return `${str}${property}:${styles.getPropertyValue(property)};`;
                }, '');
                
                // Reset positioning styles
                clone.style.position = 'static';
                clone.style.margin = '0';
                clone.style.width = 'auto';
                clone.style.height = 'auto';
                
                innerContainer.appendChild(clone);
                return clone;
            }
            return null;
        }""", selector)

        page.wait_for_selector(selector)  # Wait for the element to be added
        cloned_element.screenshot(path=path)

        # Remove the screenshot container div
        page.evaluate("""() => {
            const outerContainer = document.getElementById('screenshotOuterContainer');
            outerContainer.remove();
        }""")

    @classmethod
    def entrypoint(cls, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            config = {}
            if os.path.exists('finic_config.json'):
                with open('finic_config.json', 'r') as config_file:
                    config = json.load(config_file)
            inputs = config.get("args", {})

            result = func(*args, **kwargs, **inputs)

            with open('output.json', 'w') as output_file:
                json.dump(result, output_file)

            return result
        return wrapper

    @classmethod
    def procedure(cls, func):
        @wraps(func)
        def wrapper(page, *args, **kwargs):
            if not isinstance(page, Page):
                raise TypeError("The first argument must be a Page object")
            result = func(page, *args, **kwargs)
            if not isinstance(result, Page):
                raise TypeError("The function must return a Page object")
            return result
        return wrapper

    @classmethod
    def max_scroll(self, element: Union[Page, ElementHandle], timeout: int = 2000):
        last_height = element.evaluate('document.body.scrollHeight')
        while True:
            element.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            element.wait_for_timeout(timeout)
            new_height = element.evaluate('document.body.scrollHeight')
            if new_height == last_height:
                break
            last_height = new_height
        return new_height
    
    def deploy_agent(self, agent_id: str, agent_name: str, num_retries: int, zip_file: str) -> bool:
        with open(zip_file, 'rb') as f:
            upload_file = f.read()
        response = requests.post(
            f"{self.finic_url}/agent-upload-link/{agent_id}",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"agent_id": agent_id, "agent_name": agent_name, "num_retries": num_retries}
        )
        response.raise_for_status()
        upload_url = response.json()["upload_url"]
        response = requests.put(upload_url, data=upload_file)
        response.raise_for_status()
        return True
    
    
