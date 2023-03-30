# Sidekick server

This folder contains the server implementation of Sidekick. Sidekick server has endpoints for loading unstructured data from various sources, along with endpoints for querying that data for use with LLMs.

## Introduction

The core data loading functionality can be found in `connectors` and `chunkers`. The `llm` folder contains a question answering and chat module that consumes data from the datastore. The interface for the server (`datastore`, `.well-known`, `models`) is repurposed from [ChatGPT Retrieval Plugin](https://github.com/openai/chatgpt-retrieval-plugin) The repository is organized into several directories:

| Directory                     | Description                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`datastore`](/datastore)     | Logic for upserting data into and querying vector stores. Currently, only weaviate is supported.                 |
| [`models`](/models)           | All data models used by the server -- for the API interface, data loading, and LLM completions.                  |
| [`server`](/server)           | Houses the main FastAPI server implementation.                                                                   |
| [`.well-known`](/.well-known) | OpenAI Plugin interface                                                                                          |
| [`connectors`](/connectors) | ETL pipelines for loading data from various sources (web, github, forums, etc.) into the vector store            |
| [`chunkers`](/chunkers)       | Abstractions around breaking down text inputs into smaller chunks, optimized for different document types.       |
| [`llm`](/llm)                 | Use an LLM to answer questions based on the stored data, analyze intent, and check for hallucinations.           |

## Table of Contents

### API Endpoints

The server is based on FastAPI so you can view the interactive API documentation at `<local_host_url i.e. http://0.0.0.0:8000>/docs` when you are running it locally.

These are the available API endpoints:

- `/upsert-web-data`: This endpoint takes a `url` as input, uses Playwright to crawl through the webpage (and any linked webpages), and loads them into the vectorstore.

- `/query`: Endpoint to query the vector database with a string. You can filter by source type (web, markdown, etc.) and set the max number of chunks returned. 

- `/ask-llm`: Endpoint to get an answer to a question from an LLM, based on the data in the vectorstore. In the response, you get back the sources used in the answer, the user's intent, and whether or not the question is answerable based on the content in your vectorstore. 


## Quickstart

1. Install Python 3.10, if not already installed.
2. Clone the repository: `git clone https://github.com/ai-sidekick/sidekick`
3. Navigate to the cloned repository directory: `cd /path/to/sidekick/sidekick-server/`
4. Install poetry: `pip install poetry`
5. Create a new virtual environment with Python 3.10: `poetry env use python3.10`
6. Activate the virtual environment: `poetry shell`
7. Install app dependencies: `poetry install`
8. Set the required environment variables:

   ```
   export DATASTORE=<your_datastore>
   export BEARER_TOKEN=<your_bearer_token>
   export OPENAI_API_KEY=<your_openai_api_key>
   <Add the environment variables for weaviate here>
   ```

9. Create a file `app_config.py`. This should contain an object `app_config` which maps from each bearer token to a `product_id`
10. Run the API locally: `poetry run start`
11. Access the API documentation at `http://0.0.0.0:8000/docs` and test the API endpoints (make sure to add your bearer token).

#### Environment variables

**General Environment Variables**

| Name             | Required | Description                            |
| ---------------- | -------- | -------------------------------------- |
| `DATASTORE`      | Yes      | Datastore name. Set this to `weaviate` |
| `BEARER_TOKEN`   | Yes      | Your secret token                      |
| `OPENAI_API_KEY` | Yes      | Your OpenAI API key                    |

**Weaviate Datastore Environment Variables**

| Name             | Required | Description                                                        | Default            |
| ---------------- | -------- | ------------------------------------------------------------------ | ------------------ |
| `WEAVIATE_HOST`  | Optional | Your Weaviate instance host address (see notes below)              | `http://127.0.0.1` |
| `WEAVIATE_PORT`  | Optional | Your Weaviate port number                                          | 8080               |
| `WEAVIATE_INDEX` | Optional | Your chosen Weaviate class/collection name to store your documents | OpenAIDocument     |

> For **WCS instances**, set `WEAVIATE_PORT` to 443 and `WEAVIATE_HOST` to `https://(wcs-instance-name).weaviate.network`. For example: `https://my-project.weaviate.network/`.

> For **self-hosted instances**, if your instance is not at 127.0.0.1:8080, set `WEAVIATE_HOST` and `WEAVIATE_PORT` accordingly. For example: `WEAVIATE_HOST=http://localhost/` and `WEAVIATE_PORT=4040`.

