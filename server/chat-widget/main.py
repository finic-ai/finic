import functions_framework
from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import pinecone


@functions_framework.http
def chatbot(request):
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    openai = OpenAI(openai_api_key='<OPENAI_API_KEY>', temperature=0)
    openai_embeddings = OpenAIEmbeddings(openai_api_key='<OPENAI_API_KEY>')

    pinecone.init(api_key="<PINECONE_API_KEY>", environment="us-west1-gcp")
    index = pinecone.Index("freshworks-knowledgebase")
    vectorstore = Pinecone(index, openai_embeddings.embed_query, "text")

    request_json = request.get_json(silent=True)
    if 'conversation_transcript' not in request_json or 'last_message' not in request_json:
        return ({'response': 'Sorry, I didn\'t catch that. Try typing your request in again'}, 200, headers)

    conversation_transcript = request_json['conversation_transcript']
    last_message = request_json['last_message']

    chain = load_qa_with_sources_chain(openai)
    
    response = chain(
        {
            "input_documents": vectorstore.similarity_search(last_message, k=4),
            "question": last_message,
        },
        return_only_outputs=True,
    )["output_text"]
    
    return ({'response': response}, 200, headers)
