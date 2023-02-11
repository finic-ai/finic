class MessageParser {
  actionProvider: any;
  state: any;
  
  constructor(actionProvider: any, state: any) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message: string) {
    this.actionProvider.reply(message, this.state.dialogue, this.state.conversationId, this.state.setDialogue)
  }
}

export default MessageParser;
