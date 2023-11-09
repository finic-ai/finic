<h2 align="center">
<a href="https://www.psychic.dev/"> <img width="50%" src="https://github.com/psychicapi/psychic/assets/14931371/d011457f-0df2-409b-91fe-7f1104084aa7" /></a>
</h2>

<p align="center">
  <p align="center">Data integration platform for LLMs</p>
</p>
<p align="center">
<a href="https://join.slack.com/t/psychicapi/shared_invite/zt-1yptnhwcz-SiOCnrbqnBDsuzps9sEMSw" target="_blank">
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

**Psychic cloud is deprecated as of October 1, 2023 due to lack of demand, and the original authors are moving onto a new project. If you are interested in helping maintain or improve the open source project, email jason@psychic.dev. If you need support, try the public slack channel.**

Psychic is an open source integration platform to extract and transform unstructured data from SaaS applications like Notion, Slack, Zendesk, Confluence, and Google Drive. Instead of building one integration for each data sources, you can build one integration that works for all data sources. **Psychic is designed for startups that use LLMs and need to retrieve documents to use as context**. 

There are 3 parts of the platform
* 🪄 **Psychic Link:** A modal that lets end users to connect their data sources with a point and click interface, using OAuth. Available as an NPM package for React projects, or as a magic link.
* 🪢 **Universal API:** Abstractions to make it easy to ingest Document and Conversation data from any connected source through a single API endpoint. Filter based on `connector_id` and `account_id`. New integrations can be added by implementing a new `DataConnector` in the server-side code.
* 🎩 **Psychic Dashboard:** A front-end for the Psychic platform that makes it easy to manage connections and connect data sources without having to add Link to an existing app.

### <a href="https://docs.psychic.dev" target="_blank">Read the docs</a>

## Demo
Using Psychic to connect data from a Notion workspace with a LangChain question and answer app.

https://github.com/psychic-api/psychic/assets/14931371/00008f3d-8c9e-4b64-821a-733b0fcd47b0


Get an API key to test out the cloud version by creating an account on the [Psychic dashboard.](https://dashboard.psychic.dev/)

If you have any questions on how to get started, [come join our Slack community!](https://join.slack.com/t/psychicapi/shared_invite/zt-1yptnhwcz-SiOCnrbqnBDsuzps9sEMSw).

## Roadmap
* ✅ [LangChain DataLoader](https://python.langchain.com/en/latest/modules/indexes/document_loaders/examples/psychic.html?highlight=psychic)
* ✅ Webhook support to push data to an endpoint at predetermined intervals
* 🚧 CRM integrations (Salesforce, HubSpot, etc)
* 🚧 Support for write scopes for each connector, in addition to read scopes

## Getting Started - 15 min
Check out the [quickstart tutorial](https://docs.psychic.dev/quickstart) to get started.

## Contributing
See [CONTRIBUTING.md](https://github.com/psychicapi/psychic/blob/main/CONTRIBUTING.md)
