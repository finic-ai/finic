from typing import Dict, Optional, List
from functools import wraps
import json
import os
from enum import Enum
import requests
import datetime
import sys
from pydantic import BaseModel
from typing import Any, Union, Literal
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page, ElementHandle
from playwright.async_api import async_playwright, Browser as AsyncBrowser, BrowserContext as AsyncBrowserContext, Page as AsyncPage, ElementHandle as AsyncElementHandle

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

def on_browser_disconnected(browser_context: Union[BrowserContext, AsyncBrowserContext]):
    print("Browser disconnected")
    storage_state_path = os.path.join(os.getcwd(), f"storage_state.json")
    browser_context.storage_state(path=storage_state_path)
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
    
    def save_context(self, context: Union[BrowserContext, AsyncBrowserContext], path: Optional[str] = None):
        if path:
            self.context_storage_path = path
        context.storage_state(path=self.context_storage_path)
        print(f"Browser context saved to: {self.context_storage_path}") 
    
    def launch_browser_sync(self, browser_type: Optional[Literal["chromium", "firefox", "webkit"]] = "chromium", **kwargs) -> BrowserContext:
        playwright = sync_playwright().start()
        browser = getattr(playwright, browser_type).launch(**kwargs)
        context = browser.new_context()
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
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
    
    async def launch_browser_async(self, browser_type: Optional[Literal["chromium", "firefox", "webkit"]] = "chromium", **kwargs) -> AsyncBrowserContext:
        playwright = async_playwright().start()
        browser = await getattr(playwright, browser_type).launch(**kwargs)
        context = await browser.new_context()
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
        context.on("disconnected", on_browser_disconnected)
        
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
