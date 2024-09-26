from playwright.async_api import async_playwright, Playwright, Page, ElementHandle, CDPSession
import asyncio
from enum import Enum
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup, Tag
import shutil
from pydantic import BaseModel
from baml_client import b as baml
from baml_client.types import BamlTag, GenerateSelectorsOutput
from baml_py import ClientRegistry
import uuid
import json

class LLMProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

class NodeInfo(BaseModel):
    tagName: str
    backend_id: int
    user_assigned_id: Optional[str] = str(uuid.uuid4())
    className: str
    textContent: str
    outerHTML: str

def compare_tags(tag: Tag, target_tag: Tag) -> bool:
    if tag.name != target_tag.name:
        return False

    if tag.attrs != target_tag.attrs:
        return False

    tag_children = list(tag.children)
    target_tag_children = list(target_tag.children)

    if len(tag_children) != len(target_tag_children):
        return False

    for child, target_child in zip(tag_children, target_tag_children):
        if isinstance(child, Tag) and isinstance(target_child, Tag):
            if not compare_tags(child, target_child):
                return False
        elif isinstance(child, str) and isinstance(target_child, str):
            if child != target_child:
                return False
        else:
            return False

    return True

async def prune_tag(tag: Tag, target: Tag, max_children: int = 3) -> Tag:
    if len(list(tag.children)) == 0:
        return tag
    if max_children < 1:
        tag.clear()
        return tag

    tag_children = list(tag.children)
    target_tag_children = list(target.children)

    # Prune children to keep only 3, including the target tag
    children_to_keep = []
    target_found = False
    for child in tag_children:
        if compare_tags(child, target):
            target_found = True
            if len(children_to_keep) < max_children:
                children_to_keep.append(child)
            else:
                children_to_keep[-1] = child
                break
        elif len(children_to_keep) < max_children:
            children_to_keep.append(child)

    if not target_found:
        raise ValueError("Target tag is not a child of the given tag")

    # Clear existing children and set the children to keep
    tag.clear()
    for child in children_to_keep:
        tag.append(child)

    return tag

def print_welcome_message():
    # Clear the terminal
    print("\033[2J\033[H", end="")
    print("\033[38;2;255;81;6m" + """
    ███████╗  ██╗  ███╗   ██╗  ██╗  ██████╗
    ██╔════╝  ██║  ████╗  ██║  ██║  ██╔════╝
    █████╗    ██║  ██╔██╗ ██║  ██║  ██║     
    ██╔══╝    ██║  ██║╚██╗██║  ██║  ██║     
    ██║       ██║  ██║ ╚████║  ██║  ╚██████╗
    ╚═╝       ╚═╝  ╚═╝  ╚═══╝  ╚═╝   ╚═════╝
    """ + "\033[0m")
    print("\033[1m\033[38;2;255;165;0mAutomatically generate XPath selectors for any website using AI.\033[0m\n")

def print_command_prompt():
    print("\n\033[1m\033[38;2;255;165;0mEnter command (help|add|list|generate|mode|quit):\033[0m ", end="", flush=True)

def print_results_to_terminal(result: NodeInfo):
    terminal_width, _ = shutil.get_terminal_size()
    box_width = min(80, terminal_width - 2)  # Max 80, or 2 less than terminal width

    # Print the box
    print("\033[1m\033[94m┌─" + "─" * (box_width - 2) + "┐\033[0m")
    print(f"\033[1m\033[94m│\033[0m {'Currently selected element':^{box_width-2}}\033[1m\033[94m│\033[0m")
    print("\033[1m\033[94m├─" + "─" * (box_width - 2) + "┤\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mTag:\033[0m {result.tagName:<{box_width-7}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mID:\033[0m {result.backend_id:<{box_width-6}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mClass:\033[0m {result.className:<{box_width-9}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mText content:\033[0m{' ':{box_width-15}}\033[1m\033[94m│\033[0m")
    text_content = result.textContent[:box_width-4]  # Truncate to fit
    print(f"\033[1m\033[94m│\033[0m {text_content:<{box_width-2}}\033[1m\033[94m│\033[0m")
    print("\033[1m\033[94m└─" + "─" * (box_width - 2) + "┘\033[0m")

