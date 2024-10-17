from playwright.sync_api import sync_playwright
import time
import os
import subprocess
import requests
def record(url, api_key):
    # Run the playwright codegen command
    current_dir = os.path.dirname(os.path.abspath(__file__))    
    subprocess.run(["playwright", "codegen", url, "--save-trace=" + current_dir + "/codegen_trace.zip"])

    # Get upload url
    upload_url = "https://api.apiflash.com/v1/urltoimage"

    # Upload the trace
    response = requests.post(upload_url, data={"url": url, "api_key": api_key})
    print(response.json())
        

record("https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&media_type=all&search_type=page&view_all_page_id=108521893501", "")


# playwright codegen "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&media_type=all&search_type=page&view_all_page_id=108521893501" --save-trace=codegen_trace.zip

# codegen_trace.zip

