from playwright.async_api import async_playwright, Playwright, Page, ElementHandle, CDPSession
import asyncio
from enum import Enum
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
import shutil

class LLMProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

def print_results_to_terminal(result):
    # Get terminal size
    terminal_width, _ = shutil.get_terminal_size()

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

    # Calculate box width based on terminal width
    box_width = min(80, terminal_width - 2)  # Max 80, or 2 less than terminal width

    # Print the box
    print("\033[1m\033[94m┌─" + "─" * (box_width - 2) + "┐\033[0m")
    print(f"\033[1m\033[94m│\033[0m {'Currently selected element':^{box_width-2}}\033[1m\033[94m│\033[0m")
    print("\033[1m\033[94m├─" + "─" * (box_width - 2) + "┤\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mTag:\033[0m {result['tagName']:<{box_width-7}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mID:\033[0m {result['id']:<{box_width-6}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mClass:\033[0m {result['className']:<{box_width-9}}\033[1m\033[94m│\033[0m")
    print(f"\033[1m\033[94m│\033[0m \033[1m\033[92mText content:\033[0m{' ':{box_width-15}}\033[1m\033[94m│\033[0m")
    text_content = result['textContent'][:box_width-4]  # Truncate to fit
    print(f"\033[1m\033[94m│\033[0m {text_content:<{box_width-2}}\033[1m\033[94m│\033[0m")
    print("\033[1m\033[94m└─" + "─" * (box_width - 2) + "┘\033[0m")

    print("\n\033[1mCommands:\033[0m")
    print("  • \033[1m'add'|'a'\033[0m     - Queue this element for selector generation")
    print("  • \033[1m'list'|'l'\033[0m    - View currently queued elements")
    print("  • \033[1m'generate'|'g'\033[0m - Start generating selectors")
    print("  • \033[1m'quit'|'q'\033[0m    - Quit the program")
    print("\n\033[1m\033[38;2;255;165;0mEnter command:\033[0m ", end="", flush=True)


async def generate_xpath(page: Page, element: ElementHandle):
    return await page.evaluate("""
        (element) => {
            if (element.id !== '')
                return '//*[@id="' + element.id + '"]';
            if (element === document.body)
                return '/html/body';

            var ix = 0;
            var siblings = element.parentNode.childNodes;

            for (var i = 0; i < siblings.length; i++) {
                var sibling = siblings[i];
                if (sibling === element)
                    return generate_xpath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
                if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
                    ix++;
            }
        }
    """, element)

def get_full_xpath(cdp_session, node_id):
    def get_node_xpath(node_id):
        node = cdp_session.send("DOM.describeNode", {"nodeId": node_id})
        if node["node"]["nodeType"] == 1:
            tag_name = node["node"]["nodeName"].lower()
            if node["node"].get("attributes"):
                attrs = dict(zip(node["node"]["attributes"][::2], node["node"]["attributes"][1::2]))
                if "id" in attrs:
                    return f'//*[@id="{attrs["id"]}"]'
            siblings = cdp_session.send("DOM.getChildNodes", {"nodeId": node["node"]["parentId"]})["nodes"]
            sibling_tags = [n for n in siblings if n["nodeType"] == 1 and n["nodeName"].lower() == tag_name]
            idx = sibling_tags.index(next(n for n in sibling_tags if n["nodeId"] == node_id)) + 1
            return f"{tag_name}[{idx}]"
        return ""

    xpath_parts = []
    while node_id:
        node = cdp_session.send("DOM.describeNode", {"nodeId": node_id})
        xpath_parts.append(get_node_xpath(node_id))
        node_id = node["node"].get("parentId")
    
    return "/" + "/".join(reversed(xpath_parts))

