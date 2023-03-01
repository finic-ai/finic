<h1 align="center">
🤖 Sidekick
</h1>

<p align="center">
  <p align="center">Use GPT to answer questions about open source projects</p>
</p>

[Sidekick](https://github.com/getbuff/Buff) helps open source communities troubleshoot technical questions with AI. It scales very well with documentation, tutorials, and historical troubleshooting threads. This is the web demo for Sidekick.

Sidekick is also open source. [Try it out here.](https://sidekick-web.vercel.app/)


## 💎 Features
- Bots for Slack, Discord, Web, and Discourse
- Ingestion of JSON formatted docs, chunking and storing as vector embeddings
- Guardrails to prevent hallucinated answers
- Cites sources
- Short term memory for conversations



## Get started
`npm run start` will start the web client. However you won't be able to make any requests until the API url and API key are set up in `.env`. We are trying to make the product more self-serve, but in the meantime please contact us on [Discord](https://discord.gg/dYXkQrkDVt) or reach out to founders@getsidekick.ai to get the API url and an API key.

## Contributing
To add more documentation for existing products or to add new products, make a PR to add a new `.json` file with the content you'd like to index. Follow the structure of the files in the `documentation-sources` directory.
