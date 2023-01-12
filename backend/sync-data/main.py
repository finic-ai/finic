import functions_framework
import openai
import pinecone
from datasets import load_dataset
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import os

@functions_framework.http
def sync_data(request):
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

    if 'slack_bot_token' not in request_json:
        return ({'error': 'Missing slack bot token'}, 200, headers)

    # Get Slack messages

    slack_client = WebClient(token=request_json['slack_bot_token'])

    messages = []

    channel_name = ''

    try:
        # Call the conversations.list method using the WebClient
        for result in slack_client.conversations_list():
            for channel in result["channels"]:
                channel_name = channel["name"]
                conversation_id = channel["id"]
                result = slack_client.conversations_history(channel=conversation_id)
                text = [message["text"] for message in result["messages"]]
                messages += list(filter(lambda t: len(t) > 0, text))
    except SlackApiError as e:
        return ({'error': f"Error: {e}", 'channel': channel_name}, 200, headers) 

    openai.organization = os.environ.get('OPENAI_ORGANIZATION')
    openai.api_key = os.environ.get('OPENAI_API_KEY')
    pinecone.init(
        api_key=os.environ.get('PINECONE_API_KEY'),
        environment='us-west1-gcp'
    )

    # Create embeddings
    MODEL = "text-embedding-ada-002"
    res = openai.Embedding.create(
        input=[
            "Sample document text goes here",
            "there will be several phrases in each batch"
        ], engine=MODEL
    )
    embeds = [record['embedding'] for record in res['data']]
    
    index = pinecone.Index('openai')
    
    count = 0  # we'll use the count to create unique IDs
    batch_size = 32  # process everything in batches of 32
    for i in range(0, len(messages), batch_size):
        # set end position of batch
        i_end = min(i+batch_size, len(messages))
        # get batch of lines and IDs
        lines_batch = messages[i: i+batch_size]
        ids_batch = [str(n) for n in range(i, i_end)]
        # create embeddings
        res = openai.Embedding.create(input=lines_batch, engine=MODEL)
        embeds = [record['embedding'] for record in res['data']]
        # prep metadata and upsert batch
        meta = [{'text': line} for line in lines_batch]
        to_upsert = zip(ids_batch, embeds, meta)
        # upsert to Pinecone
        index.upsert(vectors=list(to_upsert))
    
    return ({'message': 'success'}, 200, headers)
