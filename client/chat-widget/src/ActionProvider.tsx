class ActionProvider {
  createChatBotMessage: any;
  setState: any;
  createClientMessage: any;
  stateRef: any;

  constructor(createChatBotMessage: any, setStateFunc: any, createClientMessage: any, stateRef: any) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
  }

  async reply(userMessage: string) {
    const url = process.env.REACT_APP_API_URL
    const payload = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "last_message": userMessage,
        "conversation_transcript": this.stateRef.dialogue,
        "conversation_id": this.stateRef.conversationId,
        "site_id": process.env.REACT_APP_SITE_ID,
        "metadata_filter": this.stateRef.topic
      })
    }
    const aiMessage = await fetch(url!, payload)

    console.log(
      {
        "last_message": userMessage,
        "conversation_transcript": this.stateRef.dialogue,
        "conversation_id": this.stateRef.conversationId,
        "site_id": process.env.REACT_APP_SITE_ID,
        "metadata_filter": this.stateRef.topic
      }
    )
    
    const aiJson = await aiMessage.json()
    let response = aiJson.response ?? "\nSorry, I'm unable to answer questions right now. Please try again later."

    // Update state
    let newDialogue = new Array<String>()
    newDialogue.push(`<|im_start|>user\n${userMessage}<|im_end|>`)
    newDialogue.push(`<|im_start|>assistant${response}<|im_end|>`)

    this.setState((prevState: any) => ({...prevState, dialogue: [...prevState.dialogue, ...newDialogue]}))

    // Split the response into multiple messages if it's too long
    let splitResponse = response.split('\n\n')

    for (let chunk of splitResponse) {
      if (chunk.length > 0) {
        if (chunk.startsWith('Learn more') && chunk.includes('N/A')) {
          continue
        }
        const botMessage = this.createChatBotMessage(chunk, {withAvatar: true})
        this.addMessageToState(botMessage)
        await new Promise(resolve => setTimeout(resolve, 1200))
      }
    }
  }

  async acknowledgeTopic(topic: string) {
    const botMessage = this.createChatBotMessage('Ok, lets talk about ' + topic + '. How can I help?')
    this.setState((prevState: any) => ({...prevState, topic: topic}))
    this.addMessageToState(botMessage)
  }

  async addMessageToState(message: string) {
    this.setState((prevState: any) => ({...prevState, messages: [...prevState.messages, message]}))
  }
}

export default ActionProvider;