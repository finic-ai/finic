import React, {useState} from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  Button,
  Input,
  theme,
  Heading,
  Container,
  Spinner,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Modal,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [query, setQuery] = useState('')
  const [slackApiKey, setSlackApiKey] = useState('')
  const [syncLoading, setSyncLoading] = useState(false)
  const [queryLoading, setQueryLoading] = useState(false)
  const [results, setResults] = useState([])

  async function sync() {
    setSyncLoading(true)
    await fetch(
      'https://sync-data-ezml2kwdva-uc.a.run.app',
      {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              slack_bot_token: slackApiKey
          })
      }
    )
    setSyncLoading(false)
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (query) {
      setResults([])
      setQueryLoading(true)

      const result = await fetch(
        'https://query-workspace-ezml2kwdva-uc.a.run.app',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query
            })
        }
      ) 

      const resultJson = await result.json()
      const matches = JSON.parse(resultJson.results).matches

      setResults(matches)
      setQueryLoading(false)
      

    }
    
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
          <Box display="flex" alignItems="center" padding="10px" borderBottom="1px solid lightgrey">
              <Link href="https://www.withsleuth.xyz/"><Text>Sleuth</Text></Link>
          </Box>
          <Box marginY={10}>
            <Heading 
              size='2xl' 
              textAlign={'center'}>
              Sleuth
            </Heading>
            <form onSubmit={handleSubmit}>
              <Input 
                width='50%'
                value={query}
                onChange={e => setQuery(e.target.value)}
                marginY={5} />
            </form>
            <Button onClick={onOpen} isLoading={syncLoading}>
              Sync Workspace
            </Button>
          </Box>
          {queryLoading ? <Spinner /> : <ResultItems results={results} />}
          <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Sync Workspace</ModalHeader>
              <ModalBody>
                <Text fontWeight={'semibold'}>Slack API key</Text>
                <Input 
                  value={slackApiKey}
                  onChange={e => setSlackApiKey(e.target.value)} />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='teal' isLoading={syncLoading} onClick={sync} mr={3}>
                  Submit
                </Button>
                <Button variant='ghost' onClick={() => {
                  onClose()
                }}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
      </Box>
    </ChakraProvider>
  );
}

function ResultItems({results}) {
  return (
    <>
      {results.map((result) => (
        <Container px={10} py={6} width="50%" border="1px solid #E2E8F0" textAlign={'start'} key={result.id}>
          <Text>{result.metadata.text}</Text>
        </Container>
      ))}  
    </>
  )
}

export default App;
