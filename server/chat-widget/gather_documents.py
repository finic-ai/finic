from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import pinecone
from bs4 import BeautifulSoup
import requests
import csv
import sys
import time

openai = OpenAI(openai_api_key='<OPENAI_API_KEY>', temperature=0)
openai_embeddings = OpenAIEmbeddings(openai_api_key='<OPENAI_API_KEY>')

pinecone.init(api_key="<PINECONE_API_KEY>", environment="us-west1-gcp")
index = pinecone.Index("freshworks-knowledgebase")
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

            if len(documents) == 50:
                vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)
                documents = []
                metadatas = []
                ids = []

            time.sleep(1)
    
    vectorstore.add_texts(texts=documents, metadatas=metadatas, ids=ids)

if __name__ == '__main__':
    gather_search_index_from_csv(sys.argv[1])
