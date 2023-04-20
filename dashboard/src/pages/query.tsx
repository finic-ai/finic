/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Spinner,
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState, useRef, useEffect } from "react";
  import {
    HiHome,
    
  } from "react-icons/hi";
  import {
    FaRobot,
    FaUser
  } from "react-icons/fa"
import { useUserStateContext } from "../context/UserStateContext";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
  
  const QueryPage: FC = function () {
    
    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <Breadcrumb className="mb-4">
                <Breadcrumb.Item href="/">
                  <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span className="dark:text-white">Home</span>
                  </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Query</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Query
              </h1>
            </div>
          </div>
        </div>

        <ProductsTable /> 
      </NavbarSidebarLayout>
      
    );
  };

  export default QueryPage;


  
  const ProductsTable: FC = function () {
    const {bearer} = useUserStateContext()

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<Array<MessageProps>>([
      { message: {
        answer: 'Hello, how can I help you today?', 
        sources: []}, isUser: false },
    ]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getBotResponse = async (message: string) => {
      // send a post request to https://sidekick-server-ezml2kwdva-uc.a.run.app/ with the message
      const response = await fetch('https://sidekick-server-ezml2kwdva-uc.a.run.app/ask-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearer}`
        },
        body: JSON.stringify({
          "queries": [
            {
              "query": message,
              "top_k": 5
            }
          ],
          "possible_intents": [
            {
              "name": "question",
              "description": "user is asking a question"
            }
          ]
        })
      })
      const data = await response.json()
      console.log(data)
      const answer = data.results[0].answer
      const sources = data.results[0].results

      for (var i = 0; i < sources.length; i++) {
        const placeHolder = `Content${i}`
        // replace the placeholder with the source title
        answer.replace(placeHolder, sources[i].title)
      }

      var dedupedSources = sources.filter((source: any, index: number) => {
        return index === sources.findIndex((obj: any) => {
          return obj.title === source.title && obj.url === source.url
        })
      })
      var finalResponse = {
        answer,
        sources: dedupedSources
      }

      setMessages((prevMessages) => [...prevMessages, { message: finalResponse, isUser: false }])
    }


  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Message sent:', input);
    setInput('');
    setMessages((prevMessages) => [...prevMessages, { message: {answer: input, sources: []}, isUser: true }])
    setLoading(true);
    await getBotResponse(input);
    setLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



    return (
      <>
      <div className="h-[500px] w-full bg-gray-200 overflow-y-auto ">
        {messages.map((message, index) => (
          <Message key={index} message={message.message} isUser={message.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            disabled={loading}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Type your message"
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-4 py-2 px-6 bg-blue-500 text-white rounded-lg focus:outline-none focus:bg-blue-600"
          >
            {
              loading ? <Spinner size="sm" /> : <div>Send</div>
            }
            
          </button>
        </div>
      </form>
    </>
    );
  };

  interface MessageProps {
    message: any;
    isUser: boolean;
  }

  const Message: React.FC<MessageProps> = ({ message, isUser }) => (
    <div
      className={`flex items-center px-2 py-8 min-h-50  ${
        isUser ? 'bg-white' : 'bg-gray-200'
      }`}
    >
      <div className={`flex items-center justify-center h-10 w-10 mx-4`}>
      {isUser ? <FaUser size="1.5em" /> : <FaRobot size="1.5em" />}
    </div>
      <div className="mx-4">
        <div>
          {message.answer}
        </div>
        <div> </div >
        {
          message.sources.map((source: any, index: any) => (
            <div className=" flex">
              <p className="mr-2">{index + 1}.</p>
              <a target="_blank" className="underline text-blue-500" href={source.url}>{source.title}</a>
            </div>
          ))
        }
      </div>
    </div>
  );
  
    