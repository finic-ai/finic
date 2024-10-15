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
import time
from finic_py.finic import Finic

class NodeDetails(BaseModel):
    selector: Optional[str] = None
    nodeId: Optional[int] = None
    backendNodeId: int
    nodeType: int
    nodeName: str
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
    
    @classmethod
    async def from_backend_node_id(cls, backend_node_id: int, cdp_session: CDPSession) -> "NodeDetails":
        outer_html = await cdp_session.send("DOM.getOuterHTML", {"backendNodeId": backend_node_id})
        outer_html = outer_html["outerHTML"]
        node_details = await cdp_session.send("DOM.describeNode", {"backendNodeId": backend_node_id})
        text_content = BeautifulSoup(outer_html, 'html.parser').get_text(separator='', strip=False)
        text_content = text_content.replace('\t', ' ').replace('\n', ' ')

        filtered_fields = {k: v for k, v in node_details["node"].items() if k in cls.model_fields}

        return cls(**filtered_fields, outerHTML=outer_html, textContent=text_content)

async def test_selector(selector: str, page: Page) -> int:
    elements = await page.query_selector_all(selector)
    return len(elements)

async def generate_selectors(
        node: NodeDetails, 
        page: Page, 
        cdp_session: CDPSession, 
        dom_snapshot: List[Dict[str, Any]], 
        max_results: int = 50,
        skip_siblings: bool = False, 
        max_ancestor_level: int = 50
    ) -> List[str]:
    xpath_root = f"//{node.nodeName.lower()}"
    
    node_tree = dom_snapshot["documents"][0]["nodes"]

    valid_xpaths = []
    
    def generate_by_attribute(node: NodeDetails, max_attributes: int = 4) -> List[str]:
        xpaths_to_test = []
        if node.attributes:
            filtered_attributes = [attr for attr in node.attributes if attr["name"] not in ["class"]]
            # Create a list of xpaths using combinations of attributes
            for i in range(1, min(max_attributes, len(filtered_attributes) + 1)):
                for combo in itertools.combinations(filtered_attributes, i):
                    attr_conditions = []
                    for attr in combo:
                        name = attr["name"]
                        value = attr["value"]
                        attr_conditions.append(f'@{name}="{value}"')
                    xpath = f"{xpath_root}[{' and '.join(attr_conditions)}]"
                    xpaths_to_test.append(xpath)
        
        return xpaths_to_test
    
    def generate_by_classnames(node: NodeDetails, max_classnames: int = 2) -> List[str]:
        xpaths_to_test = []
        if node.attributes:
            class_attributes = [attr for attr in node.attributes if attr["name"] == "class"]
            if class_attributes:
                classnames = class_attributes[0]["value"].split()
                xpaths_to_test = []
                for i in range(1, min(max_classnames + 1, len(classnames) + 1)):
                    for combo in itertools.combinations(classnames, i):
                        class_condition = " and ".join([f'contains(@class, "{c}")' for c in combo])
                        xpaths_to_test.append(f"{xpath_root}[{class_condition}]")
        return xpaths_to_test
    
    def generate_by_text_content(node: NodeDetails) -> List[str]:
        xpaths_to_test = []
        if node.textContent:
            # XPath doesn't have escape characters for whatever reason so we need to handle this manually.
            escaped_text = node.textContent
            if "'" in escaped_text and '"' in escaped_text:
                # Both single and double quotes present, use concat() function
                parts = escaped_text.split("'")
                escaped_text = "concat('" + "', \"'\", '".join(parts) + "')"
            elif "'" in escaped_text:
                # Only single quotes, use double quotes to wrap
                escaped_text = f'"{escaped_text}"'
            else:
                # No single quotes (or only double quotes), use single quotes to wrap
                escaped_text = f"'{escaped_text}'"
            xpaths_to_test.append(f'{xpath_root}[normalize-space(string())={escaped_text}]')
        return xpaths_to_test
    
    async def generate_by_sibling(node: NodeDetails) -> List[str]:
        xpaths_to_test = []
        node_index = node_tree["backendNodeId"].index(node.backendNodeId)
        parent_index = node_tree["parentIndex"][node_index]
        sibling_indices = [i for i, x in enumerate(node_tree["parentIndex"]) if x == parent_index]
        for sib_i in sibling_indices:
            if sib_i == node_index:
                continue
            sibling_node = await NodeDetails.from_backend_node_id(node_tree['backendNodeId'][sib_i], cdp_session)
            sibling_selectors = await generate_selectors(sibling_node, page, cdp_session, dom_snapshot, skip_siblings=True, max_ancestor_level=0)
            if len(sibling_selectors) > 0:
                node_position = sibling_indices.index(node_index) - sibling_indices.index(sib_i)
                if node_position > 0:
                    xpaths_to_test.append(f"{sibling_selectors[0]}/following-sibling::{node.nodeName.lower()}[{node_position}]")
                else:
                    xpaths_to_test.append(f"{sibling_selectors[0]}/preceding-sibling::{node.nodeName.lower()}[{abs(node_position)}]")
                break
        
        return xpaths_to_test

    async def generate_by_ancestor(node: NodeDetails, remaining_ancestor_level: int) -> List[str]:
        # Recursively go up the tree until an ancestor with a unique identifier is found, or until the BODY element is reached.
        xpaths_to_test = []
        if node.nodeName == "BODY" or remaining_ancestor_level == 0:
            return [xpath_root]
        
        node_index = node_tree["backendNodeId"].index(node.backendNodeId)
        parent_index = node_tree["parentIndex"][node_index]
        parent_node_backend_id = node_tree["backendNodeId"][parent_index]
        parent_node = await NodeDetails.from_backend_node_id(parent_node_backend_id, cdp_session)
        parent_selectors = await generate_selectors(parent_node, page, cdp_session, dom_snapshot, max_results=1, max_ancestor_level=remaining_ancestor_level - 1)
        if len(parent_selectors) > 0:
            sibling_indices = [i for i, x in enumerate(node_tree["parentIndex"]) if x == parent_index]
            node_position = sibling_indices.index(node_index) + 1
            if node_position > 0:
                xpaths_to_test.append(f"{parent_selectors[0]}/{node.nodeName.lower()}[{node_position}]")
        return xpaths_to_test

    try:
        xpaths_to_test = generate_by_attribute(node)
        for xpath in xpaths_to_test:
            if await test_selector(xpath, page) == 1 and len(valid_xpaths) < max_results:
                valid_xpaths.append(xpath)

        xpaths_to_test = generate_by_classnames(node)
        for xpath in xpaths_to_test:
            if await test_selector(xpath, page) == 1 and len(valid_xpaths) < max_results:
                valid_xpaths.append(xpath)

        xpaths_to_test = generate_by_text_content(node)
        for xpath in xpaths_to_test:
            if await test_selector(xpath, page) == 1 and len(valid_xpaths) < max_results:
                valid_xpaths.append(xpath)
        
        if not skip_siblings and len(valid_xpaths) < max_results:
            xpaths_to_test = await generate_by_sibling(node)
            for xpath in xpaths_to_test:
                if await test_selector(xpath, page) == 1:
                    valid_xpaths.append(xpath)

        if max_ancestor_level != 0 and len(valid_xpaths) < max_results:
            xpaths_to_test = await generate_by_ancestor(node, max_ancestor_level)
            for xpath in xpaths_to_test:
                if await test_selector(xpath, page) == 1:
                    valid_xpaths.append(xpath)
        
        return valid_xpaths

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