**Note:** If you add new dependencies to the pyproject.toml file, you need to run `poetry lock` and `poetry install` to update the lock file and install the new dependencies.


## Deployment

### Deploying to Fly.io

To deploy the Docker container from this repository to Fly.io, follow
these steps:

[Install Docker](https://docs.docker.com/engine/install/) on your local machine if it is not already installed.

Install the [Fly.io CLI](https://fly.io/docs/getting-started/installing-flyctl/) on your local machine.

Clone the repository from GitHub:

```
git clone https://github.com/openai/chatgpt-retrieval-plugin.git
```

Navigate to the cloned repository directory:

```
cd path/to/chatgpt-retrieval-plugin
```

Log in to the Fly.io CLI:

```
flyctl auth login
```

Create and launch your Fly.io app:

```
flyctl launch
```

Follow the instructions in your terminal:

- Choose your app name
- Choose your app region
- Don't add any databases
- Don't deploy yet (if you do, the first deploy might fail as the environment variables are not yet set)

Set the required environment variables:

```
flyctl secrets set DATASTORE=your_datastore \
OPENAI_API_KEY=your_openai_api_key \
BEARER_TOKEN=your_bearer_token \
<Add the environment variables for weaviate here>
```

Alternatively, you could set environment variables in the [Fly.io Console](https://fly.io/dashboard).

At this point, you can change the plugin url in your plugin manifest file [here](/.well-known/ai-plugin.json), and in your OpenAPI schema [here](/.well-known/openapi.yaml) to the url for your Fly.io app, which will be `https://your-app-name.fly.dev`.

Deploy your app with:

```
flyctl deploy
```

After completing these steps, your Docker container should be deployed to Fly.io and running with the necessary environment variables set. You can view your app by running:

```
flyctl open
```

which will open your app url. You should be able to find the OpenAPI schema at `<your_app_url>/.well-known/openapi.yaml` and the manifest at `<your_app_url>/.well-known/ai-plugin.json`.

To view your app logs:

```
flyctl logs
```

Now, make sure you have changed the plugin url in your plugin manifest file [here](/.well-known/ai-plugin.json), and in your OpenAPI schema [here](/.well-known/openapi.yaml), and redeploy with `flyctl deploy`. This url will be `https://<your-app-name>.fly.dev`.

**Debugging tips:**
Fly.io uses port 8080 by default.

If your app fails to deploy, check if the environment variables are set correctly, and then check if your port is configured correctly. You could also try using the [`-e` flag](https://fly.io/docs/flyctl/launch/) with the `flyctl launch` command to set the environment variables at launch.


### Other Deployment Options

Some possible other options for deploying the app are:

- Azure Container Apps: This is a cloud platform that allows you to deploy and manage web apps using Docker containers. You can use the Azure CLI or the Azure Portal to create and configure your app service, and then push your Docker image to a container registry and deploy it to your app service. You can also set environment variables and scale your app using the Azure Portal. Learn more [here](https://learn.microsoft.com/en-us/azure/container-apps/get-started-existing-container-image-portal?pivots=container-apps-private-registry).
- Google Cloud Run: This is a serverless platform that allows you to run stateless web apps using Docker containers. You can use the Google Cloud Console or the gcloud command-line tool to create and deploy your Cloud Run service, and then push your Docker image to the Google Container Registry and deploy it to your service. You can also set environment variables and scale your app using the Google Cloud Console. Learn more [here](https://cloud.google.com/run/docs/quickstarts/build-and-deploy).
- AWS Elastic Container Service: This is a cloud platform that allows you to run and manage web apps using Docker containers. You can use the AWS CLI or the AWS Management Console to create and configure your ECS cluster, and then push your Docker image to the Amazon Elastic Container Registry and deploy it to your cluster. You can also set environment variables and scale your app using the AWS Management Console. Learn more [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html).

After you create your app, make sure to change the plugin url in your plugin manifest file [here](/.well-known/ai-plugin.json), and in your OpenAPI schema [here](/.well-known/openapi.yaml), and redeploy.


## Contributing

Sidekick is open for contribution! To add a new data connector, follow the outlined steps:

1. Create a new folder under `dataloaders` named `<data-source>-loader` where `<data-source>` is the name of the source you are connecting to.
2. This folder should contain a file `load.py` with a function `load_data` that returns `List[DocumentChunk]`
3. Create a new endpoint in `/server/main.py` that calls `load_data`
4. Add the new source type in `models/models.py`

