import uvicorn
from fastapi import (
    FastAPI,
    Request,
    status,
    WebSocket,
    Query,
)
from starlette.websockets import WebSocketState
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
import logging
from browser_session import BrowserSession
from port_manager import PortManager
from playwright.async_api import async_playwright
from finic_client import FinicClient

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the list of allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer_scheme = HTTPBearer()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
    logging.error(f"{request}: {exc_str}")
    content = {"status_code": 10422, "message": exc_str, "data": None}
    return JSONResponse(
        content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )


port_manager = PortManager(max_connections=10)


@app.get("/test")
async def test():
    browser_args = [
        "--window-size=1300,570",
        "--window-position=000,000",
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--disable-web-security",
        "--disable-features=site-per-process",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--use-gl=egl",
        "--disable-blink-features=AutomationControlled",
        "--disable-background-networking",
        "--enable-features=NetworkService,NetworkServiceInProcess",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-extensions-with-background-pages",
        "--disable-default-apps",
        "--disable-extensions",
        "--disable-features=Translate",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-popup-blocking",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-sync",
        "--force-color-profile=srgb",
        "--metrics-recording-only",
        "--enable-automation",
        "--password-store=basic",
        "--use-mock-keychain",
        "--hide-scrollbars",
        "--mute-audio",
    ]
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            args=browser_args + [f"--remote-debugging-port=9222"],
            headless=False,
        )
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto("https://example.com")
        html = await page.content()
        await browser.close()

    return {"html": html}


@app.websocket("/ws")
async def websocket_proxy(
    websocket: WebSocket, 
    api_key: str = Query(...), 
    browser_id: str = Query(...)
):
    print("WebSocket connection accepted")
    await websocket.accept()
    error = None

    client = FinicClient(api_key=api_key)

    client.start_session(browser_id=browser_id)

    # Find an available port
    port = port_manager.get_available_port()
    if not port:
        raise Exception("Maximum number of connections reached")
    port_manager.mark_port_as_used(port)

    try:
        

        session = BrowserSession(port=port, browser_id=browser_id, finic_client=client)
        await session.connect(websocket=websocket)

    except Exception as e:
        error = e
        print(f"WebSocket connection error: {e}")
    finally:
        port_manager.mark_port_as_available(port)
        await session.cleanup()
        if error:
            raise error
        if not websocket.client_state == WebSocketState.DISCONNECTED:
            await websocket.close()
            print("WebSocket connection closed by server")


def start():
    uvicorn.run(
        "chrome.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_excludes="chrome_data/**",
    )
