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
import { Chatbot, useChatbot} from "react-chatbot-kit";
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import "./styles.css";

import TopicSelection from './TopicSelection';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';

function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [dialogue, setDialogue] = useState(new Array<string>)
  const [conversationId, setConversationId] = useLocalStorage('conversationId', uuidv4())
  const [chatTopic, setChatTopic] = useState('')

  const btnRef = React.useRef(null)
  const topics = process.env.REACT_APP_TOPICS?.split(',') ?? []
  const initialMessage = topics ? 'Hi, what would you like to talk about?' : 'Hi, how can I help you today?'

  function closeDrawer () {
    setChatOpen(false)
  }

  const chatbotConfig = {
    initialMessages: [createChatBotMessage(initialMessage, {widget: 'TopicSelection'})],
    botName: 'Buffbot',
    state: {topic: chatTopic, dialogue: dialogue, conversationId: conversationId},
    widgets: [
      {
        widgetName: 'TopicSelection',
        widgetFunc: (props: any) => <TopicSelection {...props} />,
        props: {topics},
        mapStateToProps: ['topic'],
      },
    ]
  }

  return (
    <ChakraProvider theme={theme}>
      <Box fontSize='unset'>
        <Drawer isOpen={chatOpen} placement='right' onClose={closeDrawer} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody padding={0}>
              <Chatbot 
                config={chatbotConfig}
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
