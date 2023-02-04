from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.text_splitter import CharacterTextSplitter
import pinecone
from bs4 import BeautifulSoup
import requests
import csv
import sys
import time
import os
import json
from dotenv import load_dotenv
import webvtt

load_dotenv()
openai = OpenAI(openai_api_key=os.environ.get('OPENAI_API_KEY'), temperature=0)
openai_embeddings = OpenAIEmbeddings(openai_api_key=os.environ.get('OPENAI_API_KEY'))

pinecone.init(api_key=os.environ.get('PINECONE_API_KEY'), environment="us-east1-gcp")
index = pinecone.Index("knowledgebase")
vectorstore = Pinecone(index, openai_embeddings.embed_query, "text")

def gather_search_index_from_urls(urls):
    documents = []
    metadatas = []
    ids = []

    
    for i in range(len(urls)):
        url = urls[i]
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text()
        documents.append(text)
        metadatas.append({"source": url})
        ids.append(str(i))
    vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)

def gather_search_index_from_csv(filename):
    documents = []
    metadatas = []
    ids = []
    with open(filename, newline='') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',', quotechar='\"')

        id = 0
        for row in csvreader:
            # ignore the first row
            if row[2] == 'title' and row[3] == 'desc-un-html':
                continue

            print(id)
            url = row[1]
            title = row[2]
            body = row [3]
            documents.append("{0} {1}".format(title, body))
            metadatas.append({"source": url})
            ids.append(str(id))
            id += 1 

            if len(documents) == 20:
                vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)
                documents = []
                metadatas = []
                ids = []
                time.sleep(1)
    
    vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)

def gather_search_index_from_json(filename):
    documents = []
    metadatas = []
    ids = []
    splitter = CharacterTextSplitter(separator=" ", chunk_size=1024, chunk_overlap=0)

    with open(filename, newline='') as jsonfile:
        jsonreader = json.load(jsonfile)

        id = 0
        for article in jsonreader:
            print(id)
            url = article['url']
            title = article['title']
            subtitle = article['subtitle']
            body = article['body']
            document = "{0} {1} {2}".format(title, subtitle, body)
            for chunk in splitter.split_text(document):
                documents.append(chunk)
                metadatas.append({"source": url})
                ids.append(str(id))
                id += 1 

                if len(documents) == 20:
                    print(metadatas)
                    vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)
                    documents = []
                    metadatas = []
                    ids = []
                    time.sleep(1)
    
    vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)

def gather_search_index_from_video_transcripts(folder_path):
    documents = []
    metadatas = []
    ids = []

    id = 0
    for filename in os.listdir(folder_path):
        if not filename.endswith('.vtt'):
            continue
        transcript = ""
        for caption in webvtt.read(os.path.join(folder_path, filename)):
            transcript += caption.text + " "

            if len(transcript) >= 1024:
                documents.append(transcript)
                metadatas.append({"source": filename[:-4]})
                ids.append(str(id))
                transcript = ""
                id += 1
                if len(documents) == 20:
                    print(metadatas)
                    vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)
                    documents = []
                    metadatas = []
                    ids = []
                    time.sleep(1)
        if len(transcript) > 0:
            documents.append(transcript)
            metadatas.append({"source": filename[:-4]})
            ids.append(str(id))
            id += 1
            if len(documents) == 20:
                print(metadatas)
                vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)
                documents = []
                metadatas = []
                ids = []
                time.sleep(1)
    
if __name__ == '__main__':
    gather_search_index_from_video_transcripts(sys.argv[1])
