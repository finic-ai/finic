import * as React from "react"
import { useState, useEffect, useRef } from "react"

import {
  ChakraProvider,
  Box,
  Text,
  Button,
  Icon,
  Heading,
  useColorModeValue,
  Flex,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { AutoResizeTextarea } from "./AutoResizeTextarea"
import { Sidebar } from "./Sidebar"
import {DiGithubBadge} from "react-icons/di"

import Products from "./products.json"

import utils from "./utils"

const sidekick = utils()

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
  const [product, setProduct] = React.useState(Products[0])
  const [placeholders, setPlaceholders] = React.useState(Products[0].placeholders)
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
      setPlaceholders(product.placeholders)
    }
  }, [messages, product])

  const handleProductChange = (event: any) => {
    setInteracted(true)
    setInput("")
    setPartialPlaceholder("")
    setProduct(Products[event.target.selectedIndex])
    setMessages(new Array<Message>)
    setPlaceholders(product.placeholders)
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
    const userMessage = event.target.value
    setMessages([...messages, {message: userMessage, fromBot: false}])
    
    setIsWaiting(true)
    setInput("Searching through documentation...")

    // const reply = await sidekick.getMockResponse("Q&A")
    const response = await sidekick.sendMessage({
      message: event.target.value,
      conversation: messages,
      productId: product.id
    })
    const reply = (await response.json())
    
    setInput("")
    setIsWaiting (false)
    setLogs([...logs, reply.response])
    setMessages([...messages, {message: userMessage, fromBot: false}, {message: reply.response, fromBot: true}])
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
  const bgColor = useColorModeValue("blue.50", "blue.800")
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
            <Text>AMA about open source projects. Q&A, troubleshooting, and more.</Text>
            <Button onClick={() => window.open("https://github.com/getbuff/Buff", "_blank")} leftIcon={<Icon boxSize={6} as={DiGithubBadge}/>} position="fixed" p={2} right="12px" size="s" variant="ghost">View Source</Button>
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
