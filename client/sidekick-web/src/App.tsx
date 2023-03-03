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
  useToast,
  useBreakpointValue,
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
  message: string | undefined,
  fromBot: boolean
}

interface Logs {
  message: string | undefined,
  intent: string | undefined,
  sources: string[]
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

  const toast = useToast()

  // Light/Dark mode styling
  const bgColor = useColorModeValue("blue.50", "blue.800")
  const textAreaBgColor = useColorModeValue("whiteAlpha.800", "grayAlpha.800")
  const botMessageBgColor = useColorModeValue("gray.100", "gray.700")
  const userMessageBgColor = useColorModeValue("white", "black")
  const linkColor = useColorModeValue("blue", "#BEE3F8")

  // Mobile styling
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    if (product) {
      setPlaceholders(product.placeholders)
    }
    const searchParams = new URLSearchParams(window.location.search)
    const productId = searchParams.get('product')
    if (productId && productId != product.id) {
      handleProductChange({target: {selectedIndex: Products.findIndex((product) => product.id == productId) + 1}})
    }
  })

  const handleProductChange = (event: any) => {
    setInteracted(true)
    setInput("")
    setPartialPlaceholder("")
    setProduct(Products[event.target.selectedIndex - 1])
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
      productId: product.id,
      linkColor: linkColor,
    })

    if (response.error || !response.intent) {
      setInput("")
      setIsWaiting (false)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later, or email us at founders@getsidekick.ai",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return
    }
    
    setInput("")
    setIsWaiting (false)
    setLogs([{message: response.answer, intent: response.intent, sources: response.sources}, ...logs])
    setMessages([...messages, {message: userMessage, fromBot: false}, {message: response.answer, fromBot: true}])
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
  
  return (
    <Flex fontSize="l">
      <Flex direction={isMobile ? "column" : "row"} width="100%" height={isMobile ? "100vh" : "90vh"} justifyContent="space-between">
        {isMobile ? null : <Sidebar product={product} products={Products} handleProductChange={handleProductChange} logs={logs}/>}
        <Flex direction="column" height={isMobile ? "inherit" : "100vh"} width="inherit" overflow="auto" justifyContent="space-between" alignItems="center" backgroundColor={bgColor}>
          <Flex height="auto" padding="12px" direction="column" alignItems="center">
            <Flex direction="row"><Heading>Sidekick</Heading><ColorModeSwitcher justifySelf="flex-end" /></Flex>
            <Text>Search the docs with ChatGPT 📖🤖</Text>
            {isMobile ? null : <Text as="b" position="fixed" left="312px" top="18px">{"<---Choose your product"}</Text>}
            <Button onClick={() => window.open("https://github.com/ai-sidekick/sidekick/tree/main/client/sidekick-web", "_blank")} leftIcon={<Icon boxSize={6} as={DiGithubBadge}/>} position="fixed" p={2} right="12px" size="s" variant="ghost">{isMobile ? null : "View Source"}</Button>
            {isMobile ? <Sidebar product={product} products={Products} handleProductChange={handleProductChange} logs={logs}/> : null}
          </Flex>
          <Flex width="100%" ref={messagesRef} direction="column" p={4} justifyContent="center" minHeight={isMobile ? "200px" : "400px"} overflowY="auto">
            {messages.map((message, index) => (
              <Box key={index} p={4} bg={message.fromBot ? botMessageBgColor : userMessageBgColor}>
                {message.fromBot ? <Text dangerouslySetInnerHTML={{ __html: message.message!}} whiteSpace="pre-wrap"/> : <Text whiteSpace="pre-wrap">{message.message}</Text>}
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
