from typing import Dict
import requests
import os
class Worker:
    def __init__(self, agent_id: str, api_key: str):
        self.url = os.getenv("SERVER_URL")
        self.agent_id = agent_id
        self.api_key = api_key

    def get_agent_code_download_url(self) -> str:
        endpoint = f"{self.url}/download-agent-code/{self.agent_id}"
        response = requests.get(endpoint)
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

    download_url = worker.get_agent_code_download_url()
    zip_content = worker.download_agent_code(download_url)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_path = os.path.join(current_dir, "project")
    worker.unzip_agent_code(zip_content, project_path)

    # Run the agent code by running poetry install and then poetry run start
    os.chdir(project_path)
    os.system("poetry install")
    os.system("poetry run start")

if __name__ == "__main__":
    run_worker()