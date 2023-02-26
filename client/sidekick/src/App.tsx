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

import utils from "./utils"

const u = utils()
const Products = ["AppSmith", "PostHog", "Airbyte", "Supabase", "Redis", "Tensorflow", "Apollo GraphQL", "Electron", "D3", "ToolJet", "BentoML", "Snowplow", "Qdrant", "Ethyca", "MindsDB", "Forem", "QuestDB", "Prometheus"]

export const App = () => {
  const [input, setInput] = React.useState("")
  const [product, setProduct] = React.useState("")
  const [messages, setMessages] = React.useState(new Array<string>)
  const [interacted, setInteracted] = React.useState(false)

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event: any) => {
    setInput(event.target.value)
    setInteracted(true)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setMessages([...messages, event.target.value])
    const response = await u.getMockResponse("Q&A")
    setMessages([...messages, event.target.value, response.message!])
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
            <Select placeholder="Select product" value={product} onChange={(event) => setProduct(event.target.value)}>
              {Products.map((product, index) => <option value={product}>{product}</option>)}
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
                <Box key={index} p={4} m={2} bg={index % 2 === 0 ? "white" : "gray.200"} borderRadius="lg">
                  <Text>{message}</Text>
                </Box>
                )
              )}
            </Flex>
            <Box width="-webkit-fill-available" padding="2px" paddingBottom="24px" justifySelf="center" backgroundColor="whiteAlpha.800">
              <AutoResizeTextarea maxRows={16} value={input} onKeyDown={handleOnKeyDown} onChange={handleInputChange} size="lg"/>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
)}
