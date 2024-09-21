class GenerateSelectorResult {
  id string
  predicted_selector string
  confidence float
}

class Selector {
  id string
  description string
}
// Generate a selector for a given HTML element.
function GenerateSelectors(selectors: Selector[], html: string) -> GenerateSelectorResult[] {
  client "openai/gpt-4o"
  prompt #"
    Generate CSS selectors based on the ID and description of each selector, as well as the HTML content provided.
    Indiciate your level of confidence in each prediction, assuming this is not the entire HTML page the and the relevant element may be in another chunk.
    0.9-1.0 is very confident, 0.5-0.9 is moderately confident, 0.0-0.5 is not confident.

    Selectors: {{ selectors }}
    
    HTML: 
    {{ html }}

    {{ ctx.output_format }}
  "#
}

// Testing the function with a sample resume.
// test vaibhav_resume {
//   functions [ExtractResume]
//   args {
//     resume #"
//       Vaibhav Gupta
//       vbv@boundaryml.com

//       Experience:
//       - Founder at BoundaryML
//       - CV Engineer at Google
//       - CV Engineer at Microsoft

//       Skills:
//       - Rust
//       - C++
//     "#
//   }
// }
