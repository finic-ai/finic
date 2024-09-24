from playwright.sync_api import sync_playwright, Playwright


with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
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
    print(html_element)
    browser.close()
