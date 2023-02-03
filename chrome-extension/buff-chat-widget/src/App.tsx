import React, {useState} from 'react';
import {
  ChakraProvider,
  Container,
  Box,
  theme,
  Icon,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody
} from '@chakra-ui/react';
import { createChatBotMessage } from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';
import Chatbot from "react-chatbot-kit";
import "./styles.css";

class MessageParser {
  actionProvider: any
  state: any

  constructor(actionProvider: any, state: any) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message: string) {
    console.log(message)
    this.actionProvider.reply(message)
  }
}

class ActionProvider {
  createChatBotMessage: any
  setState: any
  createClientMessage: any
  stateRef: any
  createCustomMessage: any

  constructor(
   createChatBotMessage: any,
   setStateFunc: any,
   createClientMessage: any,
   stateRef: any,
   createCustomMessage: any,
   ...rest: any
 ) {
   this.createChatBotMessage = createChatBotMessage;
   this.setState = setStateFunc;
   this.createClientMessage = createClientMessage;
   this.stateRef = stateRef;
   this.createCustomMessage = createCustomMessage;
 }

 async reply(userMessage: string) {
  const aiMessage = await fetch('https://freshbot-ezml2kwdva-uc.a.run.app', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "last_message": userMessage, "conversation_transcript": "" })
  })
  const aiJson = await aiMessage.json()
  var response = aiJson.response ?? "Sorry, I'm unable to answer questions right now. Please try again later."

  const botMessage = this.createChatBotMessage(response)
  this.addMessageToState(botMessage)
 }

 addMessageToState(message: string) {
  this.setState((prevState: any) => ({...prevState, messages: [...prevState.messages, message]}))
 }

}

const config = {
  initialMessages: [createChatBotMessage(`Hello, how can I help you today?`, {})],
  botName: 'Buffbot'
}

function App() {
  const [chatOpen, setChatOpen] = useState(false)

  const btnRef = React.useRef(null)

  function closeDrawer () {
    console.log('blur')
    setChatOpen(false)
  }

  return (
    <ChakraProvider theme={theme}>
      <Box fontSize='unset'>
        <Drawer isOpen={chatOpen} placement='right' onClose={closeDrawer} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody padding={0}>
              <Chatbot 
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Box padding={0} width='initial' display='flex' justifyContent='center' position='fixed' right='0px' bottom='50vh' zIndex={9999} boxShadow='5px 5px 13px rgba(91, 81, 81, 0.4)' borderRadius='5px'>
          {chatOpen ? 
            null
          : <IconButton size={'lg'} colorScheme={'blue'} aria-label='Toggle chat' onClick={() => setChatOpen(!chatOpen)}>
              <Icon viewBox="0 0 640 512">
                <path fill='white' d="M192 408h64v-48h-64zm384-216h-32a96 96 0 00-96-96H344V24a24 24 0 00-48 0v72H192a96 96 0 00-96 96H64a48 48 0 00-48 48v128a48 48 0 0048 48h32a96 96 0 0096 96h256a96 96 0 0096-96h32a48 48 0 0048-48V240a48 48 0 00-48-48zM96 368H64V240h32zm400 48a48.14 48.14 0 01-48 48H192a48.14 48.14 0 01-48-48V192a48 48 0 0148-48h256a48 48 0 0148 48zm80-48h-32V240h32zM240 208a48 48 0 1048 48 47.996 47.996 0 00-48-48zm160 0a48 48 0 1048 48 47.996 47.996 0 00-48-48zm-16 200h64v-48h-64zm-96 0h64v-48h-64z"></path>
              </Icon>
            </IconButton>
          }
        </Box>  
      </Box>
    </ChakraProvider>
  );
}

export default App;
