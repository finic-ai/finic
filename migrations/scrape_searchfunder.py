import requests
from bs4 import BeautifulSoup

# Define the base URL and profile URL template
base_url = "https://www.searchfunder.com/user/listajax/?page="
profile_url_template = "https://www.searchfunder.com/user/profilecard/"

# Define the request headers
headers = {
    "authority": "www.searchfunder.com",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "max-age=0",
    "Cookie": "_ga=GA1.2.1262053508.1712619214; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6ImN0VWFjczRWSllOMU5idVRYWE1qZ3c9PSIsInZhbHVlIjoiZjd6XC9EaTdybmEyaXRGcXp0UnJTUHNwYVhyMUt0XC91Y3dudTJhUVdJVUFLVHlPWGpTKzZqSVdhdHNCVlVOQnJPQWpKUG9mNXBWMFh2ejlBMFRJeXh3emNTQVNPUk85N25mYXBRSnlsUE5VRT0iLCJtYWMiOiJlNGE0YmQ0NWM2YjY5YjZkYTc5ODQwYzAyZDkyOGQzMTI2NGZiNGEzMTA2ZDgyZWZlNDdmNDFhN2EyYzMzMzk1In0%3D; __stripe_mid=528e391d-3534-4bba-ac1f-9d98b91887843c8265; _gid=GA1.2.1263430132.1716773147; __stripe_sid=7024d47a-957a-4408-aceb-5d37e1f3503a6e7edb; _ga_RBV3L76M98=GS1.2.1717030734.22.1.1717032515.0.0.0; XSRF-TOKEN=eyJpdiI6IkhFdHI3VE1yZlNieGQwZU82U2xCVWc9PSIsInZhbHVlIjoiWnh6OVR2RHB6S1wvS2FGNXhcL0FtUFwvVFwvS3VhYURGd3RkNWRkOURDcWpjSGd1MXlicG45QXBRd0h6Y2Y2NUE0WjNyM0c0SmJkWEorQnVsUGdoZlRHcmFnPT0iLCJtYWMiOiIyNzQxNGI3ZTc3ZjFjMGE3Y2E0MjQ0ODg1MTUxOGZiNzUyMjZlZjY1MjQ1ZTQ1MjFkYjZkOTI1ZGM3NjQwZDdkIn0%3D; laravel_session=eyJpdiI6ImExeEpQVW1cL0J0XC9jalA5S21WaE9LQT09IiwidmFsdWUiOiJXTjkxZVpKblwvbml1dlZ5bmJBOE9iOU5BdkNidGdTeDF4cEZiY05mdklcL245TkZWNlwvZkJweHl0VlErVTU3d3IzQTNQeFBmOEsrNnBoNGZocHYxcG5sdz09IiwibWFjIjoiZjRlYTRjNjcyNjM0ZDBmYmE4ZjQxNzQ0MDZiMmY0MTcyNjNlM2IyOTBmNDU0MjY4MjJlNTIwMjEwYjU4NzY5YiJ9",
    "Priority": "u=0, i",
    "Sec-Ch-Ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
}


# Function to extract user IDs from a page
def extract_user_ids(page_content):
    soup = BeautifulSoup(page_content, "html.parser")
    user_elements = soup.find_all(attrs={"data-user_id": True})
    user_ids = [elem["data-user_id"] for elem in user_elements]
    print(user_ids)
    return user_ids


# Function to get LinkedIn URL for a given user ID
def get_linkedin_url(user_id):
    response = requests.get(profile_url_template + str(user_id), headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        linkedin_url = None
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]
            if "linkedin.com" in href:
                linkedin_url = href
                break
        return linkedin_url
    return None


# Main loop to get user IDs and LinkedIn URLs
all_linkedin_urls = []

BATCH_1 = [1, 100]
batch = BATCH_1
import time
import random

for page_number in range(batch[0], batch[1]):  # Loop through the first 10 pages
    page_url = base_url + str(page_number) + "&role=searcher"
    page_response = requests.get(page_url, headers=headers)
    print(page_response)
    print(page_response.next)

    if page_response.status_code == 200:
        user_ids = extract_user_ids(page_response.content)

        # remove duplicates
        user_ids = list(set(user_ids))

        for user_id in user_ids:
            linkedin_url = get_linkedin_url(user_id)
            if linkedin_url:
                all_linkedin_urls.append(linkedin_url)
    else:
        break  # Stop if we hit a page that doesn't load correctly

    # wait for a while before making the next request. random time between 1 and 5 seconds
    time.sleep(1 + 4 * random.random())

# Output all LinkedIn URLs
# output to csv

import csv

with open(f"linkedin_urls{batch[0]}-{batch[1]}.csv", mode="w") as file:
    writer = csv.writer(file)
    writer.writerow(["linkedin_url"])
    for url in all_linkedin_urls:
        writer.writerow([url])
