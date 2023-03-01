<h1 align="center">
🤖 Sidekick
</h1>

<p align="center">
  <p align="center">Use GPT to answer questions about open source projects</p>
</p>

Sidekick is a web demo for our [product](https://github.com/getbuff/Buff) that helps open source communities troubleshoot technical questions with AI. Sidekick itself is also open source. We are trying to make the product more self-serve, but in the meantime please reach out to founders@getsidekick.ai to set it up for your community.

[Try it out here.](https://sidekick-web.vercel.app/)


## 💎 Features
- Support for Slack, Discord, Web, and Discourse
- Guardrails to prevent hallucinated answers
- Github docs for each project are indexed. Feel free open an issue and request additional docs for us to ingest.


## Get started
`npm run start` will start the web client. However it won't be able to make any requests until the environment variables are set up properly in `.env`. 

To get the API url and an API key, contact us on [Discord](https://discord.gg/dYXkQrkDVt) or email us at founders@getsidekick.ai.
