from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.text_splitter import CharacterTextSplitter, RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
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
import argparse
import ast

load_dotenv()
openai = OpenAI(openai_api_key=os.environ.get('OPENAI_API_KEY'), temperature=0)

# model_name = "sentence-transformers/all-mpnet-base-v2"
# huggingface_embeddings = HuggingFaceEmbeddings(model_name=model_name)
openai_embeddings = OpenAIEmbeddings(openai_api_key=os.environ.get('OPENAI_API_KEY'))

pinecone.init(api_key=os.environ.get('PINECONE_API_KEY'), environment=os.environ.get('PINECONE_ENVIRONMENT'))
index = pinecone.Index(os.environ.get('PINECONE_INDEX'))
vectorstore = Pinecone(index, openai_embeddings.embed_query, "text")

def gather_search_index_from_urls(filename, site_id=None):
    documents = []
    metadatas = []
    ids = []
    splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=int(os.environ.get('CHUNK_OVERLAP')))

    with open(filename, newline='') as urlsfile:
        urls = urlsfile.readlines()
        urls = [url.strip() for url in urls]

        id = 0
        for i in range(len(urls)):
            url = urls[i]
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            text = soup.get_text()

            for chunk in splitter.split_text(text):
                documents.append(chunk)
                metadata = {"source": url}
                if site_id:
                    metadata["site_id"] = site_id
                metadatas.append(metadata)
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

def gather_search_index_from_csv(filename):
    documents = []
    metadatas = []
    ids = []
    splitter = CharacterTextSplitter(separator=" ", chunk_size=1024, chunk_overlap=0)
    with open(filename, newline='') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',', quotechar='\"')

        id = 0
        for row in csvreader:
            # ignore the first row
            if row[2] == 'title' and row[3] == 'body':
                continue

            product_category = row[0]
            url = row[1]
            title = row[2]
            body = row [3]

            total_body = "{0} {1}".format(title, body)

            for chunk in splitter.split_text(total_body):
                documents.append(chunk)
                metadatas.append({"source": url, "product_category": product_category})
                ids.append(str(id))
                id += 1 
                
                if len(documents) == 20:
                    print("adding documents")
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
    splitter = CharacterTextSplitter(separator=" ", chunk_size=1024, chunk_overlap=int(os.environ.get('CHUNK_OVERLAP')))

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

def gather_search_index_from_json_v2(filename, base_url):
    documents = []
    metadatas = []
    ids = []
    splitter = CharacterTextSplitter(separator=" ", chunk_size=1024, chunk_overlap=int(os.environ.get('CHUNK_OVERLAP')))

    with open(filename, newline='') as jsonfile:
        jsonreader = json.load(jsonfile)

        id = 0
        for article in jsonreader:
            print(id)
            url = article['url']
            title = article['title']
            content = article['content']
            if not content:
                continue 
            document = "{0} {1}".format(title, content)
            for chunk in splitter.split_text(document):
                documents.append(chunk)
                metadatas.append({"source": "{0}{1}".format(base_url, url)})
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
    parser = argparse.ArgumentParser()
    parser.add_argument('--type', help='type of data to index', required=True)
    parser.add_argument('data', help='data to index')
    parser.add_argument('--baseurl', help='base url', required=False)
    parser.add_argument('--siteid', help='site id to be added to vector metadata', required=False)

    args = parser.parse_args()
    data_type = args.type
    data = args.data
    base_url = args.baseurl
    site_id = args.siteid

    if data_type == 'csv':
        gather_search_index_from_csv(data)
    elif data_type == 'json':            
        gather_search_index_from_json(data)
    elif data_type == 'json_v2':
        gather_search_index_from_json_v2(data, base_url=base_url)
    elif data_type == 'video':
        gather_search_index_from_video_transcripts(data)
    elif data_type == 'urls':
        gather_search_index_from_urls(data, site_id=site_id)
    else:
        print("data type not supported")
        
