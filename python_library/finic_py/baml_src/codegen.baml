class Attribute {
  name string
  value string
}

class Element {
  tagName string
  textContent string?
  attributes Attribute[]
}

class Step_ {
  step_index int
  selector string
  instructions string
}

enum SelectorStyle {
  ID_BASED @description("Use the element's id, data-id, or name attribute")
  CLASS_BASED @description("Use the element's class attribute")
  PATH_BASED @description("Use the path between the element and its ancestors")
  INNER_TEXT_BASED @description("Use the element or its children's inner text")
  LABEL_BASED @description("Use nearby static text or label elements")
  SIBLING_BASED @description("Use the element's next or previous sibling's tag, text, or attribute")
  HREF_BASED @description("Use the element's href attribute")
  STYLE_BASED @description("Use the element's style attribute")
  OTHER_ATTRIBUTE_BASED @description("Use the element's other attributes")
}

template_string FinicAPIReference() #"
  class Finic:
    """
    Finic class for browser automation and interaction.
    
    Attributes:
        api_key (Optional[str]): API key for authentication.
        env (Optional[FinicEnvironment]): Environment setting (LOCAL or PROD).
        context_storage_path (Optional[str]): Path to store browser context, default is "storage_state.json".
    """

    def __init__(self, api_key: Optional[str] = None, environment: Optional[FinicEnvironment] = None):
        """
        Initialize a new Finic instance.

        Args:
            api_key (Optional[str]): API key for authentication. If not provided, tries to get from environment variable.
            environment (Optional[FinicEnvironment]): Environment setting. If not provided, uses FINIC_ENV environment variable or defaults to LOCAL.
        """
        # Implementation details...

    def save_context(self, context: BrowserContext, path: Optional[str] = None) -> None:
        """
        Save the current browser context to a file.

        Args:
            context (BrowserContext): The browser context to save.
            path (Optional[str]): The path to save the context. If not provided, uses the default path.
        """
        # Implementation omitted...

    def screenshot(self, page: Union[Page, AsyncPage], selector: str, path: str) -> None:
        """
        Take a screenshot of a specific element on the page.

        Args:
            page (Union[Page, AsyncPage]): The page object to screenshot.
            selector (str): The selector for the element to screenshot.
            path (str): The file path to save the screenshot.
        """
        # Implementation omitted...

    @classmethod
    def procedure(cls, func: Callable) -> Callable:
        """
        Decorator for procedure functions. Ensures the first argument is a Page object and the return value is a Page object.

        Args:
            func (Callable): The function to wrap.

        Returns:
            Callable: Wrapped function.
        """
        # Implementation omitted...

"#

function DetermineSelectorStyle(instructions: string, target: Element, next_sibling: Element?, previous_sibling: Element?, ancestors: string) -> SelectorStyle[] {
  client "anthropic/claude-3-5-sonnet-20240620"
  prompt #"
    Determine the best way to create an XPath selector for the provided HTML element, based on the instructions provided by the user
    as well as its ancestors{% if next_sibling or previous_sibling %} and siblings{% endif %}. Consider whether the element's attributes are unique, whether it has a discernible label, 
    and whether the text of the element or its children can be used to uniquely identify it. Return in order of preference, from
    most preferred to least preferred.

    User Instructions: {{ instructions }}

    Target Element:
    {{ target }}

    {% if next_sibling %}
    Next Sibling:
    {{ next_sibling }}
    {% endif %}

    {% if previous_sibling %}
    Previous Sibling:
    {{ previous_sibling }}
    {% endif %}

    Ancestors:
    {{ ancestors }}

    {{ ctx.output_format }}
  "#
}

// Generate a selector for a given HTML element.
function GenerateXPathSelector(instructions: string, target: Element, ancestors: string, next_sibling: Element?, previous_sibling: Element?, selector_styles: SelectorStyle[]) -> string[] {
  client "anthropic/claude-3-5-sonnet-20240620"
  prompt #"
    Generate three XPath selectors based on the provided HTML tag and the user's instructions. Return them in order of confidence.

    User Instructions: {{ instructions }}

    Adhere to the following guidelines when determining the best XPath:
    {% for selector_style in selector_styles %}
    {% if selector_style == "OTHER_ATTRIBUTE_BASED" %}
    - Consider the tag's attributes
    {% elif selector_style == "ID_BASED" %}
    - Consider the tag's id attribute
    {% elif selector_style == "CLASS_BASED" %}
    - Consider the tag's class attribute
    {% elif selector_style == "PATH_BASED" %}
    - Consider the path between the tag and its ancestors
    {% elif selector_style == "INNER_TEXT_BASED" %}
    - Consider the tag's inner text. Use normalize-space(string(.) || string(*)) to get the text content.
    {% elif selector_style == "LABEL_BASED" %}
    - Consider nearby static text or label elements
    {% endif %}
    {% if selector_style == "HREF_BASED" %}
    - Consider the tag's href attribute
    {% endif %}
    {% if selector_style == "STYLE_BASED" %}
    - Consider the tag's style attribute
    {% endif %}
    {% endfor %}

    Target Tag:
    {{ target }}

    {% if next_sibling %}
    Next Sibling:
    {{ next_sibling }}
    {% endif %}

    {% if previous_sibling %}
    Previous Sibling:
    {{ previous_sibling }}
    {% endif %}

    {% if ancestors %}
    Ancestors:
    {{ ancestors }}
    {% endif %}

    {{ ctx.output_format }}
  "#
}

function GeneratePlaywrightCode(procedure_name: string, procedure_steps: Step_[]) -> string {
  client "anthropic/claude-3-5-sonnet-20240620"
  prompt #"
    Given a list of steps for a procedure for automation actions in a web browser, 
    complete the python function below.

    Procedure Steps: 
    {{ procedure_steps }}

    Make sure to provide your response as a markdown code block and start your response as follows:
    ```python
    from playwright.sync_api import Page
    from finic import Finic

    @Finic.procedure
    def {{ procedure_name }}(page: Page):

    {{ ctx.output_format }}
  "#
}