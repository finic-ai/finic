<h2 align="center">
<a href="https://www.getsidekick.ai/"> <img width="50%" src="https://user-images.githubusercontent.com/14931371/228092627-33481415-544b-4a76-9f32-d039704f1cc0.png" /></a>
</h2>

<p align="center">
  <p align="center">Connect your SaaS tools to a vector database and keep your data synced</p>
</p>
<p align="center">
<a href="https://join.slack.com/t/sidekick-public/shared_invite/zt-1ty1wz6w0-8jkmdvBpM5kj_Fh30EiCcg" target="_blank">
    <img src="https://img.shields.io/badge/slack-join-blue.svg?logo=slack" alt="Slack">
</a>
</a>
  <a href="https://docs.getsidekick.ai" target="_blank">
    <img src="https://img.shields.io/badge/-docs-blue" alt="Docs">
</a>
<a href="https://github.com/ai-sidekick/sidekick/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/static/v1?label=license&message=GPL-3.0&color=blue" alt="License">
</a>
<a href="https://github.com/ai-sidekick/sidekick/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
    <img src="https://img.shields.io/github/issues-closed/ai-sidekick/sidekick?color=blue" alt="Issues">
</a>
  <a href="https://twitter.com/getsidekickai" target="_blank">
    <img src="https://img.shields.io/twitter/follow/getsidekickai?style=social" alt="Twitter">
</a>
</p>

[Sidekick](https://getsidekick.ai/) is a platform for integrating with SaaS tools like Salesforce, Github, Notion, Zendesk and syncing data between these tools and a vector database. You can also use the integrations and chunkers built by the core team and community to get started quickly, or quickly build new integrations and write custom chunkers for different content types based on Sidekick's `DataConnector` and `DataChunker` specs.

### <a href="https://docs.getsidekick.ai" target="_blank">Read the docs</a>

## Demo
[Demo Video with the Zendesk connector](https://youtu.be/hH09kWi6Si0).
Get an API key to test out the cloud version by creating an account on the [Sidekick dashboard.](https://app.getsidekick.ai/)

If you have any questions on how to get started, [come join our Slack community!](https://sidekick-public.slack.com/).

## 💎 Features
* [Dashboard](https://app.getsidekick.ai/sign-in) to manage connectors, handle auth, and run queries
* API Connectors to Zendesk, Notion, Google Drive, Confluence
* General purpose web scraper for all other content
* Support for Weaviate and Pinecone vector databases
* FastAPI endpoint to query your Documents from all connected sources
* FastAPI endpoint to perform Q&A over your Documents

## 🚧 Upcoming
* Support for Milvus, and Qdrant vector stores
* DropBox Connector
* Query page for dashboard to replace FastAPI UI
* Data synchronization via scheduling
* Data synchronization via webhooks when available

## Getting Started - 15 min
Check out the [quickstart tutorial](https://docs.getsidekick.ai/quickstart) to get started.

## Contributing
See [CONTRIBUTING.md](https://github.com/ai-sidekick/sidekick/blob/main/CONTRIBUTING.md)

## Acknowledgments

* The boilerplate for this project is based on the [ChatGPT Retrieval Plugin](https://github.com/openai/chatgpt-retrieval-plugin)
* The licensing for this project is inspired by [Airbyte's licensing model](https://github.com/airbytehq/airbyte/tree/master/docs/project-overview/licenses)
