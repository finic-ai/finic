import functions_framework
from google.cloud import firestore
import json

@functions_framework.http
def scheduled_messages(request):
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

    config_file = open("config.json", "r")
    config_data = json.loads(config_file.read())
    COLLECTION_ID = config_data['COLLECTION_ID']
    DOCUMENT_ID = config_data['DOCUMENT_ID']

    db = firestore.Client()
    collection_ref = db.collection(COLLECTION_ID)

    docs = collection_ref.get()

    results = {}

    for doc in docs:
        doc_data = doc.to_dict()
        guild_id = doc.id

        # Check the killswitch firestore document
        killswitch_doc = db.collection('killswitch').document(guild_id).get()
        if killswitch_doc.exists:
            killswitch = killswitch_doc.to_dict()
            if not killswitch['botIsOn']:
                continue

        for channel_id, scheduled_message in doc_data.items():
            interval = scheduled_message['interval']
            counter = scheduled_message['counter']
            message = scheduled_message['message']

            counter_key = "{}.counter".format(channel_id)
            doc_ref = collection_ref.document(guild_id)
            if counter >= interval:
                doc_ref.update({counter_key: 1})
                results[channel_id] = message
            else:
                doc_ref.update({counter_key: counter + 1})
    
    return (results, 200, headers)

