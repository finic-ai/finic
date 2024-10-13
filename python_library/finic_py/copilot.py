from playwright.async_api import async_playwright, Playwright, Page, ElementHandle, CDPSession
import asyncio
from enum import Enum
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup, Tag
import shutil
from pydantic import BaseModel, field_validator
import uuid
import json
import base64
from typing import Literal, Tuple
import requests
import platform
import os
import sys
import itertools

class NodeDetails(BaseModel):
    selector: Optional[str] = None
    nodeId: int
    backendNodeId: int
    nodeType: int
    nodeName: str
    localName: str
    nodeValue: str
    childNodeCount: Optional[int] = 0
    attributes: List[Dict[str, str]] = []
    textContent: Optional[str] = None
    outerHTML: Optional[str] = None

    @field_validator('attributes', mode='before')
    def parse_attributes(cls, v):
        if isinstance(v, list):
            if all(isinstance(item, str) for item in v):
                return [{'name': v[i], 'value': v[i+1]} for i in range(0, len(v), 2) if i+1 < len(v)]
            elif all(isinstance(item, dict) for item in v):
                return v
        raise ValueError('attributes must be a list of strings or dictionaries')

def test_selector(selector: str, page: Page) -> int:
    elements = page.query_selector_all(selector)
    return len(elements)

def generate_selector(node: NodeDetails, page: Page, cdp_session: CDPSession, dom_snapshot: List[Dict[str, Any]]) -> str:
    xpath_root = f"//{node.localName}"
    
    node_tree = dom_snapshot["documents"][0]["nodes"]
    selected_node_index = node_tree["backendNodeId"].index(node.backendNodeId)
    parent_index = node_tree["parentIndex"][selected_node_index]

    valid_xpaths = []
    
    def generate_by_attribute(node: NodeDetails, max_attributes: int = 8) -> List[str]:
        xpaths_to_test = []
        if node.attributes:
            # Create a list of xpaths using combinations of attributes
            for i in range(1, min(max_attributes, len(node.attributes) + 1)):
                for combo in itertools.combinations(node.attributes, i):
                    attr_conditions = []
                    for attr in combo:
                        attr_conditions.append(f"@{attr['name']}='{attr['value']}'")
                    xpath = f"{xpath_root}[{' and '.join(attr_conditions)}]"
                    xpaths_to_test.append(xpath)
        
        return xpaths_to_test
    
    def generate_by_classnames(node: NodeDetails, max_classnames: int = 8) -> List[str]:
        xpaths_to_test = []
        if node.attributes:
            class_attributes = [attr for attr in node.attributes if attr["name"] == "class"]
            if class_attributes:
                classnames = class_attributes[0]["value"].split()
                xpaths_to_test = []
                for i in range(1, min(max_classnames, len(classnames) + 1)):
                    for combo in itertools.combinations(classnames, i):
                        class_condition = " and ".join([f"contains(@class, '{c}')" for c in combo])
                        xpaths_to_test.append(f"{xpath_root}[{class_condition}]")
        return xpaths_to_test
    
    def generate_by_text_content(node: NodeDetails) -> List[str]:
        xpaths_to_test = []
        if node.textContent:
            xpaths_to_test.append(f'{xpath_root}[normalize-space(string())="{node.textContent}"]')
        return xpaths_to_test
    
    async def generate_by_sibling(node: NodeDetails) -> List[str]:
        xpaths_to_test = []
        if node.textContent:
            xpaths_to_test.append(f'{xpath_root}/following-sibling::*[normalize-space(string())="{node.textContent}"]')
        return xpaths_to_test

    async def generate_by_path(node: NodeDetails) -> List[str]:
        # Recursively go up the tree until a unique identifier is found, or until we find the <body> tag
        xpaths_to_test = []
        node_index = node_tree["backendNodeId"].index(node.backendNodeId)
        parent_node_backend_id = node_tree["parentIndex"][node_index]
        parent_node_details = await cdp_session.send("DOM.describeNode", {"backendNodeId": parent_node_backend_id})
        parent_node = NodeDetails(**parent_node_details["node"])
        
        outer_html = await cdp_session.send("DOM.getOuterHTML", {"backendNodeId": parent_node_backend_id})
        parent_node.outerHTML = outer_html["outerHTML"]
        parent_node.textContent = BeautifulSoup(parent_node.outerHTML, 'html.parser').get_text(separator=' ', strip=True)

        return xpaths_to_test

    try:
        xpaths_to_test = (generate_by_attribute(node))
        for xpath in xpaths_to_test:
            if test_selector(xpath, page) == 1:
                valid_xpaths.append(xpath)
        
        xpaths_to_test = (generate_by_classnames(node))
        for xpath in xpaths_to_test:
            if test_selector(xpath, page) == 1:
                valid_xpaths.append(xpath)

        xpaths_to_test = (generate_by_text_content(node))
        for xpath in xpaths_to_test:
            if test_selector(xpath, page) == 1:
                valid_xpaths.append(xpath)

        xpaths_to_test = (generate_by_path(node))
        for xpath in xpaths_to_test:
            if test_selector(xpath, page) == 1:
                valid_xpaths.append(xpath)

    except Exception as e:
        print(e)

