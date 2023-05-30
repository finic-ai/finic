import requests
from typing import Dict
import json
from models.models import Message, MessageChannel, MessageSender
from slack_sdk.web import WebClient

class SlackParser:



    def __init__(self, access_token: str):
        self.client = WebClient(token=access_token)
        self.users_cache = {}
        self.slack_workspace_base_url = None

    def get_slack_permalink(self, channel_id: str, message_id: str) -> str:
        if not self.slack_workspace_base_url:
            link = self.client.chat_getPermalink(
                channel=channel_id,
                message_ts=message_id
            )
            # base url is everything before /archives
            self.slack_workspace_base_url = link["permalink"].split("/archives")[0]
            return link["permalink"]
        else:
            return self.slack_workspace_base_url + "/archives/" + channel_id + "/p" + message_id.replace(".", "")

    def parse_message(self, message: Dict, channel: Dict) -> Message:

        link = self.get_slack_permalink(channel["id"], message["ts"])
        user_id = message["user"]
        if user_id in self.users_cache:
            user_name = self.users_cache[user_id]
        else:
            user_response = self.client.users_info(user=user_id)
            user = user_response["user"]
            user_name = user["name"]
            self.users_cache[user_id] = user_name

        msg = Message(
            id=message["ts"],
            channel=MessageChannel(
                id=channel["id"],
                name=channel["name"]
            ),
            sender=MessageSender(
                id=message["user"],
                name=user_name
            ),
            content=self.parse_message_content(message),
            timestamp=message["ts"],
            replies=[],
            uri=link
        )

        # If this message started a thread, fetch the replies
        if "thread_ts" in message:
            response = self.client.conversations_replies(
                channel=channel["id"], 
                ts=message["thread_ts"]
            )
            replies = response["messages"]
            for reply in replies:
                if reply["ts"] == message["ts"]:
                    continue
                link = self.get_slack_permalink(channel["id"], reply["ts"])
                user_response = self.client.users_info(user=message["user"])
                user = user_response["user"]
                msg.replies.append(Message(
                    id=reply["ts"],
                    channel=MessageChannel(
                        id=channel["id"],
                        name=channel["name"]
                    ),
                    sender=MessageSender(
                        id=reply["user"],
                        name=user["name"]
                    ),
                    content=self.parse_message_content(reply),
                    timestamp=reply["ts"],
                    replies=[],
                    uri=link
                ))

        return msg

    def parse_message_content(self, message: Dict) -> str:
        html = "<div>"
        blocks = message["blocks"]
        if not blocks:
            return html + "</div>"
        
        for block in blocks:
            type = block.get("type")
            if type == "rich_text":
                elements = block.get("elements")
                if not elements:
                    continue
                html += self.parse_rich_text_elements(elements)

        html += "</div>"
        return html

    def parse_rich_text_elements(self, elements: Dict) -> str:
        html = ""
        i = 0
        while i < (len(elements)):
            element = elements[i]
            if element["type"] == "rich_text_section":
                nested_elements = element.get("elements")
                html += self.parse_rich_text_elements(nested_elements)
                i += 1
            elif element["type"] == "text":
                html += element["text"]
                i +=1 
            elif element["type"] == "link":
                link_text = element.get("text")
                if link_text:
                    html += "<a href='" + element["url"] + "'>" + link_text + "</a>"
                else:
                    html += "<a href='" + element["url"] + "'>" + element["url"] + "</a>"
                i += 1
            elif element["type"] == "rich_text_list":
                list_html, i = self.parse_rich_text_list(elements, i)
                html += list_html
            else:
                i += 1
                
        return html
    
    def parse_rich_text_list(self, elements: Dict, i):
        html = ""
        first_element = elements[i]
        assert first_element["type"] == "rich_text_list"
        unordered = first_element["style"] == "bullet"

        if unordered:
            html += "<ul>"
        else:
            html += "<ol>"

        while i < len(elements) and elements[i]["type"] == "rich_text_list" and elements[i]["style"] == first_element["style"]:
            nested_elements = elements[i]["elements"]
            html += "<li>" + self.parse_rich_text_elements(nested_elements) + "</li>"
            i += 1
        
        if unordered:
            html += "</ul>"
        else:
            html += "</ol>"
        return html, i

    
    