from playwright.async_api import async_playwright, Playwright, Page, ElementHandle, CDPSession
import asyncio
from enum import Enum
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup, Tag
import shutil
from pydantic import BaseModel
from baml_client import b as baml
from baml_client.types import Element, Step, Plan, PlanWithSelectors
from baml_py import ClientRegistry, Image
import uuid
import json
import base64
from typing import Literal
from .utils import generate_selector
import requests

client_registry = ClientRegistry()

class NodeInfo(BaseModel):
    tagName: str
    backend_id: int
    user_assigned_id: Optional[str] = str(uuid.uuid4())
    className: str
    textContent: str
    outerHTML: str

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

def print_command_prompt(current_step: Optional[Step] = None):
    print(f"\033[1m\033[38;2;255;165;0mCurrent step:\033[0m {current_step.description}")
    print("Please select the element for this step in the browser")

async def handle_add_node(instructions: str, step_index: int, current_node: List[NodeInfo], cdp_session: CDPSession, page: Page) -> Step:
    target_node = await cdp_session.send("DOM.resolveNode", {"backendNodeId": current_node[0].backend_id})
    target_object_id = target_node["object"]["objectId"]

    target_element = await cdp_session.send("Runtime.callFunctionOn", {
        "functionDeclaration": """
        function() {
            return {
                tagName: this.tagName,
                id: this.id,
                className: this.className,
                attributes: Array.from(this.attributes).map(attr => ({name: attr.name, value: attr.value})),
                textContent: this.textContent
            };
        }
        """,
        "objectId": target_object_id,
        "returnByValue": True
    })

    target = Element(
        tagName=target_element["result"]["value"]["tagName"],
        textContent=target_element["result"]["value"]["textContent"],
        attributes=target_element["result"]["value"]["attributes"]
    )
    
    next_sibling_element = await cdp_session.send("Runtime.callFunctionOn", {
        "functionDeclaration": """
        function() {
            if (this.nextElementSibling) {
                return {
                    tagName: this.nextElementSibling.tagName,
                    id: this.nextElementSibling.id,
                    className: this.nextElementSibling.className,
                    attributes: Array.from(this.nextElementSibling.attributes).map(attr => ({name: attr.name, value: attr.value})),
                    textContent: this.nextElementSibling.textContent
                };
            } else {
                return null;
            }
        }
        """,
        "objectId": target_object_id,
        "returnByValue": True
    })

    previous_sibling_element = await cdp_session.send("Runtime.callFunctionOn", {
        "functionDeclaration": """
        function() {
            if (this.previousElementSibling) {
                return {
                    tagName: this.previousElementSibling.tagName,
                    id: this.previousElementSibling.id,
                    className: this.previousElementSibling.className,
                    attributes: Array.from(this.previousElementSibling.attributes).map(attr => ({name: attr.name, value: attr.value})),
                    textContent: this.previousElementSibling.textContent
                };
            } else {
                return null;
            }
        }
        """,
        "objectId": target_object_id,
        "returnByValue": True
    })
    
    ancestors = await cdp_session.send("Runtime.callFunctionOn", {
        "functionDeclaration": """
        function() {
            let ancestors = [];
            let currentNode = this;
            while (currentNode && currentNode.tagName !== 'BODY') {
                currentNode = currentNode.parentNode;
                if (currentNode) {
                    ancestors.push({
                        tagName: currentNode.tagName,
                        id: currentNode.id,
                        className: currentNode.className,
                        innerHTML: currentNode.innerHTML,
                        attributes: Array.from(currentNode.attributes).map(attr => ({name: attr.name, value: attr.value}))
                    });
                }
            }
            return ancestors;
        }
        """,
        "objectId": target_object_id,
        "returnByValue": True
    })
    next_sibling = None
    if next_sibling_element["result"]["value"] is not None:
        next_sibling = Element(
            tagName=next_sibling_element["result"]["value"]["tagName"],
            textContent=next_sibling_element["result"]["value"]["textContent"],
            attributes=next_sibling_element["result"]["value"]["attributes"]
        )
    previous_sibling = None
    if previous_sibling_element["result"]["value"] is not None:
        previous_sibling = Element(
            tagName=previous_sibling_element["result"]["value"]["tagName"],
            textContent=previous_sibling_element["result"]["value"]["textContent"],
            attributes=previous_sibling_element["result"]["value"]["attributes"]
        )

    trimmed_ancestors = ""
    for i, ancestor in enumerate(ancestors["result"]["value"][:10]):
        if ancestor["tagName"] == "BODY":
            continue
        indent = "  " * i
        attributes = " ".join([f'{attr["name"]}="{attr["value"]}"' for attr in ancestor["attributes"]])
        trimmed_ancestors += f"{indent}<{ancestor['tagName'].lower()} {attributes}>\n"
    trimmed_ancestors = trimmed_ancestors.rstrip()
    import pdb; pdb.set_trace()
    selector_styles = baml.DetermineSelectorStyle(instructions=instructions, target=target, next_sibling=next_sibling, previous_sibling=previous_sibling, ancestors=trimmed_ancestors, baml_options={"client_registry": client_registry})
    if "ID_BASED" in selector_styles and "id" not in target.attributes:
        selector_styles.remove("ID_BASED")
    if "CLASS_BASED" in selector_styles and "class" not in target.attributes:
        selector_styles.remove("CLASS_BASED")
    if "INNER_TEXT_BASED" in selector_styles and (target.textContent == "" or target.textContent is None):
        selector_styles.remove("INNER_TEXT_BASED")
    if "SIBLING_BASED" in selector_styles and next_sibling is None and previous_sibling is None:
        selector_styles.remove("SIBLING_BASED")
    selectors = baml.GenerateXPathSelector(
        instructions=instructions, 
        target=target, 
        next_sibling=next_sibling, 
        previous_sibling=previous_sibling, 
        ancestors=trimmed_ancestors if "PATH_BASED" in selector_styles else None, 
        selector_styles=selector_styles,
        baml_options={"client_registry": client_registry}
    )

    chosen_selector = None
    # Test the selectors
    for selector in selectors:
        element = await page.query_selector(selector)
        if element is not None:
            chosen_selector = selector
            break

    if chosen_selector is None:
        print("No generated selectors were valid. Please enter a selector manually:")
        chosen_selector = input()
    print(f"Element processed. Choose another element or type 'g|generate' to generate selectors for queued elements:")
    
    return Step(step_index=step_index, selector=chosen_selector, instructions=instructions)
    

