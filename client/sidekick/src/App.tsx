import * as React from "react"
import { useState, useEffect, useRef } from "react"

import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  Image,
  Button,
  ButtonGroup,
  Textarea,
  Link,
  FormControl,
  Select,
  Input,
  Flex,
  Code,
  Grid,
  GridItem,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { AutoResizeTextarea } from "./AutoResizeTextarea"

import examples from "./examplePlaceholders.json"

import utils from "./utils"

const sidekick = utils()
const Products = ["AppSmith", "PostHog", "Airbyte", "Supabase", "Redis", "Tensorflow", "Apollo GraphQL", "Electron", "D3", "ToolJet", "BentoML", "Snowplow", "Qdrant", "Ethyca", "MindsDB", "Forem", "QuestDB", "Prometheus"]

interface Message {
  message: string,
  fromBot: boolean
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

  const messagesRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLDivElement>(null)

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
    setIsWaiting (false)
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
  
  return (
    <ChakraProvider theme={theme}>
      <Flex fontSize="l">
        <Flex direction="row" width="100%" height="90vh" justifyContent="space-between">
          <Box p="12px" left="0px" minWidth="200px" height="100%" display="flex" flexDirection="column" justifyContent="flex-start">
            <Select placeholder="Select product" value={product} onChange={handleProductChange}>
              {Products.map((product, index) => <option key={product} value={product}>{product}</option>)}
            </Select>
            <Text position="fixed" bottom="36px" as="b">{"Ask here --->"}</Text>
          </Box>
          <Flex direction="column" height="100vh" width="inherit" overflow="auto" justifyContent="space-between" alignItems="center" backgroundColor="blue.100">
            <Flex height="100px" padding="12px" direction="column" alignItems="center">
              <Flex direction="row"><Heading>Sidekick</Heading><ColorModeSwitcher justifySelf="flex-end" /></Flex>
              <Text>AMA for open source projects. Q&A, troubleshooting, how-to guides and more.</Text>
            </Flex>
            <Flex ref={messagesRef} direction="column" p={10} justifyContent="center" minHeight="400px" overflowY="auto">
              {messages.map((message, index) => (
                <Box key={index} p={4} m={2} bg={message.fromBot ? "gray.200" : "white"} borderRadius="lg">
                  <Text>{message.message}</Text>
                </Box>
                )
              )}
            </Flex>
            <Box width="-webkit-fill-available" padding="2px" paddingBottom="24px" justifySelf="center" backgroundColor="whiteAlpha.800">
              <AutoResizeTextarea 
                ref={textAreaRef}
                disabled={isWaiting}
                interacted={interacted} 
                placeholders={placeholders} 
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
    </ChakraProvider>
)}
