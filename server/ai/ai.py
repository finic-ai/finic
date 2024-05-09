from models.models import Listing, NewsletterIssue
from typing import List
import locale
from openai import OpenAI
import os
import requests
import time
from langchain.text_splitter import TokenTextSplitter


class AI:

    def __init__(self):
        self.openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.apify_token = "apify_api_IaRNbj3z3Sh1SdDVmClugGknGPVzJQ1Yrt3m"
        self.actor_id = "aYG0l9s7dbB7j3gbS"

    async def scrape_website(self, url: str) -> str:
        # api_key = "apify_api_IaRNbj3z3Sh1SdDVmClugGknGPVzJQ1Yrt3m"
        # actor_id = "0flSYfcJmB0rfONjn"

        apify_endpoint = f"https://api.apify.com/v2/acts/{self.actor_id}/runs"

        url_params = {
            "token": self.apify_token,
            "waitForFinish": 60,
        }

        print("url: ", url)

        # url = "https://www.wewhistle.com/"

        response = requests.post(
            apify_endpoint,
            params=url_params,
            json={"maxCrawlDepth": 0, "startUrls": [{"url": url}]},
        )

        print(response.json())

        response_data = response.json()

        terminal_statuses = ["SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"]

        succeeded = response_data["data"]["status"] == "SUCCEEDED"
        finished = response_data["data"]["status"] in terminal_statuses
        run_id = response_data["data"]["id"]

        while not finished:
            run = requests.get(
                f"https://api.apify.com/v2/actor-runs/{run_id}",
                params={
                    "token": self.apify_token,
                },
            )
            run_data = run.json()
            print("apify scrape status: ", run_data["data"]["statusMessage"])
            succeeded = run_data["data"]["status"] == "SUCCEEDED"
            finished = run_data["data"]["status"] in terminal_statuses
            if not finished:
                time.sleep(60)
            if finished and not succeeded:
                raise Exception("Web scrape failed")

        run = requests.get(
            f"https://api.apify.com/v2/actor-runs/{run_id}/dataset/items",
            params={"token": self.apify_token},
        )
        results = run.json()

        website_content = results

        return website_content

    async def generate_description(self, url: str) -> str:

        website_content = await self.scrape_website(url)
        # website_content = "We are a company that does things"

        prompt = f"""Here is the website for a company. Generate a brief description, at most 10 sentences, of the company and its product or service. Separate it into paragraphs if needed. The description should be anonymized, so do not include the name of the company or its founders or employees anywhere.
  
----------------
{website_content}"""

        text_splitter = TokenTextSplitter(chunk_size=8000, chunk_overlap=0)

        chunks = text_splitter.split_text(prompt)

        prompt = chunks[0]

        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