async def process_selector_queue(llm_provider: LLMProvider, provider_api_key: str, cdp_session: CDPSession, nodes: List[NodeInfo]):
    output = {}
    for node in nodes:
        target_node = await cdp_session.send("DOM.resolveNode", {"backendNodeId": node.backend_id})
        target_object_id = target_node["object"]["objectId"]
        parent_node = await cdp_session.send("Runtime.callFunctionOn", {
            "functionDeclaration": "function() { return this.parentNode; }",  # Just return the element itself
            "objectId": target_object_id,
            "returnByValue": False  # Return as a reference, not a serialized value
        })
        parent_node_id = (await cdp_session.send("DOM.describeNode", {"objectId": parent_node["result"]["objectId"]}))["node"]["backendNodeId"]
        grandparent_node = await cdp_session.send("Runtime.callFunctionOn", {
            "functionDeclaration": "function() { return this.parentNode; }",  # Just return the element itself
            "objectId": parent_node["result"]["objectId"],
            "returnByValue": False  # Return as a reference, not a serialized value
        })
        grandparent_node_id = (await cdp_session.send("DOM.describeNode", {"objectId": grandparent_node["result"]["objectId"]}))["node"]["backendNodeId"]

        # Remove all but 3 children for the target node's parent and grandparent
        target_html = (await cdp_session.send("DOM.getOuterHTML", {"backendNodeId": node.backend_id}))["outerHTML"]
        grandparent_html = (await cdp_session.send("DOM.getOuterHTML", {"backendNodeId": grandparent_node_id}))["outerHTML"]
        parent_html = (await cdp_session.send("DOM.getOuterHTML", {"backendNodeId": parent_node_id}))["outerHTML"]
        
        # Convert target, its parent, and its grandparent to bs4 tags to easily compare and traverse.
        target_soup = BeautifulSoup(target_html, "html.parser")
        target_tag = target_soup.find()

        grandparent_soup = BeautifulSoup(grandparent_html, "html.parser")
        grandparent_tag = grandparent_soup.find()
        
        parent_soup = BeautifulSoup(parent_html, "html.parser")
        parent_tag = parent_soup.find()
        
        # Prune the parent and grandparent tags to minimize tokens.
        html_context = await prune_tag(grandparent_tag, parent_tag)
        await prune_tag(parent_tag, target_tag)

        cr = ClientRegistry()

        if llm_provider == LLMProvider.ANTHROPIC:
            cr.add_llm_client(name='Claude', provider='anthropic', options={
                "model": "claude-3-5-sonnet-20240620",
                "api_key": provider_api_key
            })
            cr.set_primary('Claude')
            result = baml.GenerateSelectorsAnthropic(tag=BamlTag(user_assigned_id=node.user_assigned_id, html=str(target_html)), html_context=str(html_context), mode="XPATH", baml_options={"client_registry": cr})
        else:
            cr.add_llm_client(name='GPT4o', provider='openai', options={
                "model": "gpt-4o",
                "api_key": provider_api_key
            })
            cr.set_primary('GPT4o')
            result = baml.GenerateSelectorsOpenAI(tag=BamlTag(user_assigned_id=node.user_assigned_id, html=str(target_html)), html_context=str(html_context), mode="XPATH", baml_options={"client_registry": cr})
        
        output[node.user_assigned_id] = result.dict()
    
    with open('selectors.json', 'w') as f:
        json.dump(output, f, indent=2)
    print(f"\nSelectors have been generated and saved to selectors.json")

async def handle_inspect_node(cdp_session: CDPSession, page: Page, event: Dict[str, Any], current_node: List[NodeInfo]):
    backend_node_id = event["backendNodeId"]

    # Request the document so DOM.pushNodesByBackendIdsToFrontend works
    document = await cdp_session.send("DOM.getDocument")
    
    # Find the node in the DOM
    await cdp_session.send("DOM.pushNodesByBackendIdsToFrontend", {"backendNodeIds": [backend_node_id]})
    node_details = await cdp_session.send("DOM.describeNode", {"backendNodeId": backend_node_id})
    node_id = node_details["node"]["nodeId"]
    await cdp_session.send("DOM.setInspectedNode", {"nodeId": node_id})

    # Navigate to the node in the devtools elements inspector
    await cdp_session.send('DOM.setInspectedNode', {
        'nodeId': node_id
    })
    outer_html = await cdp_session.send("DOM.getOuterHTML", {"nodeId": node_id})
    result = NodeInfo(
        tagName=node_details["node"]["localName"],
        backend_id=backend_node_id,
        className=" ".join([value for attr, value in zip(node_details["node"].get("attributes", [])[::2], node_details["node"].get("attributes", [])[1::2]) if attr == "class"]),
        textContent=BeautifulSoup(outer_html["outerHTML"], 'html.parser').get_text(strip=True),
        outerHTML=outer_html["outerHTML"]
    )

    current_node[0] = result
    print_welcome_message()
    print_results_to_terminal(result)
    print_command_prompt()