def print_element_to_terminal(result: NodeInfo):
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

async def generate_procedure(
        procedure_name: str,
        procedure_steps: List[Step],
        llm_provider: Literal["openai", "anthropic"], 
        provider_api_key: str, 
        cdp_session: CDPSession, 
        node_queue: List[NodeInfo]):
    
    procedure_code = await baml.GeneratePlaywrightCode(procedure_name, procedure_steps)
    procedure_filename = f"procedures/{procedure_name}.py"
    with open(procedure_filename, "w") as f:
        f.write(procedure_code)
    
    print(f"\nProcedure code has been written to {procedure_filename}")

async def handle_inspect_node(cdp_session: CDPSession, page: Page, event: Dict[str, Any], selected_node: List[NodeInfo], current_step: Optional[Step] = None):
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

    selected_node[0] = result
    print_welcome_message()
    print_element_to_terminal(result)
    print_command_prompt(current_step)

def execute_plan(plan: List[Step], cdp_session: CDPSession, page: Page):
    pass

def request_elements(plan: List[Step], cdp_session: CDPSession, page: Page, selected_node: List[NodeInfo]):
    import pdb; pdb.set_trace()
    selected_node: List[NodeInfo] = []
    for step in plan:
        cdp_session.on("Overlay.inspectNodeRequested", lambda event: handle_inspect_node(cdp_session, page, event, selected_node, step))
        input()
        step.selector = generate_selector(selected_node[0])
        # Unregister the Overlay.inspectNodeRequested listener
        cdp_session.off("Overlay.inspectNodeRequested")

async def copilot(llm_provider: Literal["openai", "anthropic"], provider_api_key: str, url: str):
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
    await page.wait_for_load_state("load")
    print_welcome_message()
    print("\n\nPress enter to begin...")

    # Set up BAML client registry
    client_registry.add_llm_client(name="Sonnet", 
                                   provider=llm_provider, 
                                   options={
                                       "api_key": provider_api_key,
                                       "model": "claude-3-5-sonnet-20240620"
                                    })
    client_registry.set_primary("Sonnet")

    print("I need to take a screenshot of the page. Please wait...")
    await page.screenshot(path='screenshots/start.png')
    print("Screenshot taken")

    print("Describe the task you want to automate:")
    task_instructions = input()
    print("Creating plan...")
    
    try:
        # Convert the screenshot to base64
        with open('screenshots/start.png', 'rb') as image_file:
            encoded_screenshot = base64.b64encode(image_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error encoding screenshot: {e}")
        return
    
    plan = baml.CreatePlan(screenshot=Image.from_base64(encoded_screenshot), task_instructions=task_instructions)
    while True:
        print("Here's my plan:")
        for step in plan:
            print(f"{step.step_number}. {step.description}")
        print("Would you like to make any changes to the plan? (yes|no)")
        user_input = input()
        if user_input.lower() in ['n', 'no']:
            break
        elif user_input.lower() in ['y', 'yes']:
            print("What changes would you like to make?")
            changes = input()
            plan = baml.ChangePlan(screenshot=page.screenshot(), changes=changes, old_plan=plan)
        else:
            print("Invalid input. Please answer 'yes' or 'no'.")
    
    request_elements(plan, cdp_session, page)
    execute_plan(plan, cdp_session, page)
    browser.close()