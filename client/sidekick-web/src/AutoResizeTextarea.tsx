import * as React from "react"
import {useState, useEffect} from "react"
import ResizeTextarea from "react-textarea-autosize"

import {
  forwardRef,
  Textarea
} from "@chakra-ui/react"


export const AutoResizeTextarea = forwardRef(<HTMLTextAreaElement, AutoResizeTextareaProps>(props: any, ref: any) => {
  
  const {interacted, 
    placeholders, 
    placeholderIndex, 
    setPlaceholderIndex, 
    isWaiting,
    partialPlaceholder, 
    setPartialPlaceholder, 
    product, ...rest} = props

  useEffect(() => {
    async function updatePlaceholder() {
      if (placeholders && interacted == false && !isWaiting) {
        if (partialPlaceholder.length == placeholders[placeholderIndex].length) {
          // If the placeholder is full, add a delay, reset the 
          // placeholder to empty, and cycle to the next placeholder
          // await new Promise(r => setTimeout(r, 2000))
          const newIndex = (placeholderIndex + 1) % placeholders.length
          await new Promise(r => setTimeout(r, 1000))
          setPartialPlaceholder("")
          setPlaceholderIndex(newIndex)
        } else {
          // If the placeholder is not full, add a character
          await new Promise(r => setTimeout(r, 50))
          setPartialPlaceholder(partialPlaceholder + placeholders[placeholderIndex].charAt(partialPlaceholder.length))
        }
      }
    }
    if (interacted) {
      ref.current.focus()
      setPartialPlaceholder("")
    } else {
      updatePlaceholder()
    }
  }, [interacted, isWaiting, partialPlaceholder])

  return (
    <Textarea
    ref={ref}
    minH="unset"
    overflow="hidden"
    w="100%"
    resize="none"
    minRows={1}
    as={ResizeTextarea}
    placeholder={partialPlaceholder}
    key={partialPlaceholder}
    {...rest}
    />
  );
  });