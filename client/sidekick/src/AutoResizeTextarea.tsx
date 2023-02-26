import * as React from "react"
import {useState, useEffect} from "react"
import ResizeTextarea from "react-textarea-autosize"

import examples from "./examplePlaceholders.json"

import {
  Textarea
} from "@chakra-ui/react"

export const AutoResizeTextarea = React.forwardRef((props: any, ref: any) => {
    const [currentPlaceholder, setCurrentPlaceholder] = React.useState("JSON is not being copied on incremental sync")
    const [placeholderIndex, setPlaceholderIndex] = React.useState(0)
    // const [placeholders, setPlaceholders] = React.useState(new Array<string>)
    const [placeholders, setPlaceholders] = React.useState([
        "Appsmith is crashing while querying snowflake, on K8 using Helm",
        "How do I connect PostgreSQL as a datasource?"
    ])
    const [partialPlaceholder, setPartialPlaceholder] = React.useState("")
    const [generateText, setGenerateText] = React.useState(true)

    const getPlaceholders = (product: string) => {
        const placeholdersForProduct = examples[product as keyof typeof examples]
        if (placeholdersForProduct) {
            setPlaceholders(placeholdersForProduct)
            return
        }
        setPlaceholders([])
    }

    useEffect(() => {
        async function updatePlaceholder() {
            if (partialPlaceholder.length == currentPlaceholder.length) {
                // If the placeholder is full, add a delay, reset the 
                // placeholder to empty, and cycle to the next placeholder
                // await new Promise(r => setTimeout(r, 2000))
                const newIndex = (placeholderIndex + 1) % placeholders.length
                await new Promise(r => setTimeout(r, 1000))
                setPartialPlaceholder("")
                setCurrentPlaceholder(placeholders[newIndex])
                setPlaceholderIndex(newIndex)
            } else {
                // If the placeholder is not full, add a character
                await new Promise(r => setTimeout(r, 50))
                await setPartialPlaceholder(partialPlaceholder + currentPlaceholder.charAt(partialPlaceholder.length))
            }
        }
        updatePlaceholder()
    })

    return (
      <Textarea
        minH="unset"
        overflow="hidden"
        w="100%"
        resize="none"
        ref={ref}
        minRows={1}
        as={ResizeTextarea}
        placeholder={partialPlaceholder}
        key={partialPlaceholder}
        {...props}
      />
    );
  });