async def handle_process_node(
        finic_api_key: str, 
        task_name: str, 
        task_file_path: str,
        selector_file_path: str,
        inputs_path: str,
        intent: str, 
        selected_node: List[NodeDetails], 
        cdp_session: CDPSession, 
        page: Page, 
        dom_snapshot: List[Dict[str, Any]]
    ) -> None:
    # Generate a selector for the selected node
    valid_selectors = await generate_selectors(selected_node[0], page, cdp_session, dom_snapshot)
    selected_node[0].selector = valid_selectors[0]
    generated_code = None

    with open(task_file_path, 'r') as f:
        existing_code = f.read()

    # Make a GET request to the Finic server to get the code
    try:
        headers = {
            "Authorization": f"Bearer {finic_api_key}"  # Assuming api_key is available in this scope
        }
        body = {
            "intent": intent,
            "element": selected_node[0].dict(),
            "existing_code": existing_code
        }
        response = requests.get("http://0.0.0.0:8080/copilot", headers=headers, json=body)
        response.raise_for_status()  # Raise an exception for bad status codes
        generated_code = response.json()["code"]
        element_identifier = response.json()["elementIdentifier"]
        # You can process the copilot_data here as needed
    except requests.RequestException as e:
        print(f"Error making request to Finic AI Copilot API: {e}")
    
    # Write the generated code to the appropriate file
    with open(task_file_path, 'w') as f:
        f.write(existing_code + generated_code)
    
    with open(selector_file_path, 'a') as f:
        f.write(f"\n{element_identifier}: {selected_node[0].selector}")
    
    with open(inputs_path, 'a') as f:
        f.write(f"\n{element_identifier}: ")
    
    print(f"\nCode generated and written to {task_file_path}")
    print(f"Selector written to {selector_file_path}")
    

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
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mTag:\033[0m {element.nodeName:<{box_width-7}}\033[1m\033[94m│\033[0m")
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
    node = await NodeDetails.from_backend_node_id(backend_node_id, cdp_session)

    selected_node[0] = node
    print_welcome_message()
    print_element_to_terminal(node)
    print("Describe the action to be taken on this element: ", end="", flush=True)

def create_artifacts(task_name: str) -> Tuple[str, str, str]:
    # Check if the finic_tasks directory exists in the current directory
    current_directory = os.getcwd()
    finic_tasks_path = os.path.join(current_directory, 'finic_tasks')
    finic_config_path = os.path.join(current_directory, 'finic_config.yaml')
    
    if os.path.exists(finic_tasks_path) and os.path.exists(finic_config_path):
        task_folder_path = os.path.join(finic_tasks_path, task_name)
        os.makedirs(task_folder_path, exist_ok=True)

        task_file_path = os.path.join(task_folder_path, f'{task_name}.py')
        selectors_path = os.path.join(task_folder_path, 'selectors.yaml')
        inputs_path = os.path.join(task_folder_path, 'inputs.yaml')
        
        if not os.path.exists(selectors_path):
            with open(selectors_path, 'w') as f:
                f.write("")

        if not os.path.exists(inputs_path):
            with open(inputs_path, 'w') as f:
                f.write("")

        if not os.path.exists(task_file_path):
            with open(task_file_path, 'w') as f:
                f.write(f"""from finic import Finic
from playwright.sync_api import Page

def main(page: Page, finic: Finic):
""")

        return task_file_path, selectors_path, inputs_path
    else:
        print("This is not a Finic project. Run `finic init` to initialize Finic.")
        sys.exit(0)

async def copilot(url: str, finic_api_key: str):
    print_welcome_message()
    task_name = input("\n\nGive your task a unique name (e.g. 'automate_tax_website'): ")
    # Replace spaces and dashes with underscores in task_name
    task_name = task_name.replace(' ', '_').replace('-', '_')
    task_file_path, selectors_path, inputs_path = create_artifacts(task_name)
    print(f"Created task file: {task_file_path}")

    inspection_mode = True
    selected_node: List[NodeDetails] = [None]
    dom_snapshot = None

    finic = Finic()
    
    page, context = await finic.launch_browser_async(headless=False, devtools=True)

    ### SET UP CDP AND EVENT LISTENERS ###
    cdp_session = await context.new_cdp_session(page)
    await cdp_session.send('DOM.enable')
    await cdp_session.send('Overlay.enable')
    await cdp_session.send('Runtime.enable')
    await cdp_session.send('DOMSnapshot.enable')


    await cdp_session.send('Overlay.setInspectMode', {
        'mode': 'searchForNode',
        'highlightConfig': {'showInfo': True, 'showExtensionLines': True, 'contentColor': {'r': 255, 'g': 81, 'b': 6, 'a': 0.2}}
    })

    async def handle_key_event(event):
        modifier = 5  # Represents Ctrl+Shift
        nonlocal inspection_mode
        # import pdb; pdb.set_trace()
        # Toggle inspect mode
        if event.get('type') == 'keyDown' and event.get('code') == 'KeyF' and event.get('modifiers') == modifier:
            if inspection_mode:
                await disable_inspection(cdp_session)
                inspection_mode = False
                print("Switched to interaction mode. Use CTRL+SHIFT+F to re-enable selection mode.")
                time.sleep(3)
                print("\033[A\033[K", end="")
            else:
                await enable_inspection(cdp_session)
                inspection_mode = True
                print("Switched to selection mode. Use CTRL+SHIFT+F to re-enable interaction mode.")
                time.sleep(3)
                print("\033[A\033[K", end="")
        
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
    import pdb; pdb.set_trace()

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
    
    dom_snapshot = await cdp_session.send("DOMSnapshot.captureSnapshot", {"computedStyles": []})

    while True:
        print("\nSelect an element in the browser. Enter 'mode' to toggle between selection and interaction mode, or 'quit' to exit: ", end="", flush=True)
        user_input = await asyncio.get_event_loop().run_in_executor(None, input)
        if user_input.lower() in ['quit', 'q']:
            context.close()
            break
        elif user_input.lower() in ['save-browser', 's']:
            finic.save_browser_context(context)
        elif user_input.lower() in ['mode', 'm']:
            if inspection_mode:
                await cdp_session.send('Overlay.setInspectMode', {'mode': 'none', 'highlightConfig': {}})
                inspection_mode = False
                print("Switched to interaction mode.")
            else:
                await cdp_session.send('Overlay.setInspectMode', {'mode': 'searchForNode', 'highlightConfig': {'showInfo': True, 'showExtensionLines': True, 'contentColor': {'r': 255, 'g': 81, 'b': 6, 'a': 0.2}}})
                inspection_mode = True
                print("Switched to selection mode.")
        else:
            if selected_node[0] is None:
                print("Invalid input. Please select an element in the browser first or enter a command.")
                time.sleep(3)
                print("\033[A\033[K", end="")
            elif len(user_input) == 0:
                print("Invalid input")
                time.sleep(3)
                print("\033[A\033[K", end="")
            else:
                await handle_process_node(finic_api_key, task_name, task_file_path, selectors_path, inputs_path, user_input, selected_node, cdp_session, page, dom_snapshot)
    
    context.close()
