import asyncio
from playwright.async_api import async_playwright, Playwright
import requests

CDP_URL = "ws://localhost:8000/ws"


async def run(pw: Playwright):
    print("Connecting to Scraping Browser...")
    browser = await pw.chromium.connect_over_cdp(CDP_URL)
    try:
        print("Connected! Navigating...")
        page = await browser.new_page()
        await page.goto("https://example.com", timeout=2 * 60 * 1000)
        print("Navigated! Scraping page content...")
        html = await page.content()
        print(html)
    finally:
        await browser.close()


async def main():
    async with async_playwright() as playwright:
        await run(playwright)


asyncio.run(main())
