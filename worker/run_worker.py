from typing import Dict
import requests
import os
from dotenv import load_dotenv
import subprocess
import shutil
import time
load_dotenv()

class Worker:
    def __init__(self, agent_id: str, api_key: str):
        self.url = os.getenv("SERVER_URL")
        if not self.url:
            raise Exception("SERVER_URL is not set")
        self.agent_id = agent_id
        self.api_key = api_key

    def get_agent_code_download_url(self) -> str:
        print("Endpoint url: ", f"{self.url}/agent-download-link/{self.agent_id}")
        endpoint = f"{self.url}/agent-download-link/{self.agent_id}"
        response = requests.get(endpoint, headers={"Authorization": f"Bearer {self.api_key}"})
        if response.status_code == 200:
            if "download_url" in response.json():
                return response.json()["download_url"]
            else:
                raise Exception("No download URL found in response")
        else:
            raise Exception(f"Failed to download agent code: {response.status_code} {response.text}")

    def download_agent_code(self, download_url: str):
        response = requests.get(download_url)
        if response.status_code == 200:
            return response.content
        else:
            raise Exception(f"Failed to download agent code: {response.status_code} {response.text}")

    def unzip_agent_code(self, zip_content: bytes, project_path: str):
        import zipfile
        import io
        

        try:
            zip_buffer = io.BytesIO(zip_content)
            with zipfile.ZipFile(zip_buffer, 'r') as zip_ref:
                zip_ref.extractall(project_path)
        except Exception as e:
            raise Exception(f"Failed to unzip agent code: {e}")
    

def run_worker(agent_id: str, api_key: str, request: Dict):
    # Get the worker code from the server and unzip it into /project

    worker = Worker(agent_id, api_key)

    print("Downloading agent code") 

    download_url = worker.get_agent_code_download_url()
    zip_content = worker.download_agent_code(download_url)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_path = os.path.join(current_dir, "project")
    # Delete the project folder if it exists
    if os.path.exists(project_path):
        shutil.rmtree(project_path)
    worker.unzip_agent_code(zip_content, project_path)

    

    # Run the agent code by running poetry install and then poetry run start
    os.chdir(project_path)
    subprocess.run(["poetry", "install"])

    # Start Xvfb in the background
    xvfb_process = subprocess.Popen(["Xvfb", ":99", "-screen", "0", "1024x768x16"])

    # Give Xvfb a moment to start up
    # time.sleep(1)

    try:
        # Set the DISPLAY environment variable
        os.environ["DISPLAY"] = ":99"

        # Run the Poetry command
        subprocess.run(["poetry", "run", "start"])
    finally:
        # Make sure to terminate Xvfb when we're done
        xvfb_process.terminate()
        xvfb_process.wait()

if __name__ == "__main__":
    AGENT_ID = os.getenv("FINIC_AGENT_ID")
    FINIC_API_KEY = os.getenv("FINIC_API_KEY")
    run_worker(AGENT_ID, FINIC_API_KEY, {})
