import os
import sys
import json
import webbrowser
import asyncio
from dotenv import load_dotenv
from .finic import Finic
import subprocess
import argparse
from .selectors import generate_selectors, LLMProvider
def check_api_key():
    # Load existing .env file if it exists
    load_dotenv()
    
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


def deploy():
    api_key = check_api_key()

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

    finic = Finic(api_key=api_key, url=server_url)

    temp_dir = os.path.join(os.getcwd(), "temp")
    zip_file = os.path.join(temp_dir, "project.zip")

    # Create the /tmp directory if it doesn't exist
    os.makedirs(temp_dir, exist_ok=True)

    # Zip the project into /tmp/project.zip, ignoring all .gitignore patterns

    zip_files_cli(zip_file)

    result = finic.deploy_agent(agent_id, agent_name, num_retries, zip_file)

    print(result)

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
    

    # Generate selectors command
    generate_parser = subparsers.add_parser(
        'generate-selectors', 
        help='Opens a browser to generate selectors for the given url'
    )
    generate_parser.add_argument(
        '--api-key', 
        help='An API key for OpenAI or Anthropic must be provided to generate selectors',
        required=True
    )
    generate_parser.add_argument(
        '--url', 
        help='The URL of the page to generate selectors for',
        required=True
    )
    generate_parser.add_argument(
        '--llm-provider', 
        help='The LLM provider to use for generating selectors', 
        choices=['openai', 'anthropic'], default='openai'
    )

    args = parser.parse_args()

    if args.command == 'deploy':
        deploy()
    elif args.command == 'connect':
        pass
        # finic = Finic(api_key=args.api_key)
        # finic.launch_browser_sync(cdp_url=args.cdp_url)
    elif args.command == 'generate-selectors':
        
        asyncio.run(generate_selectors(LLMProvider(args.llm_provider.lower()), args.api_key, args.url))

if __name__ == "__main__":
    main()