async def enable_inspection(cdp_session: CDPSession):
    await cdp_session.send('Overlay.setInspectMode', {'mode': 'searchForNode', 'highlightConfig': {'showInfo': True, 'showExtensionLines': True, 'contentColor': {'r': 255, 'g': 81, 'b': 6, 'a': 0.2}}})

async def disable_inspection(cdp_session: CDPSession):
    await cdp_session.send('Overlay.setInspectMode', {'mode': 'none', 'highlightConfig': {}})

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
    print("\033[1m\033[38;2;255;165;0mGenerate code to automate any website using AI.\033[0m\n")
    print("Type 'help' for a list of commands. View full instructions here: https://docs.finic.ai/capture-mode")

async def handle_process_node(finic_api_key: str, task_name: str, intent: str, selected_node: List[NodeDetails], cdp_session: CDPSession, page: Page) -> None:
    # Generate a selector for the selected node
    selector = generate_selector(selected_node[0])
    selected_node[0].selector = selector
    generated_code = None

    task_file_path = f"finic_tasks/{task_name}.py"
    with open(task_file_path, 'r') as f:
        existing_code = f.read()

    # Make a GET request to the Finic server to get the code
    try:
        headers = {
            "Authorization": f"Bearer {finic_api_key}"  # Assuming api_key is available in this scope
        }
        body = {
            "intent": intent,
            "element": selected_node[0],
            "existing_code": existing_code
        }
        response = requests.post("https://api.finic.ai/copilot", headers=headers, json=body)
        response.raise_for_status()  # Raise an exception for bad status codes
        generated_code = response.json()["code"]
        # You can process the copilot_data here as needed
    except requests.RequestException as e:
        print(f"Error making request to Finic AI Copilot API: {e}")
    
    # Write the generated code to the appropriate file
    with open(task_file_path, 'w') as f:
        f.write(existing_code + generated_code)

    
    

