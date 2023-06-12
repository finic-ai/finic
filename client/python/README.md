# Psychic

`psychicapi` is the python client library for [Psychic](https://www.psychic.dev/).

## What is Psychic?

Psychic is a platform for integrating with your customer’s SaaS tools like Notion, Zendesk, Confluence, and Google Drive via OAuth and syncing documents from these applications to your SQL or vector database. You can think of it like Plaid for unstructured data. Psychic is easy to set up - you use it by importing the react library and configuring it with your Psychic API key, which you can get from the [Psychic dashboard](https://dashboard.psychic.dev/). When your users connect their applications, you can view these connections from the dashboard and retrieve data using the server-side libraries. 

## Quick start

1. Create an account in the [dashboard](https://dashboard.psychic.dev/).
2. Use the [react library](https://docs.psychic.dev/psychic-link) to add the Psychic link modal to your frontend react app. Users will use this to connect their SaaS apps. Or, use the [playground](https://dashboard.psychic.dev/playground) to connect your own data sources.
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
connections = psychic.get_connections(account_id="account_id")
```

### Retrieve documents from a connection

```
docs = psychic.get_documents(account_id="account_id")
```

## Advanced Filtering

### Filtering by section(s)

Most file storage, CRM and helpdesk apps have documents organized in sections. Confluence calls them spaces, Zendesk calls them  sections, Google Drive calls them folders. Psychic allows you to define filters based on these sections using the `SectionFilter` class. You can define and query sections as follows:

```
from psychicapi import Psychic, ConnectorId, Section, SectionFilter

client = Psychic("YOUR-SECRET-KEY")
connections = client.get_connections(connector_id=ConnectorId.notion, account_id="test")
connection = connections[0]

# get existing section filters
existing_filters = connection.section_filters

# get all available sections from the connection. these will be folders, sections, spaces, etc. depending on the connector
sections = connection.sections

# have the user pick one or more sections
i = 0
filter = SectionFilter(id='index1', sections=[sections[i]])

# add the section filter to the connection
client.add_section_filter(connector_id=ConnectorId.notion, account_id="test", section_filter=filter)

# get documents from the sections in the filter
client.get_documents(account_id="test", connector_id=ConnectorId.notion, section_filter_id="index1")
```

### Filtering by uri

Every document returned by Psychic has a uri. If you want to query a document by uri instead of retrieving all documents in a connection, you can use the optional `uris` parameter in `get_documents`


```
client.get_documents(
    account_id="test", 
    connector_id=ConnectorId.notion, 
    uris=["https://docs.google.com/document/d/document-id-1/edit?usp=drivesdk", "https://drive.google.com/file/d/document-id-2/view?usp=drivesdk"]
)
```
## Local development

To run the python package locally, use the following command:

```
pip install -e /path/to/package
```
