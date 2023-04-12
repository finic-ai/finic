<h2 align="center">
<a href="https://www.getsidekick.ai/"> <img width="50%" src="https://user-images.githubusercontent.com/14931371/228092627-33481415-544b-4a76-9f32-d039704f1cc0.png" /></a>
</h2>

<p align="center">
  <p align="center">Connect your SaaS tools to a vector database and keep your data synced</p>
</p>
<p align="center">
<a href="https://sidekick-public.slack.com/" target="_blank">
    <img src="https://img.shields.io/badge/slack-join-blue.svg?logo=slack" alt="Slack">
</a>
<a href="https://github.com/ai-sidekick/sidekick/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/static/v1?label=license&message=GPL-3.0&color=blue" alt="License">
</a>
<a href="https://github.com/ai-sidekick/sidekick/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
    <img src="https://img.shields.io/github/issues-closed/ai-sidekick/sidekick?color=blue" alt="License">
</a>
  <a href="https://twitter.com/getsidekickai" target="_blank">
    <img src="https://img.shields.io/twitter/follow/getsidekickai?style=social" alt="License">
</a>
</p>

[Sidekick](https://getsidekick.ai/) is a framework for integrating with SaaS tools like Salesforce, Github, Notion, Zendesk and syncing data between these tools and a vector store. You can also use the integrations and chunkers built by the community to get started quickly, or quickly build new integrations and write custom chunkers for different content types based on Sidekick's `DataConnector` and `DataChunker` specs.

## Demo
Get an API key to test out a hosted version by [joining our Slack community.](https://sidekick-public.slack.com/). Post in the #api-keys channel to request a new key. You can test it out on some pre-ingested developer docs by tagging the Sidekick bot in the #sidekick-demo channel.

[Demo Video](https://www.youtube.com/watch?v=I2V3Cu8L6wk)


## 💎 Features
* Scrape HTML pages and chunk them
* Load Markdown files from a Github repo and chunk them
* Connect to Weaviate vector store and load chunks
* FastAPI endpoints to query vector store directly, or perform Q&A with OpenAI models
* Slackbot interface to perform Q&A with OpenAI models

## Upcoming
* `DataConnector` and `DataChunker` abstractions to make it easier to contribute new connectors/chunkers
* Connect to Pinecone, Milvus, and Qdrant vector stores

## Getting Started - 15 min
To run Sidekick locally:

1. Install Python 3.10, if not already installed.
2. Clone the repository: `git clone https://github.com/ai-sidekick/sidekick.git`
3. Navigate to the `sidekick-server` directory: `cd /path/to/sidekick/sidekick-server`
4. Install poetry: `pip install poetry`
5. Create a new virtual environment with Python 3.10: `poetry env use python3.10`
6. Activate the virtual environment: `poetry shell`
7. Install `poetry-dotenv`: `poetry self add poetry-dotenv`
8. Install app dependencies: `poetry install`
9. Set the required environment variables in a `.env` file in `sidekick-server`:

   ```
   DATASTORE=weaviate
   BEARER_TOKEN=<your_bearer_token> // Can be any string when running locally. e.g. 22c443d6-0653-43de-9490-450cd4a9836f
   OPENAI_API_KEY=<your_openai_api_key>
   WEAVIATE_HOST=<Your Weaviate instance host address> // Optional, defaults to http://127.0.0.1
   WEAVIATE_PORT=<Your Weaviate port number> // Optional, defaults to 8080. Should be set to 443 for Weaviate Cloud
   WEAVIATE_INDEX=<Your chosen Weaviate class/collection name to store your chunks> // e.g. MarkdownChunk
   ```
   Note that we currently only support weaviate as the data store. You can [run Weaviate locally with Docker](https://weaviate.io/developers/weaviate/quickstart/installation#running-weaviate-with-docker) or [set up a sandbox cluster](https://weaviate.io/developers/weaviate/quickstart/installation#create-a-weaviate-cluster) to get a Weaviate host address.
10. Run the API locally: `poetry run start`
11. Access the API documentation at `http://0.0.0.0:8000/docs` and test the API endpoints (make sure to add your bearer token).

For support and questions, [join our Slack community.](https://join.slack.com/t/sidekick-public/shared_invite/zt-1ra86qug3-~UWNCISLWpNj55Im6C6OaQ)

### API Endpoints

The server is based on FastAPI so you can view the interactive API documentation at `<local_host_url i.e. http://0.0.0.0:8000>/docs` when you are running it locally.

These are the available API endpoints:

- `/upsert-web-data`: This endpoint takes a `url` as input, uses Playwright to crawl through the webpage (and any linked webpages), and loads them into the vectorstore.

- `/query`: Endpoint to query the vector database with a string. You can filter by source type (web, markdown, etc.) and set the max number of chunks returned. 

- `/ask-llm`: Endpoint to get an answer to a question from an LLM, based on the data in the vectorstore. In the response, you get back the sources used in the answer, the user's intent, and whether or not the question is answerable based on the content in your vectorstore. 

## Contributing
See [CONTRIBUTING.md](https://github.com/ai-sidekick/sidekick/blob/main/CONTRIBUTING.md)

## Acknowledgments

* The boilerplate for this project is based on the [ChatGPT Retrieval Plugin](https://github.com/openai/chatgpt-retrieval-plugin)
* The licensing for this project is inspired by [Airbyte's licensing model](https://github.com/airbytehq/airbyte/tree/master/docs/project-overview/licenses)
