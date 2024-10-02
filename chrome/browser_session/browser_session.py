from playwright.async_api import async_playwright
import os
import websockets
import asyncio
import requests
from fastapi import (
    WebSocket,
)
from starlette.websockets import WebSocketDisconnect, WebSocketState
import websockets.client
from typing import Optional

import websockets.exceptions
import zipfile
import io
from finic_client import FinicClient

SESSION_PATH = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "chrome_context"
)

class BrowserSession:
    def __init__(self, port: int, browser_id: Optional[str] = None, finic_client: FinicClient = None):
        self.port = port
        self.browser_id = browser_id
        self.data_dir = os.path.join(SESSION_PATH, str(port))
        self.context = None
        self.client_websocket: Optional[WebSocket] = None
        self.finic_client = finic_client
        self.browser_websocket: Optional[websockets.client.WebSocketClientProtocol] = (
            None
        )
        self.browser_args = [
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

    async def connect(self, websocket: WebSocket):
        self.client_websocket = websocket
        async with async_playwright() as pw:
            # Delete the directory if it exists
            if os.path.exists(self.data_dir):
                os.system(f"rm -rf {self.data_dir}")

            if self.browser_id:
                await self.load_browser_state()

            self.context = await pw.chromium.launch_persistent_context(
                user_data_dir=self.data_dir,
                args=self.browser_args + [f"--remote-debugging-port={self.port}"],
                headless=False,
            )
            info = requests.get(f"http://localhost:{self.port}/json/version").json()
            CDP_WS = info["webSocketDebuggerUrl"]

            async with websockets.connect(CDP_WS) as browser_websocket:
                self.browser_websocket = browser_websocket
                print("Connected to remote WebSocket")

                async def browser_to_client(
                    browser_ws: websockets.client.WebSocketClientProtocol,
                    client_ws: WebSocket,
                ):
                    try:
                        while True:
                            message = await browser_ws.recv()
                            if client_ws.client_state == WebSocketState.CONNECTED:
                                await client_ws.send_text(message)
                    except websockets.exceptions.ConnectionClosed as e:
                        print(f"Remote WebSocket disconnected: {e}")
                        # Close the client WebSocket connection
                        if client_ws.client_state == WebSocketState.CONNECTED:
                            await client_ws.close()

                async def client_to_browser(
                    client_ws: WebSocket,
                    browser_ws: websockets.client.WebSocketClientProtocol,
                ):
                    try:
                        while True:
                            message = await client_ws.receive_text()
                            if browser_ws.open:
                                await browser_ws.send(message)
                    except WebSocketDisconnect as e:
                        print(f"Client WebSocket disconnected: {e}")
                        # Close the browser WebSocket connection
                        if browser_ws.open:
                            await browser_ws.close()

                # Create tasks to forward messages in both directions
                await asyncio.gather(
                    browser_to_client(browser_websocket, websocket),
                    client_to_browser(websocket, browser_websocket),
                )

    async def cleanup(self):
        try:
            if (
                self.context
                and self.context.browser
                and self.context.browser.is_connected()
            ):
                await self.context.close()
                print("Browser closed")
        except Exception as e:
            print(f"Error closing the browser: {e}")
        try:
            if self.browser_websocket and self.browser_websocket.open:
                await self.browser_websocket.close()
                print("Browser WebSocket closed")
        except Exception as e:
            print(f"Error closing the browser WebSocket: {e}")

        try:
            if (
                self.client_websocket
                and self.client_websocket.client_state == WebSocketState.CONNECTED
            ):
                await self.client_websocket.close()
                print("Client WebSocket closed")
        except Exception as e:
            print(f"Error closing the client WebSocket: {e}")

        if os.path.exists(self.data_dir):
            if self.browser_id:
                await self.save_browser_state()
            os.system(f"rm -rf {self.data_dir}")

    async def save_browser_state(self):
        # Get the signed upload URL for browser_id
        upload_url, encryption_key = self.finic_client.get_browser_state_upload_url(self.browser_id)

        # Zip the browser context directory into bytes buffer
        zip_buffer = io.BytesIO()

        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(self.data_dir):
                for file in files:
                    zipf.write(
                        os.path.join(root, file),
                        os.path.relpath(os.path.join(root, file), self.data_dir),
                    )

        encrypted_zip_buffer = await self._encrypt_file(zip_buffer, encryption_key)
        encrypted_zip_buffer.seek(0)

        self.finic_client.upload_browser_state(upload_url, encrypted_zip_buffer)

        

    async def load_browser_state(self):
        # Get the signed download URL for browser_id
        download_url, encryption_key = self.finic_client.get_browser_state_download_url(self.browser_id)

        if not download_url:
            return

        # Download the encrypted zip file
        encrypted_zip_buffer = io.BytesIO(requests.get(download_url).content)

        # Decrypt the zip file
        decrypted_zip_buffer = await self._decrypt_file(
            encrypted_zip_buffer, encryption_key
        )
        decrypted_zip_buffer.seek(0)

        # Unzip the decrypted zip file
        with zipfile.ZipFile(decrypted_zip_buffer, "r") as zipf:
            zipf.extractall(self.data_dir)

    async def _encrypt_file(self, file: io.BytesIO, key: str) -> io.BytesIO:
        # TODO: Encrypt the file using the key
        return file

    async def _decrypt_file(self, file: io.BytesIO, key: str) -> io.BytesIO:
        # TODO: Decrypt the file using the key
        return file
