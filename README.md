<h1 align="center">
🦾 Buff
</h1>
<p align="center">
 
  <a href='https://join.slack.com/t/sleuthworld/shared_invite/zt-1n3iw8via-9y1mP3tJ3~Zy6GT5sZNwOg'><img alt="Join Slack Community" src="https://img.shields.io/badge/slack%20community-join-blue"/></a>

</p>

Buff is a simple bot that indexes support docs and answers questions in Discord.

[Recorded demo](https://www.youtube.com/shorts/JPKW9tX0K9Y)

## Features
- Index and search through a large number of documents with [Faiss](https://github.com/facebookresearch/faiss)
- Monitors Discord channels for `!help` requests and responds to them, using [LangChain](https://github.com/hwchase17/langchain) to construct the prompt
- Cites its sources, linking to the relevant source documents


## Upcoming
- Chunking sources to support larger documents
- Integrations with Zendesk and other helpdesk software

<img src="https://github.com/getsleuth/Sleuth/blob/main/screenshot.png?raw=true" width="500">

## Hosted version
To get on the hosted version, contact us on [Discord](https://discord.gg/dYXkQrkDVt) or sign up [here](https://www.getbuff.io/).

## Self-hosted
To get started on the self-hosted version, [create a Discord bot](https://discordpy.readthedocs.io/en/stable/discord.html) and give it the necessary permissions to read message content and post messages. Swap out the placeholders in `server/discord/bot.py`  with your OpenAI API Key and your Discord Bot Token. Then just run `server/discord/bot.py`  from your server with `nohup` or `systemd` to keep the script running.
