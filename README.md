<h2 align="center">
<a href="https://www.psychic.dev/"> <img width="50%" src="https://github.com/psychicapi/psychic/assets/14931371/d011457f-0df2-409b-91fe-7f1104084aa7" /></a>
</h2>

<p align="center">
  <p align="center">Unified APIs for ingesting unstructured data</p>
</p>
<p align="center">
<a href="https://join.slack.com/t/psychicapi/shared_invite/zt-1ty1wz6w0-8jkmdvBpM5kj_Fh30EiCcg" target="_blank">
    <img src="https://img.shields.io/badge/slack-join-blue.svg?logo=slack" alt="Slack">
</a>
</a>
  <a href="https://docs.psychic.dev" target="_blank">
    <img src="https://img.shields.io/badge/-docs-blue" alt="Docs">
</a>
<a href="https://github.com/psychicapi/psychic/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/static/v1?label=license&message=GPL-3.0&color=blue" alt="License">
</a>
<a href="https://github.com/psychicapi/psychic/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
    <img src="https://img.shields.io/github/issues-closed/psychicapi/psychic?color=blue" alt="Issues">
</a>
  <a href="https://twitter.com/psychicapi" target="_blank">
    <img src="https://img.shields.io/twitter/follow/psychicapi?style=social" alt="Twitter">
</a>
</p>

[Psychic]([https://psychic.dev/](https://www.psychic.dev/)) is a platform for integrating with your customer’s SaaS tools like Notion, Zendesk, Confluence, and Google Drive and syncing documents from these applications to your SQL or vector database. You can think of it like Plaid for unstructured data. Psychic is easy to set up - you use it by importing the NPM package and configuring it with your Psychic API key, which you can get from the [Psychic dashboard](https://dashboard.psychic.dev/). When your users connect their applications, you can view these connections from the dashboard.

### <a href="https://docs.psychic.dev" target="_blank">Read the docs</a>

## Demo
[Demo Video with the Zendesk connector](https://youtu.be/hH09kWi6Si0).
Get an API key to test out the cloud version by creating an account on the [Psychic dashboard.](https://dashboard.psychic.dev/)

If you have any questions on how to get started, [come join our Slack community!](https://join.slack.com/t/psychicapi/shared_invite/zt-1ty1wz6w0-8jkmdvBpM5kj_Fh30EiCcg).

## 💎 Features
* [Dashboard](https://dashboard.psychic.dev/sign-in) to manage connections, handle auth, define data schemas, and run test queries
* API Connectors to Zendesk, Notion, Google Drive, Confluence
* General purpose web scraper for all other content
* Document normalization so you only need to write one parser that works with N sources
* Set the destination to be an API endpoint you control, or upload directly to a Weaviate/Pinecone vector database

## 🚧 Upcoming
* Support for Milvus, and Qdrant vector stores
* Slack Connector
* DropBox Connector
* Scheduled data synchronization
* Webhook-based data synchronization, for APIs where webhooks are available

## Getting Started - 15 min
Check out the [quickstart tutorial](https://docs.psychic.dev/quickstart) to get started.

## Contributing
See [CONTRIBUTING.md](https://github.com/psychicapi/psychic/blob/main/CONTRIBUTING.md)
