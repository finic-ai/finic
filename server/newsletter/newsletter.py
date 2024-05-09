from models.models import Listing, NewsletterIssue
from typing import List
import locale
from openai import OpenAI
import os
from babel.numbers import format_currency


class Newsletter:

    def __init__(self):
        self.openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def generate_newsletter(
        self, listings: List[Listing], previous_issue: NewsletterIssue
    ) -> NewsletterIssue:
        id = previous_issue.id + 1

        message = f"""Dealwise Newsletter #{id}
Hi Dealwise subscriber,
        
Here are some listings that were just added to Dealwise.

🌟 Selected Listings

"""

        for listing in listings:
            listing.revenue
            message += f"<https://app.godealwise.com/listing?id={listing.id}|{listing.description}>\n"
            message += self.summarize_listing_description(listing) + "\n\n"
            if listing.revenue:
                message += f"💰 {self.format_currency(listing.revenue)} in ARR"
                if listing.annual_growth_percent:
                    message += f", growing {listing.annual_growth_percent}% YoY"
                message += "\n"
            if listing.ebitda:
                if listing.ebitda >= 0:
                    message += f"📊 {self.format_currency(listing.ebitda)} in EBITDA\n"
                else:
                    message += f"📊 Not profitable\n"
            if listing.type:
                message += f"🏢 Type: {listing.type}\n"
            if listing.funding_raised:
                message += f"🏦 {self.format_currency(listing.funding_raised)} in funding raised\n"
            if listing.num_employees:
                message += f"👥 Employees: {listing.num_employees}\n"

            message += "\n"
            message += f"{self.ideal_buyer_profile(listing)}\n"

        message += "\n"
        message += f"You can browse all 50+ listings <https://app.godealwise.com/?utm_source=blog.godealwise.com&utm_medium=newsletter&utm_campaign=dealwise-newsletter-{id}|here>.\n\n"

        message += "Don't hesitate to reach out if you have any questions.\n\n"

        message += f"""Best,
<https://www.linkedin.com/in/jasonwcfan/?utm_source=blog.godealwise.com&utm_medium=newsletter&utm_campaign=dealwise-newsletter-{id}|Jason Fan>
CEO, Dealwise
https://godealwise.com
"""

        return NewsletterIssue(id=id, content=message)

    def format_currency(self, revenue: float):
        # locale.setlocale(locale.LC_ALL, "en_US.UTF-8")
        # display_string = locale.currency(revenue, grouping=True)
        return format_currency(revenue, "USD", locale="en_US")

    def summarize_listing_description(self, listing: Listing) -> str:
        prompt = f"""Summarize the following company description in at most 3-5 sentences:

----------------
{listing.detailed_description}"""
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt},
            ],
        )
        print(response.choices)
        return response.choices[0].message.content

    def ideal_buyer_profile(self, listing: Listing) -> str:
        prompt = f"""Generate an ideal buyer profile for the following company. Describe what kind of company would want to purchase the listing. Do not name any specific companies or individuals. Start your answer with 'Ideal for:' and limit your answer to 2 sentences max.
  
----------------
{listing.description}
{listing.detailed_description}"""
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
