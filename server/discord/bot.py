import discord
from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.faiss import FAISS
from bs4 import BeautifulSoup
import requests

intents = discord.Intents.all()
client = discord.Client(intents=intents)
openai = OpenAI(openai_api_key='<OPENAI_API_KEY>', temperature=0)
openai_embeddings = OpenAIEmbeddings(openai_api_key='<OPENAI_API_KEY>')

def gather_search_index(urls):
    documents = []

    for url in urls:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text()
        documents.append(Document(
            page_content=text,
            metadata={"source": url},
        ))
    index = FAISS.from_documents(documents, openai_embeddings)
    return index

search_index = gather_search_index(["https://supertokens.com/docs/thirdpartyemailpassword/common-customizations/core/logging"])
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
                "input_documents": search_index.similarity_search(question, k=4),
                "question": question,
            },
            return_only_outputs=True,
        )["output_text"]
        
        await message.channel.send(response)

client.run('<DISCORD_BOT_TOKEN>')