import requests
from typing import Dict
import json
from models.models import Message, MessageChannel, MessageSender
from slack_sdk.web import WebClient

class SlackParser:

    def __init__(self, access_token: str):
        self.client = WebClient(token=access_token)

    def parse_message(self, message: Dict, channel: Dict) -> Message:

        link = self.client.chat_getPermalink(
            channel=channel["id"],
            message_ts=message["ts"]
        )
        user_response = self.client.users_info(user=message["user"])
        user = user_response["user"]

        msg = Message(
            id=message["ts"],
            channel=MessageChannel(
                id=channel["id"],
                name=channel["name"]
            ),
            sender=MessageSender(
                id=message["user"],
                name=user["name"]
            ),
            content=self.parse_message_content(message),
            timestamp=message["ts"],
            replies=[],
            uri=link["permalink"]
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
                link = self.client.chat_getPermalink(
                    channel=channel["id"],
                    message_ts=reply["ts"]
                )
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
                    uri=link["permalink"]
                ))

        return msg

    def parse_message_content(self, message: Dict) -> str:
        html = "<div>"
        blocks = message["blocks"]
        if not blocks:
            return html + "</div>"
        
        for block in blocks:
            print(blocks)
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
            print(i)
            element = elements[i]
            if element["type"] == "rich_text_section":
                nested_elements = element.get("elements")
                html += self.parse_rich_text_elements(nested_elements)
                i += 1
            elif element["type"] == "text":
                html += element["text"]
                i +=1 
            elif element["type"] == "link":
                html += "<a href='" + element["url"] + "'>" + element["text"] + "</a>"
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

    
    