import asyncio
from playwright.sync_api import sync_playwright, Playwright
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")


TEST_DATA = {
    "url": "https://testpages.herokuapp.com/styled/basic-html-form-test.html",
    "form_data": {
        "username": "finictest",
        "password": "Password123",
        "comment": "This is a test comment",
        "checkbox_values": ["cb1", "cb2"],
        "radio_value": "rd3",
        "multi_select_values": ["ms1", "ms2"],
        "dropdown_value": "dd5"
    }
}

def main():
    url = TEST_DATA["url"]
    form_data = TEST_DATA["form_data"]

    print("Running the Playwright script")

    with sync_playwright() as p:
        print("Connecting to Browser...")
        
        browser = p.chromium.connect_over_cdp(f"ws://localhost:8000/ws?api_key={API_KEY}&browser_id=test_browser")

        ### Uncomment this line if you want to run the script without Finic
        # browser = p.chromium.launch(headless=False, slow_mo=500)
        
        page = browser.new_page()

        # Navigate to the website and login
        page.goto(url)
        page.wait_for_load_state("networkidle", timeout=10000)

        page.fill('input[name="username"]', form_data["username"])
        page.fill('input[name="password"]', form_data["password"])
        page.fill('textarea[name="comments"]', form_data["comment"])
        
        # click on the input 
        # import pdb; pdb.set_trace()
        page.check('input[type="radio"][value="{}"]'.format(form_data["radio_value"]))
        for checkbox_value in form_data["checkbox_values"]:
            page.check('input[type="checkbox"][value="{}"]'.format(checkbox_value))
        page.select_option('select[name="multipleselect[]"]', value=form_data["multi_select_values"])
        page.select_option('select[name="dropdown"]', value=form_data["dropdown_value"])

        page.click('input[type="submit"]')

        # Check if page confirms our success
        form_results = page.query_selector('.form-results')
        if form_results:
            # Query for the element with class "centered form-results"
            print(form_results.inner_text())
            print("\nForm submission successful")
        else:
            print("Form submission was not successful")

        # Set a timeout of 2 seconds
        page.wait_for_timeout(2000)
        # import pdb; pdb.set_trace()
        browser.close()


if __name__ == "__main__":
    main()
