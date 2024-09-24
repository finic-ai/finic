class GenerateSelectorsOutput {
  selector_string string
  confidence float
}

class BamlTag {
  user_assigned_id string
  html string
}

// Generate a selector for a given HTML element.
function GenerateSelectorsOpenAI(tag: BamlTag, html_context: string, mode: string) -> GenerateSelectorsOutput {
  client "GPT4o"
  prompt #"
    Generate a {{mode}} selector based on the provided HTML tag and the HTML surrounding it. We want the selector to be stable and not change between sessions, and to generalize across versions of this page with different content (e.g. profiles). 
    Try to use attributes that identify structural elements of the page rather than specific values that might be different for different urls. When possible, use text labels near the target element as identifiers.

    Relevant Tag:
    {{ tag }}
    
    HTML Context: 
    {{ html_context }}

    {{ ctx.output_format }}
  "#
}

function GenerateSelectorsAnthropic(tag: BamlTag, html_context: string, mode: string) -> GenerateSelectorsOutput {
  client "Sonnet"
  prompt #"
    Generate a {{mode}} selector based on the provided HTML tag and the HTML surrounding it. We want the selector to be stable and not change between sessions, and to generalize across versions of this page with different content (e.g. profiles). 
    Try to use attributes that identify structural elements of the page rather than specific values that might be different for different urls. When possible, use text labels near the target element as identifiers.

    Relevant Tag:
    {{ tag }}
    
    HTML Context: 
    {{ html_context }}

    {{ ctx.output_format }}
  "#
}