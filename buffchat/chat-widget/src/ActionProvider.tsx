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
    
    const aiJson = await aiMessage.json()
    var response = aiJson.response ?? "\nSorry, I'm unable to answer questions right now. Please try again later."

    let newDialogue = new Array<String>()
    newDialogue.push(`<|im_start|>user\n${userMessage}<|im_end|>`)
    newDialogue.push(`<|im_start|>assistant${response}<|im_end|>`)

    this.setState((prevState: any) => ({...prevState, dialogue: [...prevState.dialogue, ...newDialogue]}))

    const botMessage = this.createChatBotMessage(response)
    this.addMessageToState(botMessage)
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