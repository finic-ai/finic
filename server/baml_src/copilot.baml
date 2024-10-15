class Attribute {
  name string
  value string
}

class Element {
  tagName string
  attributes Attribute[]
  textContent string
  outerHTML string
}

enum InputDataType {
  TEXT
  NUMBER
}

class ResponseFormat {
  elementIdentifier string @description("A descriptive identifier for this element, for example: 'login-button'")
  code string
}

function GeneratePlaywrightCode(intent: string, element: Element, existing_code: string) -> ResponseFormat {
  client "anthropic/claude-3-5-sonnet-20240620"
  prompt #"
    Given a the user's intent and info about an element on a web page, generate python code that uses Playwright to interact with the page according to the user's intent. 
    Use `finic.selectors.get(<element_identifier>)` to get the selector for the element, using the elementIdentifier from the response format.
    
    The existing code is provided. You should generate code that starts on the line exactly after the last line of the existing code.

    User's intent: {{ intent }}

    Element info:
    {{ element }}

    Existing code:
    ```python
    {{ existing_code }}
    ```

    {{ ctx.output_format }}
  "#
}