async def handle_inspect_node(cdp_session: CDPSession, page: Page, event: Dict[str, Any], current_node_id: List[str]):
    # import pdb; pdb.set_trace()
    backend_node_id = event["backendNodeId"]

    # Request the document so DOM.pushNodesByBackendIdsToFrontend works
    document = await cdp_session.send("DOM.getDocument")
    
    # Find the node in the DOM
    await cdp_session.send("DOM.pushNodesByBackendIdsToFrontend", {"backendNodeIds": [backend_node_id]})
    node_details = await cdp_session.send("DOM.describeNode", {"backendNodeId": backend_node_id})
    node_id = node_details["node"]["nodeId"]
    current_node_id[0] = node_id

    # Navigate to the node in the devtools elements inspector
    await cdp_session.send('DOM.setInspectedNode', {
        'nodeId': node_id
    })
    outer_html = await cdp_session.send("DOM.getOuterHTML", {"backendNodeId": backend_node_id})

    result = {
        "tagName": node_details["node"]["localName"],
        "id": node_details["node"].get("attributes", [None, None])[1] if "id" in node_details["node"].get("attributes", []) else "",
        "className": " ".join([value for attr, value in zip(node_details["node"].get("attributes", [])[::2], node_details["node"].get("attributes", [])[1::2]) if attr == "class"]),
        "textContent": BeautifulSoup(outer_html["outerHTML"], 'html.parser').get_text(strip=True),
        "outerHTML": outer_html["outerHTML"]
    }

    print_results_to_terminal(result)
    
    # # Generate XPath
    # xpath = generate_xpath(page, page.evaluate(f"document.evaluate('{get_full_xpath(cdp_session, node_id)}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue"))
    # print(f"\nGenerated XPath: {xpath}")
    
    # print(f"\nFull HTML:\n{result['outerHTML']}")
    
    # # Verify XPath
    # elements = page.query_selector_all(xpath)
    # print(f"\nNumber of elements matching this XPath: {len(elements)}")
    
    # if len(elements) > 1:
    #     print("Warning: This XPath selects multiple elements. You may want to make it more specific.")
    # elif len(elements) == 0:
    #     print("Warning: This XPath doesn't select any elements. There might be an error in generation.")
    # selected_nodes.append(elements[0])

async def generate_selectors(llm_provider: LLMProvider, provider_api_key: str, url: str):
    playwright = await async_playwright().start()
    
    browser = await playwright.chromium.launch(headless=False, devtools=True)
    page = await browser.new_page()

    # Enable CDP Session
    cdp_session = await page.context.new_cdp_session(page)
    await cdp_session.send('DOM.enable')
    await cdp_session.send('Overlay.enable')

    await page.wait_for_load_state('domcontentloaded')


    # Enable inspect mode
    await cdp_session.send('Overlay.setInspectMode', {
        'mode': 'searchForNode',
        'highlightConfig': {'showInfo': True, 'showExtensionLines': True, 'contentColor': {'r': 255, 'g': 81, 'b': 6, 'a': 0.2}}
    })
    
    # Navigate to a website
    await page.goto(url)

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
    print("A Chromium browser with devtools enabled should now be open.")
    print("\n\033[1m\033[38;2;255;165;0mInstructions: \033[0m Select elements on the page. Come back here to view next steps.")
    # print("\n\033[1mCommands:\033[0m")
    # print("  • \033[1m'list'|'l'\033[0m     - View currently queued elements")
    # print("  • \033[1m'generate'|'g'\033[0m - Start generating selectors")
    # print("  • \033[1m'quit'|'q'\033[0m        - Quit the program")
    # print("\n\033[38;2;255;165;0mReady to select elements. Use commands when finished.\033[0m")

    # Track selected nodes
    current_node_id: List[str] = [None]
    selected_nodes: List[ElementHandle] = []

    # Set up event listener for DOM.inspectNodeRequested
    cdp_session.on("Overlay.inspectNodeRequested", lambda event: handle_inspect_node(cdp_session, page, event, current_node_id))

    while True:
        user_input = await asyncio.get_event_loop().run_in_executor(None, input)
        print("\033[1A", end="")  # Move cursor up one line
        print("\033[K", end="")   # Clear the line
        if user_input.lower() in ['quit', 'q']:
            break
        elif user_input.lower() in ['generate', 'g']:
            print("Generating selectors...")
            # Add your selector generation logic here
            print("Selectors generated.")
        elif user_input.lower() in ['list', 'l']:
            print(f"Selected nodes: {selected_nodes}")
        elif user_input.lower() in ['add', 'a']:
            if current_node_id[0] is not None:
                selected_nodes.append(current_node_id[0])
            print("Element added to queue.")
        else:
            print("Invalid command. Please try again.")
            print("\n\033[1m\033[38;2;255;165;0mEnter command:\033[0m ", end="", flush=True)
    await browser.close()