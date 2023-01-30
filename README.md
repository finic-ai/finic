<h1 align="center">
🦾 Buff
</h1>

<p align="center">
  <p align="center">Build, deploy, and monitor LLM-based chatbots for customer support</p>
</p>

<h4 align="center">
 
  <a href='https://discord.gg/dYXkQrkDVt'><img src="https://img.shields.io/discord/603466164219281420.svg?logo=discord" alt="chat on Discord"></a>

</h4>

[Buff](https://www.getbuff.io/) is a conversation engine that indexes support articles with a vector database and answers customer questions with a LLM. Buff does not replace live chat software like Zendesk or Freshworks. Instead, it integrates with the chat interfaces companies already use and gives them language capbilities on par with ChatGPT. Buff excels at responding to customer inquiries about a product and can achieve high (60%+) deflection rates without compromising on CSAT.

Buff is backed by Y Combinator.
<h4 align="center">
<img src="https://github.com/getsleuth/Sleuth/blob/main/screenshot.png?raw=true" width="500">
</h4>

## 💎 Features
Compared to traditional NLU-driven chatbots, Buff:
- Can be set up in a few hours and performs well out of the box, since it does not need to be trained on prior examples of customer conversations
- Does not require code migrations or change management, since it integrates with existing live chat software instead of replacing them
- Can deflect a higher percentage of tickets, since it handles unexpected inputs without having to define intents ahead of time

Since general-purpose LLMs tend to have high variability in outputs, Buff is better suited for use cases with a large number of low-stakes interactions such as ecommerce and troubleshooting.


## 🔌 Integrations
- Discord: 🦾 Done
- Freshchat: 🚧 In Progress
- Intercom: 🚧 Planned
- Zendesk: 🚧 Planned

## Hosted version
To get on the hosted version, contact us on [Discord](https://discord.gg/dYXkQrkDVt) or sign up [here](https://www.getbuff.io/).

## Self-hosted
To get started on the self-hosted version, [create a Discord bot](https://discordpy.readthedocs.io/en/stable/discord.html) and give it the necessary permissions to read message content and post messages. Swap out the placeholders in `server/discord/bot.py`  with your OpenAI API Key and your Discord Bot Token. Then just run `server/discord/bot.py`  from your server with `nohup` or `systemd` to keep the script running.
