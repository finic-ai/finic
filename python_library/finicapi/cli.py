import os
import sys
import json
from .finic import Finic


def create_finic_app(argv=sys.argv):
    if len(argv) < 2:
        print("Please specify the project directory:\n create-finic-app <project-name>")
        return
    directory_name = argv[1]

    os.system(
        f"git clone https://github.com/finic-ai/create-finic-app {directory_name}"
    )
    print(
        f"Finic app created successfully. cd into /{directory_name} and run `poetry install` to install dependencies"
    )


def deploy(argv=sys.argv):
    print("Enter your API key:")
    api_key = input()

    # Check if finic_config.json exists
    if not os.path.exists("finic_config.json"):
        print(
            "finic_config.json not found. Please create a finic_config.json file in the root directory of your project"
        )
        return

    server_url = None
    with open("finic_config.json", "r") as f:
        config = json.load(f)
        if "finic_url" in config:
            server_url = config["finic_url"]
        if "job_name" not in config:
            print("Please specify the job_name in the finic_config.json file")
            return
        job_name = config["job_name"]
        if "job_id" not in config:
            print("Please specify the job_id in the finic_config.json file")
            return
        job_id = config["job_id"]

    finic = Finic(api_key=api_key, url=server_url)

    temp_dir = os.path.join(os.getcwd(), "temp")
    zip_file = os.path.join(temp_dir, "project.zip")

    # Create the /tmp directory if it doesn't exist
    os.makedirs(temp_dir, exist_ok=True)

    # Zip the project into /tmp/project.zip, ignoring all .gitignore patterns

    os.system(
        f"git ls-files -z --others --exclude-standard | xargs -0 zip -r {zip_file} && git ls-files -z | xargs -0 zip -ur {zip_file}"
    )

    result = finic.deploy_job(job_id, job_name, zip_file)

    print(result)
