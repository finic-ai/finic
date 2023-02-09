import discord
import os
import requests
import json

config_file = open("config.json", "r")
config_data = json.loads(config_file.read())
intents = discord.Intents.all()
client = discord.Client(intents=intents)
API_URL=config_data['API_URL']

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('<@1065104657149603981>') or message.content.startswith('!help'):
        question = ''
        if message.content.startswith('<@1065104657149603981>'):
            question = message.content[22:]
        elif message.content.startswith('!help'):
            question = message.content[5:]

        site_id = str(message.guild.id)
        site_config = config_data[site_id]

        channel_id = str(message.channel.id)

        if site_config['designated_channel'] is not None and site_config['designated_channel'] != channel_id:
            return

        try:
            response = requests.post(API_URL, json={
                'conversation_transcript': '', 
                'last_message': question,
                'conversation_id': 'conversation_id',
                'site_id': str(site_id)
            }).json()['response']

            await message.reply(response)

        except Exception as e:
            print(e)
            return
        
        

client.run(config_data['DISCORD_BOT_TOKEN'])