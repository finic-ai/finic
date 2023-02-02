import discord
from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import os
from dotenv import load_dotenv
import pinecone

load_dotenv()
intents = discord.Intents.all()
client = discord.Client(intents=intents)
openai = OpenAI(openai_api_key=os.environ.get('OPENAI_API_KEY'), temperature=0)
openai_embeddings = OpenAIEmbeddings(openai_api_key=os.environ.get('OPENAI_API_KEY'))
pinecone.init(api_key=os.environ.get('PINECONE_API_KEY'), environment="us-east1-gcp")
index = pinecone.Index("knowledgebase")
vectorstore = Pinecone(index, openai_embeddings.embed_query, "text")

chain = load_qa_with_sources_chain(openai)

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    print(message.content)
    if message.author == client.user:
        return

    if message.content.startswith('!help'):
        question = message.content[5:]
        response = chain(
            {
                "input_documents": vectorstore.similarity_search(question, k=4),
                "question": question,
            },
            return_only_outputs=True,
        )["output_text"]
        
        await message.channel.send(response)

client.run(os.environ.get('DISCORD_BOT_TOKEN'))