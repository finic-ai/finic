from models import InputSchema
from playwright.sync_api import sync_playwright, Playwright
import os
from finic import Finic
from dotenv import load_dotenv

load_dotenv(override=True)
FINIC_API_KEY = os.getenv("FINIC_API_KEY")
finic = Finic(
    api_key=FINIC_API_KEY,
)


def main():

    html_element = None

    # print("Running the Playwright script for user: ", input.user_id)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Navigate to the website and login
        page.goto("https://practicetestautomation.com/practice-test-login/")
        page.fill('input[name="username"]', "student")
        page.fill('input[name="password"]', "Password123")
        page.click('button[id="submit"]')

        # Wait for the home page to load
        page.wait_for_load_state("networkidle", timeout=10000)

        # Get the <p> tag
        html_element = page.inner_html("p")
        browser.close()

    print(html_element)
