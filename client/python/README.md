# Psychic

`psychicapi` is the python client library for [Psychic](https://www.psychic.dev/).

## What is Psychic?

Psychic is a platform for integrating with your customer’s SaaS tools like Notion, Zendesk, Confluence, and Google Drive via OAuth and syncing documents from these applications to your SQL or vector database. You can think of it like Plaid for unstructured data. Psychic is easy to set up - you use it by importing the react library and configuring it with your Psychic API key, which you can get from the [Psychic dashboard](https://dashboard.psychic.dev/). When your users connect their applications, you can view these connections from the dashboard and retrieve data using the server-side libraries. 

## Quick start

1. Create an account in the [dashboard](https://dashboard.psychic.dev/).
2. Use the [react library](https://docs.psychic.dev/psychic-link) to add the Psychic link modal to your frontend react app. Users will use this to connect their SaaS apps.
3. Use `psychicapi` to retrieve documents from your active connections.

## Usage 

### Initialization

```
from psychicapi import ConnectorId, Psychic 
psychic = Psychic(secret_key="secret-key")
```

### Get active connections

```
# Get all active connections and optionally filter by connector id and/or account id
connections = psychic.get_connections(connector_id=ConnectorId.notion, account_id=None)
```

### Retrieve documents from a connection

```
docs = psychic.get_documents(ConnectorId.zendesk, "account_id")
```