<h1 align="center">
🤖 Sidekick
</h1>

<p align="center">
  <p align="center">Use GPT to answer questions over documentation</p>
</p>

[Sidekick](https://github.com/getbuff/Buff) helps open source communities troubleshoot questions with AI. It scales very well with documentation.

Sidekick is also open source. [Try out the demo on web here.](https://sidekick-web.vercel.app/)


## 💎 Features
- Bots for Slack, Discord, Web, and Discourse
- Ingestion of JSON formatted docs, chunking and storing as vector embeddings
- Guardrails to prevent hallucinated answers
- Cites sources
- Short term memory for conversations

## [WIP] Get started - 30 min
To add a bot to Slack or Discord that answers questions over your documentation:
1. Submit a PR with a single change: a new `.json` file under `documentation-sources` with the content you'd like to index. The name of the file must match the [Slack workspace ID](https://nobitasoft.com/how-to-check-slack-workspace-id/) or [Discord server ID](https://support.discord.com/hc/en-us/articles/206346498) you want to add the bot to. For example, `T04CTF40G06.json`
2. The `.json` file must be an array of objects with the following schema:

```
{
    "name": string, // the name of this document e.g. "Step 1: Setup",
    "source": string, // A URL e.g. "https://github.com/apollographql/apollo-client/tree/main/docs/source/get-started.mdx",
    "content": string, // A single string blob with all the content for this document. Markdown is fine.
    "tag": string, // the name of your product, used as an identifier. Must be unique e.g. "apollo-client"
  }
```
3. Click here to add the bot: Slack/Discord
4. Ask it something!

## Building locally
`npm run start` will start the web client. However you won't be able to make any requests until the API url and API key are set up in `.env`. We are trying to make the product more self-serve, but in the meantime please contact us on [Discord](https://discord.gg/dYXkQrkDVt) or reach out to founders@getsidekick.ai to get the API url and an API key.

## Contributing
To add more documentation for existing products or to add new products, submit a PR to add a new `.json` file with the content you'd like to index. Follow the structure of the files in the `documentation-sources` directory.
