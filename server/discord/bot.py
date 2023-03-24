import discord
import os
import requests
import json
import asyncio 
import aiohttp
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from discord import app_commands
import difflib
from discord import ActionRow, Button, ButtonStyle



config_file = open("config.json", "r")
config_data = json.loads(config_file.read())
intents = discord.Intents.all()
client = discord.Client(intents=intents)
# bot = commands.Bot(intents=intents, command_prefix='/', help_command=None)
tree = app_commands.CommandTree(client)
API_URL=config_data.get('API_URL')
SCHEDULED_MESSAGES_API_URL = config_data.get('SCHEDULED_MESSAGES_API_URL')
ERROR_MESSAGE="Sorry, I'm not available at the moment. Please try again later."

no_op_faq = """
Sorry, I couldn't find the answer to your question, but here are some sources that may be relevant: {}

If you still need help, you can create a support ticket at https://support.opensea.io/hc/en-us/requests/new
"""

no_op_existing_ticket = """
It sounds like you're referring to an existing support ticket. Let me tag the community managers <@972292004644007947>, and <@950535324449247344> so they can help! 

If you're looking to create a new ticket, you can do so at https://support.opensea.io/hc/en-us/requests/new       
"""

async def async_post_request(url, payload):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as resp:
            return await resp.json()

