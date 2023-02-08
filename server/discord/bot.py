import discord
from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import os
from dotenv import load_dotenv
import pinecone
import requests

load_dotenv()
intents = discord.Intents.all()
client = discord.Client(intents=intents)
API_URL=os.environ.get('API_URL')

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('!help'):
        question = message.content[5:]

        try:
            response = requests.post(API_URL, json={
                'conversation_transcript': '', 
                'last_message': question,
                'conversation_id': 'conversation_id',
                'site_id': message.guild.id
            }).json()['response']

            await message.channel.send(response)

        except Exception as e:    
            return
        
        

client.run(os.environ.get('DISCORD_BOT_TOKEN'))