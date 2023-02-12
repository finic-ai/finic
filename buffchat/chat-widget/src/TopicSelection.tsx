import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

function TopicSelection({actionProvider, topics, topic}: {actionProvider: any, topics: string[], topic: string}) {
  
  return (
    <Box>
      {topic.length < 1 && <ButtonGroup gap={2}>
        <Wrap>
        {topics.map((topic: string) => 
          <WrapItem key={topic}>
            <Button colorScheme='gray' size='sm' key={topic} onClick={() => actionProvider.acknowledgeTopic(topic)}>{topic}</Button>
          </WrapItem>)}
        </Wrap>
      </ButtonGroup>}
    </Box>
  );
}

export default TopicSelection;
