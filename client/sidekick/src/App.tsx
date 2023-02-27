import * as React from "react"
import { useState, useEffect, useRef } from "react"

import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  useColorModeValue,
  Flex,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { AutoResizeTextarea } from "./AutoResizeTextarea"
import { Sidebar } from "./Sidebar"

import examples from "./examplePlaceholders.json"

import utils from "./utils"

const sidekick = utils()
const Products = ["AppSmith", "PostHog", "Airbyte", "Supabase", "Redis", "Tensorflow", "Apollo GraphQL", "Electron", "D3", "ToolJet", "BentoML", "Snowplow", "Qdrant", "Ethyca", "MindsDB", "Forem", "QuestDB", "Prometheus"]

interface Message {
  message: string,
  fromBot: boolean
}

interface Logs {
  message: string,
  intent: string,
  confidence: number
}

export const App = () => {
  const [input, setInput] = React.useState("")
  const [product, setProduct] = React.useState("")
  const [placeholders, setPlaceholders] = React.useState(examples["AppSmith"])
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0)
  const [partialPlaceholder, setPartialPlaceholder] = React.useState("")
  const [messages, setMessages] = React.useState(new Array<Message>)
  const [interacted, setInteracted] = React.useState(false)
  const [isWaiting, setIsWaiting] = React.useState(false)
  const [logs, setLogs] = React.useState(new Array<Logs>)

  const messagesRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    if (product) {
      setPlaceholders(examples[product as keyof typeof examples])
    }
  }, [messages, product])

  const handleProductChange = (event: any) => {
    setInteracted(true)
    setInput("")
    setPartialPlaceholder("")
    setProduct(event.target.value)
    setMessages(new Array<Message>)
    setPlaceholders(examples[product as keyof typeof examples])
    setPlaceholderIndex(0)
    setIsWaiting(false)
  }

  const handleFocus = (event: any) => {
    setInteracted(true)
  }

  const handleBlur = (event: any) => {
    if (input == "") {
      setInteracted(false)
    }
  }

  const handleInputChange = (event: any) => {
    setInput(event.target.value)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (isWaiting) {
      return
    }
    setMessages([...messages, {message: event.target.value, fromBot: false}])
    // const response = await sidekick.sendMessage({
    //   message: event.target.value,
    //   dialogue: messages
    // })
    // const reply = (await response.json())
    setIsWaiting(true)
    const reply = await sidekick.getMockResponse("Q&A")
    setInput("")
    setIsWaiting (false)
    setLogs([...logs, reply.response])
    setMessages([...messages, {message: event.target.value, fromBot: false}, {message: reply.response.message!, fromBot: true}])
  }

  const handleOnKeyDown = (event: any) => {
    if (event.shiftKey && event.key === "Enter") {
      event.preventDefault()
      setInput(input + "\n")
      return
    }
    if (event.key === "Enter") {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  // Dark mode styling
  const bgColor = useColorModeValue("blue.100", "blue.800")
  const textAreaBgColor = useColorModeValue("whiteAlpha.800", "grayAlpha.800")
  const botMessageBgColor = useColorModeValue("gray.100", "gray.700")
  const userMessageBgColor = useColorModeValue("white", "black")
  
  return (
    <Flex fontSize="l">
      <Flex direction="row" width="100%" height="90vh" justifyContent="space-between">
        <Sidebar product={product} products={Products} handleProductChange={handleProductChange} logs={logs}/>
        <Flex direction="column" height="100vh" width="inherit" overflow="auto" justifyContent="space-between" alignItems="center" backgroundColor={bgColor}>
          <Flex height="100px" padding="12px" direction="column" alignItems="center">
            <Flex direction="row"><Heading>Sidekick</Heading><ColorModeSwitcher justifySelf="flex-end" /></Flex>
            <Text>AMA for open source projects. Q&A, troubleshooting, how-to guides and more.</Text>
          </Flex>
          <Flex width="100%" ref={messagesRef} direction="column" p={4} justifyContent="center" minHeight="400px" overflowY="auto">
            {messages.map((message, index) => (
              <Box key={index} p={4} bg={message.fromBot ? botMessageBgColor : userMessageBgColor}>
                {message.fromBot ? <Text dangerouslySetInnerHTML={{ __html: message.message}} whiteSpace="pre-wrap"/> : <Text whiteSpace="pre-wrap">{message.message}</Text>}
              </Box>
              )
            )}
          </Flex>
          <Box width="-webkit-fill-available" padding="2px" paddingBottom="24px" justifySelf="center" backgroundColor={textAreaBgColor}>
            <AutoResizeTextarea 
              ref={textAreaRef}
              disabled={isWaiting}
              interacted={interacted} 
              placeholders={placeholders} 
              isWaiting={isWaiting}
              placeholderIndex={placeholderIndex} 
              setPlaceholderIndex={setPlaceholderIndex}
              partialPlaceholder={partialPlaceholder}
              setPartialPlaceholder={setPartialPlaceholder}
              product={product} 
              maxRows={16} 
              value={input} 
              onKeyDown={handleOnKeyDown} 
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleInputChange} 
              size="lg"/>
          </Box>
        </Flex>
      </Flex>
    </Flex>
)}
