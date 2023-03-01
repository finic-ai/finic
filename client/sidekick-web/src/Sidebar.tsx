import * as React from "react"
import { useState, useEffect, useRef } from "react"

import {
  Box,
  Text,
  Select,
  useBreakpointValue
} from "@chakra-ui/react"

interface Product {
  id: string,
  label: string,
  placeholders: string[]
}


export const Sidebar = (props: any) => {

  const {product, handleProductChange, products, logs, ...rest} = props

  const isMobile = useBreakpointValue({ base: true, md: false })

  const renderLogs = () => {
    const logString = JSON.stringify(logs, null, 2)
    return <Text textColor="gray.500" whiteSpace="pre-wrap" overflowY="auto" p={4} width="300px">
      {logString}
    </Text>
  }

  return (
    <>
    {isMobile ? 
      <Select mt="8px" placeholder="Select product" value={product.label} onChange={handleProductChange}>
        {products.map((product: Product, index: number) => <option key={index} value={product.label}>{product.label}</option>)}
      </Select> : 
      <Box p="12px" left="0px" minWidth="300px" height="100%" display="flex" flexDirection="column" justifyContent="flex-start">
        <Select placeholder="Select product" value={product.label} onChange={handleProductChange}>
          {products.map((product: Product, index: number) => <option key={index} value={product.label}>{product.label}</option>)}
        </Select>
        <Text as="b" mt={4} mb={4}>Logs</Text>
        {renderLogs()}
        <Text position="fixed" bottom="36px" left="150px" as="b">{"Ask here --->"}</Text>
      </Box>}
    </>
    
)}
