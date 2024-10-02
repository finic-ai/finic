<h2 align="center">
🦊 Finic
</h2>

<p align="center">
  <p align="center">A fleet of stealth browsers at your fingertips.</p>
</p>
<p align="center">
<a href="https://github.com/finic-ai/finic/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/static/v1?label=license&message=Apache 2.0&color=blue" alt="License">
</a>
<a href="https://github.com/finic-ai/finic/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
    <img src="https://img.shields.io/github/issues-closed/psychicapi/psychic?color=blue" alt="Issues">
</a>
  <a href="https://docs.finic.io/" target="_blank">
    <img src="https://img.shields.io/badge/documentation-blue">
  </a>
  <a href="https://www.ycombinator.com/companies/finic" target="_blank">
    <img src="https://img.shields.io/badge/Backed%20by%20Y%20Combinator-orange">
  </a>

  <a href="https://discord.gg/eyZMSxBPsd" target="_blank">
    <img src="https://img.shields.io/discord/1131844815005429790?logo=discord">
  </a>

</p>

[Finic](https://finic.ai/) provides browser infrastructure for developers building web scrapers, browser automations, and AI agents in Python. It does this by giving you a browser in the cloud you can control remotely using Playwright or Puppeteer (in just a few lines), or Selenium (with some work).

Finic is designed to be **unopionated about the development process**, and simply provide browser and network-level utilities to make sure your automations don't get blocked.

# Quickstart

```bash
git clone https://github.com/finic-ai/finic.git
```

## Running Locally

Run the image locally the same as any other Docker container.

```bash
sudo docker-compose up --build
```

Once the container is running, you can connect to it like this.

```python
CDP_URL = "ws://localhost:8000/ws"

async def main():
    print("Connecting to Browser...")
    async with async_playwright() as pw:
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

asyncio.run(main())
```

Or run `python testscript.py` to test out the container.

If you want to use a Finic browser with an existing project, simply replace this line:

```python
browser = playwright.chromium.launch(headless=False)
```

with this one:
with this:

```
browser = playwright.chromium.connect_over_cdp("ws://localhost:8080/ws")
```
