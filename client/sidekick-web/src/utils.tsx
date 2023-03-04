const utils = () => {
  const getMockResponse = async (responseType: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (responseType === "Q&A") {
      return {
        response:{
          intent: "Q&A",
          message: "Yes, you can run load tests on Airbyte running on Kubernetes. To do this, you will need to set up port-forwarding to the airbyte-server deployment using the following command:\r\n\r\n<code>kubectl port-forward deployment\/airbyte-server -n ab 8001:8001<\/code>\r\n\r\nThis will make the Airbyte server available at localhost:8001, and then you can proceed with running the load_test_airbyte.sh shell script as described in the content.\r\n\r\nNote that if your deployment of Airbyte happens to use Google Cloud Endpoints for authentication, you can use the -X option to pass an X-Endpoint-API-UserInfo header value.\r\n\r\nHere is an example command to run the load test on Kubernetes:\r\n\r\n<code>.\/tools\/bin\/load_test\/load_test_airbyte.sh -W <workspace id> -C <num_connections> -H localhost -P 8001 -X <your_endpoints_user_info_header_value><\/code></your_endpoints_user_info_header_value>",
          source:["https://docs.airbyte.io/understanding-airbyte/faq#can-i-run-load-tests-on-airbyte-running-on-kubernetes"],
          confidence: 0.99
        }
      }
    }
    else {
      return {
        response: {
          intent: "Troubleshoot",
          message: "To run a load test, you can use the load_test_airbyte.sh shell script. From your top-level /airbyte directory, run the following command: ./tools/bin/load_test/load_test_airbyte.sh -W <workspace id> -C <num_connections>. Make sure to replace <workspace id> with the ID of the workspace where you want to create the connections, and <num_connections> with the number of connections you want to create. If necessary, you can also use flags to override the default settings",
          sources:["https://docs.airbyte.io/understanding-airbyte/faq#can-i-run-load-tests-on-airbyte-running-on-kubernetes"],
          confidence: 0.57
        }
      }
    }
  }
  
  const sendMessage = async (data: any) => {
    const url = process.env.REACT_APP_API_URL
    const payload = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "last_message": data.message,
        "conversation_transcript": JSON.stringify(data.conversation.map((message: any) => message.fromBot ? "bot: " + message.message : "user: " + message.message)),
        "site_id": process.env.REACT_APP_API_KEY,
        "conversation_id": "82d81783-ac29-4f8c-947f-534ef695e1de",
        "metadata_filter": data.productId
      })
    }
    const response = await (await fetch(url!, payload)).json()
    let finalAnswer = ""

    // If the response contains an error, return the error
    if (response.error) {
      return {error: response.error}
    }
    
    let sources = ""
    for (const source of response.sources) {
      sources += `\n- <a href="${source.url}" target="_blank" style="color: ${data.linkColor}; text-decoration: underline;">${source.title}</a>`
    }

    // If the response does not contain an answer, return a canned response with sources
    if (!response.contains_answer) {
      finalAnswer = `Sorry, I couldn't find an answer to your question.\n\n${response.justification}\n\nHowever you can try looking at these resources that may be relevant:`
      finalAnswer += sources
    } else {
      finalAnswer = `${response.answer}\n\nYou can learn more from these resources:` + sources
    }
    
    // If the response contains an answer, return the answer
    return {answer: finalAnswer, intent: response.intent, sources: response.sources}
  }
  
  return {
    getMockResponse,
    sendMessage,
  }
}

export default utils