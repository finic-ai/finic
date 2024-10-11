class Step {
  step_number int
  description string
  selector string?
}

class Plan {
  steps Step[]
  name string @description("A unique name for this plan separated by underlines. E.g. 'search-for-flights")
}

function CreatePlan(screenshot: image, instructions: string) -> Plan {
  client "anthropic/claude-3-5-sonnet-20240620"
  prompt #"
    Come up with a detailed, step by step plan for how to perform a browser-based automation task, based on a screenshot
    of a web page and the instructions provided by the user. The plan should describe each element that needs to be interacted
    with and the actions to be taken on each element.

    Examples of steps: 
    - Expand the "Flights" drawer
    - Select the "One-Way" radio button
    - Click the "From" input 
    - Enter the departure airport in the "From" input
  
    
    Current page:
    {{ screenshot }}

    Instructions: {{ instructions }}

    {{ ctx.output_format }}
  "#
}

function ChangePlan(screenshot: image, changes: string, old_plan: Plan) -> Plan {
  client "anthropic/claude-3-5-sonnet-20240620"
  prompt #"
    Given the current plan and proposed changes, come up with a revised plan for how to perform a browser-based automation task.

    Current page:
    {{ screenshot }}

    Current plan:
    {% for step in old_plan.steps %}
    {{ step.step_number }}. {{ step.description }}
    {% endfor %}

    Proposed changes: {{ changes }}

    {{ ctx.output_format }}
  "#
}

function GenerateCode(plan: Plan) -> string {
  client "anthropic/claude-3-5-sonnet-20240620"
  prompt #"
    Generate a python function for automating a web page. Use Playwright, follow the steps in the provided plan, and use the selector provided for each step.
    After any click or input events, call both page.wait_for_load_state("load") and page.wait_for_selector() with the selector of the
    next step to ensure it exists.

    Plan Name: {{{plan.name}}}

    Steps:
    {% for step in plan.steps %}
    {{ step.step_number }}. {{ step.description }} ['{{step.selector}}'']
    {% endfor %}

    The output must be in markdown format with only a python code block, and start with the following code:
    
    ```python
    from playwright.sync_api import Playwright, Page
    from finic-py import Finic

    @Finic.procedure
    def {{plan.name}}(page: Page, finic: Finic):
  "#
}