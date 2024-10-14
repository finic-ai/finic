import os
import sys
import json
import webbrowser
import asyncio
from dotenv import load_dotenv
from .finic import Finic
import subprocess
import argparse
from .copilot import copilot

load_dotenv(override=True)

def get_api_key() -> str:
    
    # Check if API key exists   
    api_key = os.getenv('FINIC_API_KEY')
    
    if not api_key:
        # Open browser for login
        print("No Finic API key found. Create a new account? (y/n)")
        create_account = input()
        if create_account == "y":
            print("Please log in to Finic in the opened browser.")
            print("After logging in, copy the API key from the Settings page and paste it here.")
            webbrowser.open('https://app.finic.io/settings')
        
        print("Enter your API key:")
        api_key = input()
        
        # Save API key to .env file
        with open('.env', 'a') as env_file:
            env_file.write(f'\nFINIC_API_KEY={api_key}')
        
        print("API key has been saved to .env file.")
    
    return api_key

def zip_files_cli(zip_file):
    try:
        # First zip command (for untracked files)
        command_1 = (
            f"git ls-files -z --others --exclude-standard | xargs -0 zip -r {zip_file}"
        )
        subprocess.run(
            command_1, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )

        # Second zip command (for tracked files)
        command_2 = f"git ls-files -z | xargs -0 zip -ur {zip_file}"
        subprocess.run(
            command_2, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )

        print(f"Zipped files into {zip_file}")

    except subprocess.CalledProcessError as e:
        print(f"Error occurred during zipping: {e}")


def finic_init():
    current_directory = os.getcwd()
    new_directory_path = os.path.join(current_directory, "finic_tasks")
    
    # Check if the directory already exists
    if os.path.exists(new_directory_path):
        print("Error: The directory 'finic_tasks' already exists.")
        return
    
    # Create the new directory
    os.makedirs(new_directory_path)
    
    # Change to the new directory
    os.chdir(new_directory_path)

    os.system(
        f"git clone --depth 1 https://github.com/finic-ai/finic-tasks-boilerplate . && rm -rf .git"
    )
    print(
        f"The /finic_tasks directory has been created.\ncd into it and run `poetry install` to install dependencies, then `finic copilot` to create your first task."
    )


def deploy():
    api_key = get_api_key()

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
        if "agent_name" not in config:
            print("Please specify the agent_name in the finic_config.json file")
            return
        agent_name = config["agent_name"]
        if "agent_id" not in config:
            print("Please specify the agent_id in the finic_config.json file")
            return
        agent_id = config["agent_id"]
        if "num_retries" not in config:
            print("Please specify the num_retries in the finic_config.json file")
            return
        num_retries = config["num_retries"]

    finic = Finic(api_key=api_key, finic_url=server_url)

    temp_dir = os.path.join(os.getcwd(), "temp")
    zip_file = os.path.join(temp_dir, "project.zip")

    # Create the /tmp directory if it doesn't exist
    os.makedirs(temp_dir, exist_ok=True)

    # Zip the project into /tmp/project.zip, ignoring all .gitignore patterns

    zip_files_cli(zip_file)

    result = finic.deploy_agent(agent_id, agent_name, num_retries, zip_file)

    if result:
        print(f"Agent with ID {agent_id} deployed successfully")
    else:
        print("Agent deployment failed")

def main():
    parser = argparse.ArgumentParser(description="CLI for Finic's python library.")
    subparsers = parser.add_subparsers(dest='command', required=True)

    # Deploy command
    deploy_parser = subparsers.add_parser(
        'deploy', 
        help='Deploy the agent to Finic cloud'
    )

    # Connect to remote browser command
    connect_to_browser_parser = subparsers.add_parser(
        'connect', 
        help='Connects to a remote browser'
    )

    connect_to_browser_parser.add_argument(
        '--cdp-url', 
        help='The URL of the browser to connect to',
        required=True
    )
    connect_to_browser_parser.add_argument(
        '--api-key', 
        help='A Finic API key',
        required=True
    )

    # Initialize Finic directory command
    init_parser = subparsers.add_parser(
        'init', 
        help='Initialize a Finic directory'
    )
    

    # Generate selectors command
    generate_parser = subparsers.add_parser(
        'copilot', 
        help='Start the Finic copilot'
    )
    generate_parser.add_argument(
        '--url', 
        help='The URL of the starting page of the workflow',
        required=True
    )

    args = parser.parse_args()

    finic_api_key = get_api_key()

    if args.command == 'deploy':
        deploy()
    elif args.command == 'init':
        finic_init()
    elif args.command == 'copilot':
        asyncio.run(copilot(args.url, finic_api_key))

if __name__ == "__main__":
    main()