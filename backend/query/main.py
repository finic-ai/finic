import functions_framework
import openai
import pinecone
from datasets import load_dataset
import json
import os

@functions_framework.http
def query(request):
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

    request_json = request.get_json(silent=True)

    if 'query' not in request_json:
        return ({'results': []}, 200, headers)

    query = request_json['query']

    openai.organization = os.environ.get('OPENAI_ORGANIZATION')
    openai.api_key = os.environ.get('OPENAI_API_KEY')
    pinecone.init(
        api_key=os.environ.get('PINECONE_API_KEY'),
        environment='us-west1-gcp'
    )

    MODEL = "text-embedding-ada-002"

    index = pinecone.Index('openai')

    xq = openai.Embedding.create(input=query, engine=MODEL)['data'][0]['embedding']

    res = index.query([xq], top_k=5, include_metadata=True)
    
    return ({'results': json.dumps(res.to_dict())}, 200, headers)
