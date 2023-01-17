import functions_framework
import openai
import pinecone
from datasets import load_dataset
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import os
from atlassian import Confluence

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
        return ({'error': 'Missing slack api token'}, 200, headers)

    if ('confluence_username' not in request_json or 'confluence_api_key' not in request_json 
        or 'confluence_space' not in request_json or 'confluence_url' not in request_json):
        return ({'error': 'Missing confluence info'}, 200, headers)

    # Get Slack messages

    slack_client = WebClient(token=request_json['slack_bot_token'])

    messages = []

    channel_name = ''

    # Sync slack messages 

    try:
        # Call the conversations.list method using the WebClient
        for result in slack_client.conversations_list():
            for channel in result["channels"]:
                channel_name = channel["name"]
                conversation_id = channel["id"]
                result = slack_client.conversations_history(channel=conversation_id)
                text = [message["text"] for message in result["messages"]]
                filtered_text = filter(lambda t: len(t) > 0, text)
                messages += [{'app': 'slack', 'text': t} for t in filtered_text]
    except SlackApiError as e:
        return ({'error': f"Error: {e}", 'channel': channel_name}, 200, headers) 

    # Sync confluence docs

    try:
        confluence = Confluence(url=request_json['confluence_url'], username=request_json['confluence_username'], 
            password=request_json['confluence_api_key']) 

        pages = confluence.get_all_pages_from_space(request_json['confluence_space'], start=0, 
            limit=100, status=None, expand=None) 

        for page in pages:
            page_content = confluence.get_page_by_id(page['id'], expand='body.storage')
            text = page_content['body']['storage']['value']
            if text:
                messages.append({
                    'app': 'confluence', 
                    'text': text, 
                    'title': page_content['title'],
                    'link': '{0}wiki{1}'.format(request_json['confluence_url'], page_content['_links']['webui']) 
                })
            

    except e:
        return ({'error': f"Error: {e}", 'title': page_content['title']}, 200, headers) 

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
        lines_batch_text = [line['text'] for line in lines_batch]
        res = openai.Embedding.create(input=lines_batch_text, engine=MODEL)
        embeds = [record['embedding'] for record in res['data']]
        # prep metadata and upsert batch
        meta = lines_batch
        to_upsert = zip(ids_batch, embeds, meta)
        # upsert to Pinecone
        index.upsert(vectors=list(to_upsert))
    
    return ({'message': 'success'}, 200, headers)
