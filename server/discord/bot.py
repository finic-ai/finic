import discord
import os
import requests
import json
import asyncio 
import aiohttp
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from discord import app_commands

config_file = open("config.json", "r")
config_data = json.loads(config_file.read())
intents = discord.Intents.all()
client = discord.Client(intents=intents)
# bot = commands.Bot(intents=intents, command_prefix='/', help_command=None)
tree = app_commands.CommandTree(client)
API_URL=config_data.get('API_URL')
SCHEDULED_MESSAGES_API_URL = config_data.get('SCHEDULED_MESSAGES_API_URL')
ERROR_MESSAGE="Sorry, I'm not available at the moment. Please try again later."


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

async def reply_in_thread(question, thread_is_preexisting, message, response):
    filtered_response = response.replace("Learn more: N/A", "")
    if thread_is_preexisting:
        await message.reply(filtered_response)
    else:
        thread = await message.create_thread(name=question[:100])
        formatted_response = "<@{0}> {1}".format(message.author.id, filtered_response)
        await thread.send(formatted_response)

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
            sources = response_json['sources']

            no_op_faq = """
Sorry, I couldn't find the answer to your question, but here are some sources that may be relevant: {}
"""

            response = ""
            if not contains_answer:
                response = no_op_faq.format(', '.join(sources[:2]))
            else:
                response = response_json['answer']
                if len(sources) > 0:
                    response += """
You can learn more at {}        
""".format(', '.join(sources))
            await reply_in_thread(question, is_thread, message, response)

        except Exception as e:
            print(e)
            await reply_in_thread(question, is_thread, message, ERROR_MESSAGE)

def should_reply(message, client, is_thread, command_string, designated_channels):
    channel_id = str(message.channel.id)

    # the message is from the bot
    if message.author == client.user:
        return False
    # the message is in a thread created by the bot
    elif is_thread and message.channel.owner == client.user:
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
async def on_message(message):

    site_id = str(message.guild.id)
    site_config = config_data["guilds"].get(site_id, {})
    command_string = site_config.get("command_string")
    designated_channels = site_config.get('designated_channels')

    if not (command_string and designated_channels):
        return

    is_thread = isinstance(message.channel, discord.Thread)

    if should_reply(message, client, is_thread, command_string, designated_channels):
        question = message.content.replace(command_string, "")

        channel = message.channel 
        # if is_thread:
        #     thread = message.channel
        # else:
        #     thread = await message.create_thread(name=question[:100])
        await async_send_response(channel, is_thread, message, question, site_id, client) 

client.run(config_data['DISCORD_BOT_TOKEN'])