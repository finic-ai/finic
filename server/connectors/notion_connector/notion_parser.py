import requests
from typing import Dict

BASE_URL = "https://api.notion.com"

class NotionParser:

    def __init__(self, access_token: str):
        self.headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json",
                        "Notion-Version": "2022-06-28"}

    def notion_get_blocks(self, page_id: str):
        res = requests.get(f"{BASE_URL}/v1/blocks/{page_id}/children?page_size=100", headers=self.headers)
        res_json = res.json()
        blocks = res_json.get('results')
        if blocks:
            return blocks
        return []

    def notion_search(self, query: Dict):
        res = requests.post(f"{BASE_URL}/v1/search", headers=self.headers, data=query)
        res_json = res.json()
        pages = res_json.get('results')
        if pages:
            return pages
        return []
    
    def parse_title(self, page):
        title = ""
        title_content = page.get('properties').get('title')
        if title_content:
            if len(title_content.get('title')) > 0:
                title = title_content.get('title')[0].get('text').get('content')
        else:
            # page is in a database
            properties = page.get('properties')
            if properties:
                #loop through properties to find the title
                for key in properties:
                    if properties[key].get('title'):
                        title_array = properties[key].get('title')
                        if len(title_array) > 0:
                            for text in title_array:
                                title += text.get('text').get('content') + ' '
                        title = title.strip()
        return title
    
    def parse_notion_blocks(self, blocks) -> str:
        html = ""
        is_unordered_list = False
        is_ordered_list = False
        for block in blocks:
            block_type = block.get('type')
            block_id = block.get('id')
            has_children = block.get('has_children')
            block_content = block.get(block_type)
            text = block_content.get('rich_text')
            if block_type == 'paragraph':
                if len(text) > 0:
                    html += "<p>"
                    for item in text:
                        html += item.get('plain_text')
                    html += "</p>"
            elif block_type == 'heading_1':
                if len(text) > 0:
                    html += "<h1>"
                    for item in text:
                        html += item.get('plain_text')
                    html += "</h1>"
            elif block_type == 'heading_2':
                if len(text) > 0:
                    html += "<h2>"
                    for item in text:
                        html += item.get('plain_text')
                    html += "</h2>"
            elif block_type == 'heading_3':
                if len(text) > 0:
                    html += "<h3>"
                    for item in text:
                        html += item.get('plain_text')
                    html += "</h3>"
            elif block_type == 'bulleted_list_item':
                if not is_unordered_list:
                    html += "<ul>"
                    is_unordered_list = True
                html += "<li>"
                for item in text:
                    html += item.get('plain_text')
                html += "</li>"
            elif block_type == 'numbered_list_item':
                if not is_ordered_list:
                    html += "<ol>"
                    is_ordered_list = True
                html += "<li>"
                for item in text:
                    html += item.get('plain_text')
                html += "</li>"
            # reset list
            if is_unordered_list and block_type != 'bulleted_list_item':
                html += "</ul>"
                is_unordered_list = False
            if is_ordered_list and block_type != 'numbered_list_item':
                html += "</ol>"
                is_ordered_list = False
            # recurse through children
            if has_children:
                children = self.notion_get_blocks(block_id)
                html += self.parse_notion_blocks(children)
        return html
