import React, {useState} from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Heading,
  Input,
  theme,
  Button,
  Icon,
  IconButton,
  HStack
} from '@chakra-ui/react';
import { createChatBotMessage } from "react-chatbot-kit";
import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';
import "./styles.css";

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    console.log(message)
    this.actionProvider.reply(message)
  }
}

class ActionProvider {
  constructor(
   createChatBotMessage,
   setStateFunc,
   createClientMessage,
   stateRef,
   createCustomMessage,
   ...rest
 ) {
   this.createChatBotMessage = createChatBotMessage;
   this.setState = setStateFunc;
   this.createClientMessage = createClientMessage;
   this.stateRef = stateRef;
   this.createCustomMessage = createCustomMessage;
 }

 async reply(userMessage) {
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

 addMessageToState(message) {
  this.setState(prevState => ({...prevState, messages: [...prevState.messages, message]}))
 }
}

const config = {
  initialMessages: [createChatBotMessage(`Hello, how can I help you today?`)]
}

function App() {

  const [chatOpen, setChatOpen] = useState(false)
  const [docsUrl, setDocsUrl] = useState('')
  const [docsSyncing, setDocsSyncing] = useState(false)
  const [docsSynced, setDocsSynced] = useState(false)

  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function syncDocs() {
    setDocsSyncing(true)
    await delay(3000)
    setDocsSyncing(false)
    setDocsSynced(true)
  }

  return (
    <ChakraProvider theme={theme}>
      <div className="App">
          <Box margin={10}>
            <Heading size='sm'>Link your docs</Heading>
            <HStack width='50%'>
              <Input 
                value={docsUrl}
                onChange={e => setDocsUrl(e.currentTarget.value)}
              />
              <Button colorScheme={'blue'} isLoading={docsSyncing} onClick={() => syncDocs()}>
                Sync
              </Button>
            </HStack>
          </Box>
        <div className="app-chatbot-container">
          {docsSynced ? 
            <>
              {chatOpen ? 
                <Chatbot 
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
              : <IconButton size={'lg'} colorScheme={'blue'} onClick={() => setChatOpen(!chatOpen)}>
                  <Icon viewBox="0 0 640 512">
                    <path fill='white' d="M192 408h64v-48h-64zm384-216h-32a96 96 0 00-96-96H344V24a24 24 0 00-48 0v72H192a96 96 0 00-96 96H64a48 48 0 00-48 48v128a48 48 0 0048 48h32a96 96 0 0096 96h256a96 96 0 0096-96h32a48 48 0 0048-48V240a48 48 0 00-48-48zM96 368H64V240h32zm400 48a48.14 48.14 0 01-48 48H192a48.14 48.14 0 01-48-48V192a48 48 0 0148-48h256a48 48 0 0148 48zm80-48h-32V240h32zM240 208a48 48 0 1048 48 47.996 47.996 0 00-48-48zm160 0a48 48 0 1048 48 47.996 47.996 0 00-48-48zm-16 200h64v-48h-64zm-96 0h64v-48h-64z"></path>
                  </Icon>
                </IconButton>
              }
            </> : <></>
          }
          
        </div>
      </div>   
    </ChakraProvider>
  );
}

export default App;
