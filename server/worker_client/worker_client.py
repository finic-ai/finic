import requests
import os

class WorkerClient:
    def __init__(self, url: str):
        self.url = os.getenv("WORKER_URL")

    def run_worker(self, session_id: str, browser_id: str, agent_id: str):
        response = requests.post(f"{self.url}/run-worker", json={"session_id": session_id, "browser_id": browser_id, "agent_id": agent_id})
        return response.json()