async def async_get_request(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()

async def async_get_file_request(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.read()

class RatingButtons(discord.ui.View):
    def __init__(self, inv: str):
        super().__init__()
        self.inv = inv

    @discord.ui.button(label="", emoji="👍")
    async def thumbs_up_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.message.edit(view=GoodRating())
        await interaction.response.defer()

    @discord.ui.button(label="", emoji="👎")
    async def thumbs_down_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.message.edit(view=BadRating())
        await interaction.response.defer()

class GoodRating(discord.ui.View):
    def __init__(self):
        super().__init__()
        self.add_item(discord.ui.Button(label="", emoji="👍", disabled=True, style=ButtonStyle.green))

class BadRating(discord.ui.View):
    def __init__(self):
        super().__init__()
        self.add_item(discord.ui.Button(label="", emoji="👎", disabled=True, style=ButtonStyle.red))


async def reply_in_thread(question, thread_is_preexisting, message, response, thread_override=None):
    filtered_response = response.replace("Learn more: N/A", "")
    if thread_is_preexisting:
        await message.reply(filtered_response, view=RatingButtons("test"))
        return None
    else:
        if thread_override is not None:
            thread = thread_override
        else:
            if len(question) > 0:
                thread_name = question[:99]
            else:
                thread_name = filtered_response[:99]
            thread = await message.create_thread(name=thread_name)
        formatted_response = "<@{0}> <@&{1}> {2}".format(message.author.id, "864216964956160011", filtered_response)
        await thread.send(formatted_response, view=RatingButtons("test"))
        return thread

async def get_conversation_transcript(thread, is_thread, client):
    result = []
    if is_thread:
        async for message in thread.history(limit=10):
            if message.author == client.user:
                result.append("<|im_start|>assistant\n{}<|im_end|>".format(message.content))
            else:
                result.append("<|im_start|>user\n{}<|im_end|>".format(message.content))
        if thread.starter_message:
            result.append("<|im_start|>user\n{}<|im_end|>".format(thread.starter_message.content))
        result.pop(0)
        result.reverse() 
    return result

async def async_send_response(channel, is_thread, message, question, site_id, client):
    conversation_transcript = await get_conversation_transcript(channel, is_thread, client)

    async with channel.typing():
        try:
            response_json = await async_post_request(API_URL, {
                'conversation_transcript': conversation_transcript,
                'last_message': question,
                'conversation_id': 'conversation_id',
                'site_id': str(site_id)
            })
            if "error_code" in response_json and response_json["error_code"] == "killswitch":
                return
            contains_answer = response_json['contains_answer']
            user_intent = response_json.get("intent")
            sources = response_json['sources']
            all_sources = response_json.get('all_sources', [])
            source_links = [source['url'] for source in sources]

            response = ""
            if user_intent == "Ticket Update" or user_intent == 'ticket update':
                response = no_op_existing_ticket
            elif not contains_answer:
                response = no_op_faq.format(', '.join(source_links[:2]))
            else:
                response = response_json['answer']
                for source in all_sources:
                    if source['name'] in response:
                        response = response.replace(source['name'], source['url'])
                        if source['url'] in source_links:
                            source_links.remove(source['url'])
                if len(source_links) > 0:
                    response += """
You can learn more at {}        
""".format(', '.join(source_links))
            
            thread = await reply_in_thread(question, is_thread, message, response)

            if (user_intent == 'Scam Check' or user_intent == 'scam check') and not is_thread:
                await message.reply("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjZiM2NmYTUxN2EyM2ZmNTBlNjU4NzRmYjgwZGE1YTVlNGFkZmM0NSZjdD1n/CZR9Qs0zFGQTuCPgA6/giphy.gif")


        except Exception as e:
            print(e)
            await reply_in_thread(question, is_thread, message, ERROR_MESSAGE)

async def should_reply(message, client, is_thread, command_string, designated_channels):
    channel_id = str(message.channel.id)

    # the message is from the bot
    if message.author == client.user:
        return False
    # the message is in a thread created by the bot
    elif is_thread and message.channel.owner == client.user:
        # Loop through thread and check if someone other than the original user or bot has responded
        original_message = message.channel.starter_message
        if original_message is None:
            return False 
        if message.author != original_message.author:
            return False
        async for msg in message.channel.history(limit=100):
            print(msg.author)
            print(msg.content[:10])
            if msg.author not in [client.user, original_message.author]:
                return False
            if "It sounds like you're referring to an existing support ticket. Let me tag the community managers" in msg.content:
                return False
        return True 
    # the message is in a designated channel and contains the command string
    elif channel_id in designated_channels and command_string in message.content:
        return True
    else:
        return False
    
async def send_scheduled_messages():
    try:
        response_json = await async_get_request(SCHEDULED_MESSAGES_API_URL)
        for channel_id, message in response_json.items():
            await client.get_channel(int(channel_id)).send(message)
    except Exception as e:
        print(e)

async def register_custom_bot_commands():
    for guild_id, guild_config in config_data["guilds"].items():
        if "custom_command" in guild_config:
            command_config = guild_config["custom_command"]
            name = command_config["name"]
            description = command_config["description"]
            message = command_config["message"]
            guild = discord.Object(id=int(guild_id))
            gif_url = command_config["gif_url"]

            @app_commands.command(name=name, description=description)
            async def func(interaction: discord.Interaction):
                await interaction.response.send_message(
                    "{} {}".format(message, gif_url)
                )

            tree.add_command(
                func, guild=guild, override=True
            )

            await tree.sync(guild=guild)




@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

    await register_custom_bot_commands()

    # scheduled messages
    if SCHEDULED_MESSAGES_API_URL:
        scheduler = AsyncIOScheduler()
        scheduler.add_job(send_scheduled_messages, CronTrigger(hour="*")) 
        scheduler.start()

@client.event
async def on_raw_reaction_add(payload):
    site_id = str(payload.guild_id)
    site_config = config_data["guilds"].get(site_id, {})
    admin_ids = site_config.get("admin_ids")
    designated_channels = site_config.get('designated_channels')

    if not admin_ids:
        return
    if str(payload.user_id) not in admin_ids:
        return
    
    # Retrieve the channel the reaction was added in
    channel = await client.fetch_channel(payload.channel_id)

    if str(channel.id) not in designated_channels:
        return

    # Retrieve the message that was reacted to
    message = await channel.fetch_message(payload.message_id)

    if str(payload.emoji) == "🦾":
        is_thread = isinstance(message.channel, discord.Thread)
        question = message.content
        await async_send_response(channel, is_thread, message, question, site_id, client) 


@client.event
async def on_message(message):

    if message.guild is None:
        return

    site_id = str(message.guild.id)
    site_config = config_data["guilds"].get(site_id, {})
    command_string = site_config.get("command_string")
    designated_channels = site_config.get('designated_channels')

    if not (command_string and designated_channels):
        return

    is_thread = isinstance(message.channel, discord.Thread)
    bot_should_reply = await should_reply(message, client, is_thread, command_string, designated_channels)
    if bot_should_reply:
        question = message.content.replace(command_string, "")

        channel = message.channel 
        # if is_thread:
        #     thread = message.channel
        # else:
        #     thread = await message.create_thread(name=question[:100])
        await async_send_response(channel, is_thread, message, question, site_id, client) 

client.run(config_data['DISCORD_BOT_TOKEN'])