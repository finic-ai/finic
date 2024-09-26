from database import Database
import os
from deployer.deployer import Deployer
from models.models import AgentStatus
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("FINIC_API_KEY")
AGENT_ID = os.getenv("FINIC_AGENT_ID")


def main():
    db = Database()
    config = db.get_config(API_KEY)
    agent = db.get_agent(config=config, id=AGENT_ID)
    try:
        deployer = Deployer()
        deployer.deploy_agent(agent=agent)
        agent.status = AgentStatus.deployed
        db.upsert_agent(agent)
        return agent
    except Exception as e:
        agent.status = AgentStatus.failed
        db.upsert_agent(agent)
        raise e
