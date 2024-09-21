from playwright.sync_api import sync_playwright
import time

def generate_xpath(page, element):
    return page.evaluate("""
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

def run(playwright):
    browser = playwright.chromium.launch(headless=False, devtools=True)
    page = browser.new_page()

    # Enable CDP Session
    cdp_session = page.context.new_cdp_session(page)

    # Navigate to a website
    url = input("Enter the URL you want to open: ")
    page.goto(url)

    print("Browser and DevTools are open.")
    print("Use the element selector tool in DevTools (top-left corner icon or Ctrl+Shift+C).")
    print("Select an element on the page.")
    print("Press Enter in this console when you've made a selection.")
    print("Press 'q' and Enter to quit.")

    while True:
        user_input = input()
        if user_input.lower() == 'q':
            break

        try:
            # Get the currently selected element in DevTools
            result = cdp_session.send("DOM.getOuterHTML", {
                "objectId": cdp_session.send("DOM.getDocument")["root"]["nodeId"]
            })
            
            # Use JavaScript to get the selected element
            selected_element = page.evaluate("""
                () => {
                    const el = $0;  // $0 is a special variable in DevTools that refers to the currently selected element
                    if (el) {
                        return {
                            tagName: el.tagName,
                            id: el.id,
                            className: el.className,
                            textContent: el.textContent.trim().substring(0, 100),  // First 100 characters
                            outerHTML: el.outerHTML
                        };
                    }
                    return null;
                }
            """)

            if selected_element:
                print(f"\nSelected element:")
                print(f"Tag: {selected_element['tagName']}")
                print(f"ID: {selected_element['id']}")
                print(f"Class: {selected_element['className']}")
                print(f"Text content (first 100 chars): {selected_element['textContent']}")
                
                # Generate XPath
                xpath = generate_xpath(page, page.evaluate("$0"))
                print(f"\nGenerated XPath: {xpath}")
                
                print(f"\nFull HTML:\n{selected_element['outerHTML']}")
                
                # Verify XPath
                elements = page.query_selector_all(xpath)
                print(f"\nNumber of elements matching this XPath: {len(elements)}")
                
                if len(elements) > 1:
                    print("Warning: This XPath selects multiple elements. You may want to make it more specific.")
                elif len(elements) == 0:
                    print("Warning: This XPath doesn't select any elements. There might be an error in generation.")
                
            else:
                print("No element currently selected in DevTools.")
        except Exception as e:
            print(f"An error occurred: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)