async def generate_selectors(llm_provider: LLMProvider, provider_api_key: str, url: str):
    playwright = await async_playwright().start()
    
    browser = await playwright.chromium.launch(headless=False)
    page = await browser.new_page()

    # Enable CDP Session
    cdp_session = await page.context.new_cdp_session(page)
    await cdp_session.send('DOM.enable')
    await cdp_session.send('Overlay.enable')


    # Enable inspect mode
    interaction_mode = True
    await cdp_session.send('Overlay.setInspectMode', {
        'mode': 'searchForNode',
        'highlightConfig': {'showInfo': True, 'showExtensionLines': True, 'contentColor': {'r': 255, 'g': 81, 'b': 6, 'a': 0.2}}
    })
    
    # Navigate to a website
    await page.goto(url)

    print_welcome_message()
    print("A Chromium browser with devtools enabled should now be open.")
    print("\n\033[1m\033[38;2;255;165;0mInstructions: \033[0m Select elements on the page. Come back here to view next steps.")

    # Track selected nodes
    current_node: List[NodeInfo] = [None]
    selected_nodes: List[NodeInfo] = []

    # Set up event listener for DOM.inspectNodeRequested
    cdp_session.on("Overlay.inspectNodeRequested", lambda event: handle_inspect_node(cdp_session, page, event, current_node))

    while True:
        user_input = await asyncio.get_event_loop().run_in_executor(None, input)
        print("\033[1A", end="")  # Move cursor up one line
        print("\033[K", end="")   # Clear the line
        if user_input.lower() in ['quit', 'q']:
            break
        elif user_input.lower() in ['generate', 'g']:
            print("Generating selectors...")
            await process_selector_queue(llm_provider, provider_api_key, cdp_session, selected_nodes)
            print("Selectors generated.")
            print_command_prompt()
        elif user_input.lower() in ['list', 'l']:
            print(f"Selected nodes: {selected_nodes}")
            print_command_prompt()
        elif user_input.lower() in ['add', 'a']:
            print("Enter a unique identifier for the element (e.g. 'resume-section-1'):")
            user_assigned_id = input()
            current_node[0].user_assigned_id = user_assigned_id
            if current_node[0] is not None:
                selected_nodes.append(current_node[0])
            print("Element added to queue.")
            print_command_prompt()
        elif user_input.lower() in ['mode', 'm']:
            if interaction_mode:
                await cdp_session.send('Overlay.setInspectMode', {'mode': 'none', 'highlightConfig': {}})
                interaction_mode = False
                print("Interaction mode disabled.")
            else:
                await cdp_session.send('Overlay.setInspectMode', {'mode': 'searchForNode', 'highlightConfig': {'showInfo': True, 'showExtensionLines': True, 'contentColor': {'r': 255, 'g': 81, 'b': 6, 'a': 0.2}}})
                interaction_mode = True
                print("Selection mode enabled.")
            print_command_prompt()
        elif user_input.lower() in ['help', 'h']:
            print("Click on eleements in the browser. Confirm your selection in the box above. Use 'a|add' to queue an element for generation. Use 'g|generate' to generate selectors for queued elements. Use 'l|list' to view queued elements.")
            print("\n\033[1mCommands:\033[0m")
            print("  • \033[1m'add'|'a'\033[0m     - Queue this element for selector generation")
            print("  • \033[1m'list'|'l'\033[0m    - View currently queued elements")
            print("  • \033[1m'm'|'mode'\033[0m    - Change between interaction and selection mode")
            print("  • \033[1m'generate'|'g'\033[0m - Start generating selectors")
            print("  • \033[1m'quit'|'q'\033[0m    - Quit the program")
            print("\n\033[1m\033[38;2;255;165;0mEnter command:\033[0m ", end="", flush=True)
        else:
            print("Invalid command. Please try again.")
            print_command_prompt()
    await browser.close()