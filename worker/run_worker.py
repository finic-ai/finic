from typing import Dict
from enum import Enum
import requests
import os
from dotenv import load_dotenv
import subprocess
import shutil
import time
load_dotenv()

class SessionStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
    RUNNING = "running"

class Worker:
    def __init__(self, agent_id: str, api_key: str):
        self.url = os.getenv("FINIC_SERVER_URL")
        if not self.url:
            raise Exception("FINIC_SERVER_URL is not set")
        self.session_id = os.getenv("FINIC_SESSION_ID")
        if not self.session_id:
            raise Exception("FINIC_SESSION_ID is not set")
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
        
    def get_session_recording_upload_url(self):
        endpoint = f"{self.url}/session-recording-upload-link/{self.session_id}"
        response = requests.get(endpoint, headers={"Authorization": f"Bearer {self.api_key}"})
        if response.status_code == 200:
            return response.json()["upload_url"]
        else:
            raise Exception(f"Failed to get session recording upload URL: {response.status_code} {response.text}")
    
    def upload_session_recording(self, upload_url: str, recording: bytes):
        response = requests.put(upload_url, data=recording)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to upload session recording: {response.status_code} {response.text}")

    def unzip_agent_code(self, zip_content: bytes, project_path: str):
        import zipfile
        import io
        

        try:
            zip_buffer = io.BytesIO(zip_content)
            with zipfile.ZipFile(zip_buffer, 'r') as zip_ref:
                zip_ref.extractall(project_path)
        except Exception as e:
            raise Exception(f"Failed to unzip agent code: {e}")
        
    def update_session_status(self, status: SessionStatus):
        endpoint = f"{self.url}/session/{self.session_id}"
        response = requests.post(endpoint, headers={"Authorization": f"Bearer {self.api_key}"}, json={"status": status})
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to update session status: {response.status_code} {response.text}")
        
    def send_logs(self, logs):
        try:
            # response = requests.post(
            #     "https://your-endpoint-url.com/logs",  # Replace with your actual endpoint
            #     json={"logs": logs}
            # )
            # response.raise_for_status()
            # print(f"Logs sent successfully: {response.status_code}")
            print(f"Logs: {logs}")
        except requests.RequestException as e:
            print(f"Failed to send logs: {e}")
        
    def collect_and_record_logs(self, proc: subprocess.Popen):
        all_logs = []
        while True:
            # Read logs line by line (non-blocking)
            stdout_line = proc.stdout.readline()
            stderr_line = proc.stderr.readline()
            
            if stdout_line:
                all_logs.append(stdout_line)
            if stderr_line:
                all_logs.append(stderr_line)

            # Send logs every 5 seconds if there are any
            if all_logs:
                self.send_logs(all_logs)
                all_logs.clear()

            # Check if the process is complete
            if proc.poll() is not None and not stdout_line and not stderr_line:
                break

            # Sleep for 5 seconds before sending next batch
            time.sleep(5)

    

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

    

    

    # Start Xvfb in the background
    xvfb_process = subprocess.Popen(["Xvfb", ":99", "-screen", "0", "1024x768x16"])

    session_recording_path_file = os.path.join(os.getcwd(), "session_recording_path.txt")
    os.environ["FINIC_SESSION_RECORDING_PATH"] = session_recording_path_file

    # Give Xvfb a moment to start up
    # time.sleep(1)
    status = SessionStatus.RUNNING
    try:
        # Run the agent code by running poetry install and then poetry run start
        os.chdir(project_path)
        proc = subprocess.Popen(
            ["poetry", "install"], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        collect_and_record_logs(proc)
        proc.wait()
        # Set the DISPLAY environment variable
        os.environ["DISPLAY"] = ":99"

        # Run the Poetry command
        subprocess.run(["poetry", "run", "start"], check=True)
        status = SessionStatus.SUCCESS
    except subprocess.CalledProcessError as e:
        print(f"Error running agent: {e}")
        print(f"Command output:\n{e.output}")
        status = SessionStatus.FAILED
        raise  # Re-raise the exception to ensure the error is propagated
    except Exception as e:
        print(f"Unexpected error: {e}")
        status = SessionStatus.FAILED
        raise
    finally:
        # Make sure to terminate Xvfb when we're done
        xvfb_process.terminate()
        xvfb_process.wait()
        # Update the session status to success
        worker.update_session_status(status)
        if os.path.exists(session_recording_path_file):
            with open(session_recording_path_file, "r") as f:
                session_recording_path = f.read()
            
                if os.path.exists(session_recording_path):  
                    with open(session_recording_path, "rb") as f:
                        file_bytes = f.read()
                    upload_url = worker.get_session_recording_upload_url()
                    worker.upload_session_recording(upload_url, file_bytes)
                else:
                    print("Session recording path does not exist")


if __name__ == "__main__":
    AGENT_ID = os.getenv("FINIC_AGENT_ID")
    FINIC_API_KEY = os.getenv("FINIC_API_KEY")
    run_worker(AGENT_ID, FINIC_API_KEY, {})
