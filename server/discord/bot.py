import discord
import os
import requests
import json

config_file = open("config.json", "r")
config_data = json.loads(config_file.read())
intents = discord.Intents.all()
client = discord.Client(intents=intents)
API_URL=config_data['API_URL']
ERROR_MESSAGE="Sorry, I'm not available at the moment. Please try again later."

async def reply_in_thread(thread, thread_is_preexisting, message, response):
    filtered_response = response.replace("Learn more: N/A", "")
    if thread_is_preexisting:
        await message.reply(filtered_response)
    else:
        formatted_response = "<@{0}> {1}".format(message.author.id, filtered_response)
        await thread.send(formatted_response)
    

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    site_id = str(message.guild.id)
    site_config = config_data.get(site_id, {})
    command_string = site_config.get("command_string")

    if not command_string:
        return

    if command_string in message.content:
        question = message.content.replace(command_string, "")

        channel_id = str(message.channel.id)
        designated_channels = site_config['designated_channels']

        is_thread = isinstance(message.channel, discord.Thread)

        is_not_designated_channel = designated_channels is not None and channel_id not in designated_channels

        if not is_thread and is_not_designated_channel:
            return

        if is_thread:
            thread = message.channel
        else:
            thread = await message.create_thread(name=question[:100])

        async with thread.typing():
            try:
                response = requests.post(API_URL, json={
                    'conversation_transcript': '', 
                    'last_message': question,
                    'conversation_id': 'conversation_id',
                    'site_id': str(site_id)
                }).json()['response']
                
                await reply_in_thread(thread, is_thread, message, response)
                

            except Exception as e:
                print(e)
                await reply_in_thread(thread, is_thread, message, ERROR_MESSAGE)
        
        

client.run(config_data['DISCORD_BOT_TOKEN'])