def print_element_to_terminal(element: NodeDetails):
    terminal_width, _ = shutil.get_terminal_size()
    box_width = min(80, terminal_width - 2)  # Max 80, or 2 less than terminal width
    text_content = element.textContent[:box_width-4] if element.textContent else ""  # Truncate to fit
    attributes = ' '.join([f"{attribute['name']}=\"{attribute['value']}\"" 
                           for attribute in element.attributes])

    # Print the box
    print("\033[1m\033[94m┌─" + "─" * (box_width - 2) + "┐\033[0m")
    print(f"\033[1m\033[94m│\033[0m {'Currently selected element':^{box_width-2}}\033[1m\033[94m│\033[0m")
    print("\033[1m\033[94m├─" + "─" * (box_width - 2) + "┤\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mTag:\033[0m {element.localName:<{box_width-7}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mID:\033[0m {element.backendNodeId:<{box_width-6}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mAttributes:\033[0m{' ':{box_width-14}}\033[1m\033[94m│\033[0m")
    
    # Print attributes, wrapping if necessary
    attr_lines = [attributes[i:i+box_width-4] for i in range(0, len(attributes), box_width-4)]
    for line in attr_lines:
        print(f"\033[1m\033[94m│\033[0m {line:<{box_width-2}}\033[1m\033[94m│\033[0m")
    
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mText content:\033[0m{' ':{box_width-15}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m {text_content:<{box_width-2}}\033[1m\033[94m│\033[0m")
    print("\033[1m\033[94m└─" + "─" * (box_width - 2) + "┘\033[0m")

async def cycle_elements_up(cdp_session: CDPSession, selected_node: List[NodeDetails], dom_snapshot: List[Dict[str, Any]]) -> None:
    node_tree = dom_snapshot["documents"][0]["nodes"]
    selected_node_index = node_tree["backendNodeId"].index(selected_node[0].backendNodeId)
    parent_index = node_tree["parentIndex"][selected_node_index]

    if parent_index:
        parent_backend_id = node_tree["backendNodeId"][parent_index]
        await handle_inspect_node(cdp_session, selected_node, backend_node_id=parent_backend_id)

async def cycle_elements_down(cdp_session: CDPSession, selected_node: List[NodeDetails], dom_snapshot: List[Dict[str, Any]]) -> None:
    node_tree = dom_snapshot["documents"][0]["nodes"]
    selected_node_index = node_tree["backendNodeId"].index(selected_node[0].backendNodeId)
    try:
        child_index = node_tree["parentIndex"].index(selected_node_index)
        child_backend_id = node_tree["backendNodeId"][child_index]
        await handle_inspect_node(cdp_session, selected_node, backend_node_id=child_backend_id)
    except ValueError:
        return

async def handle_inspect_node(cdp_session: CDPSession, selected_node: List[NodeDetails], node_id: Optional[int] = None, backend_node_id: Optional[int] = None):
    if not node_id and not backend_node_id:
        raise ValueError("Either node_id or backend_node_id must be provided")
    # Request the document so DOM.pushNodesByBackendIdsToFrontend works
    document = await cdp_session.send("DOM.getDocument")

    if backend_node_id and not node_id:
        # Find the node in the DOM
        await cdp_session.send("DOM.pushNodesByBackendIdsToFrontend", {"backendNodeIds": [backend_node_id]})
        node_details = await cdp_session.send("DOM.describeNode", {"backendNodeId": backend_node_id})
        node_id = node_details["node"]["nodeId"]
    outer_html = await cdp_session.send("DOM.getOuterHTML", {"nodeId": node_id})

    await cdp_session.send("DOM.setInspectedNode", {"nodeId": node_id})
    await cdp_session.send("DOM.highlightNode", {
        "highlightConfig": {
            "showInfo": True,
            "showExtensionLines": True,
            "containerColor": {"r": 0, "g": 255, "b": 0, "a": 0.3},
            "contentColor": {"r": 0, "g": 255, "b": 0, "a": 0.3}
        },
        "nodeId": node_id
    })
    result = NodeDetails(**node_details["node"])
    result.outerHTML = outer_html["outerHTML"]
    result.textContent = BeautifulSoup(outer_html["outerHTML"], 'html.parser').get_text(separator=' ', strip=True)

    selected_node[0] = result
    print_welcome_message()
    print_element_to_terminal(result)
    print("Describe the action to be taken on this element: ", end="", flush=True)

def create_artifacts(task_name: str) -> Tuple[str, str]:
    # Check if the finic_tasks directory exists in the current directory
    current_directory = os.getcwd()
    finic_tasks_path = os.path.join(current_directory, 'finic_tasks')
    finic_config_path = os.path.join(current_directory, 'finic_config.yaml')
    
    if os.path.exists(finic_tasks_path) and os.path.exists(finic_config_path):
        task_folder_path = os.path.join(finic_tasks_path, task_name)
        os.makedirs(task_folder_path, exist_ok=True)

        task_file_path = os.path.join(task_folder_path, f'{task_name}.py')
        selectors_path = os.path.join(task_folder_path, 'selectors.yaml')
        
        if not os.path.exists(selectors_path):
            with open(selectors_path, 'w') as f:
                f.write("")

        if not os.path.exists(task_file_path):
            with open(task_file_path, 'w') as f:
                f.write(f"""from finic import Finic
from playwright.sync_api import Page

def main(page: Page, finic: Finic):
""")

        return task_file_path, selectors_path
    else:
        print("This is not a Finic project. Run `finic init` to initialize Finic.")
        sys.exit(0)

async def copilot(url: str, finic_api_key: str):
    print_welcome_message()
    task_name = input("\n\nGive your task a unique name (e.g. 'automate_tax_website'): ")
    # Replace spaces and dashes with underscores in task_name
    task_name = task_name.replace(' ', '_').replace('-', '_')
    task_file_path, selectors_path = create_artifacts(task_name)
    print(f"Created task file: {task_file_path}")

    inspection_mode = True
    selected_node: List[NodeDetails] = [None]
    dom_snapshot = None

    playwright = await async_playwright().start()
    
    browser = await playwright.chromium.launch(headless=False, devtools=True)
    page = await browser.new_page()

    ### SET UP CDP AND EVENT LISTENERS ###
    cdp_session = await page.context.new_cdp_session(page)
    await cdp_session.send('DOM.enable')
    await cdp_session.send('Overlay.enable')
    await cdp_session.send('Runtime.enable')
    await cdp_session.send('DOMSnapshot.enable')


    await cdp_session.send('Overlay.setInspectMode', {
        'mode': 'searchForNode',
        'highlightConfig': {'showInfo': True, 'showExtensionLines': True, 'contentColor': {'r': 255, 'g': 81, 'b': 6, 'a': 0.2}}
    })

    async def handle_key_event(event):
        nonlocal inspection_mode
        modifier = 5  # Represents Ctrl+Shift
        # Toggle inspect mode
        if event.get('type') == 'keyDown' and event.get('code') == 'KeyF' and event.get('modifiers') == modifier:
            if inspection_mode:
                await disable_inspection(cdp_session)
                inspection_mode = False
                print("Switched to interaction mode. Use CMD/CTRL+SHIFT+F to re-enable selection mode.")
            else:
                await enable_inspection(cdp_session)
                inspection_mode = True
                print("Switched to selection mode. Use CMD/CTRL+SHIFT+F to re-enable interaction mode.")
        
        # Cycle through element layers
        elif len(selected_node) > 0 and inspection_mode:
            if event.get('type') == 'keyDown' and event.get('code') == 'ArrowUp':
                await cycle_elements_up(cdp_session, selected_node, dom_snapshot)
            elif event.get('type') == 'keyDown' and event.get('code') == 'ArrowDown':
                await cycle_elements_down(cdp_session, selected_node, dom_snapshot)

    def handle_console_event(event: Dict[str, Any]):
        if event['type'] == 'log':
            data = event.get('args', [])
            if data and data[0].get('value', '').startswith('KeyEvent:'):
                key_event = json.loads(data[1]['value'])
                asyncio.create_task(handle_key_event(key_event))

    cdp_session.on("Overlay.inspectNodeRequested", lambda event: handle_inspect_node(cdp_session, selected_node, backend_node_id=event["backendNodeId"]))
    cdp_session.on("Runtime.consoleAPICalled", lambda params: handle_console_event(params))

    # Navigate to a website
    await page.goto(url)
    await page.wait_for_load_state("load")

    await page.evaluate("""
        window.addEventListener('keydown', (event) => {
            const key = event.key;
            const code = event.code;
            const modifiers = (event.metaKey ? 8 : 0) | (event.ctrlKey ? 4 : 0) | (event.altKey ? 2 : 0) | (event.shiftKey ? 1 : 0);
            console.log('KeyEvent:', JSON.stringify({ type: 'keyDown', key, code, modifiers }));
            
            if (code === 'ArrowUp' || code === 'ArrowDown') {
                event.preventDefault();
            }
        });
    """)
    print("\nSelect an element in the browser. Enter 'mode' to toggle between selection and interaction mode, or 'quit' to exit: ", end="", flush=True)
    
    dom_snapshot = await cdp_session.send("DOMSnapshot.captureSnapshot", {"computedStyles": []})

    while True:
        user_input = await asyncio.get_event_loop().run_in_executor(None, input)
        if user_input.lower() in ['quit', 'q']:
            browser.close()
            break
        elif user_input.lower() in ['mode', 'm']:
            if inspection_mode:
                await cdp_session.send('Overlay.setInspectMode', {'mode': 'none', 'highlightConfig': {}})
                inspection_mode = False
                print("Switched to interaction mode.")
            else:
                await cdp_session.send('Overlay.setInspectMode', {'mode': 'searchForNode', 'highlightConfig': {'showInfo': True, 'showExtensionLines': True, 'contentColor': {'r': 255, 'g': 81, 'b': 6, 'a': 0.2}}})
                inspection_mode = True
                print("Switched to selection mode.")
        elif user_input.lower() in ['help', 'h']:
            print("Click on eleements in the browser. Confirm your selection in the box above. Use 'a|add' to queue an element for generation. Use 'g|generate' to generate selectors for queued elements. Use 'l|list' to view queued elements.")
            print("\n\033[1mCommands:\033[0m")
            print("  • \033[1m'm'|'mode'\033[0m    - Change between interaction and selection mode")
            print("  • \033[1m'quit'|'q'\033[0m    - Quit the program")
            print("\n\033[1m\033[38;2;255;165;0mEnter command:\033[0m ", end="", flush=True)
        else:
            if len(selected_node) > 0:
                pass
                # result = await handle_process_node(finic_api_key, task_name, user_input, selected_node, cdp_session, page)
            else:
                print("Invalid input. Please select an element in the browser first or enter a command.")
    
    browser.close()
