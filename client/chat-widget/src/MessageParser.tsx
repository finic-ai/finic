class MessageParser {
  actionProvider: any;
  state: any;
  
  constructor(actionProvider: any, state: any) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message: string) {
    // Do nothing if user message is empty
    if (message.length < 1) {
      return
    }
    this.actionProvider.reply(message, this.state.dialogue, this.state.conversationId, this.state.setDialogue)
  }
}

export default MessageParser;
