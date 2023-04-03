from typing import List, Tuple, Dict, Union, Optional, Any
from models.models import (
    QueryResult,
    Intent,
    LLMResult,
    EvaluationResult,
    DocumentChunkWithScore,
)
import openai
import json


class LLM:
    async def ask_llm(self, query_results: List[QueryResult], possible_intents: List[Intent]) -> List[LLMResult]:
        """
        Takes in a list of queries and possible intents and returns a list of query results with matching document chunks and scores.
        """

        llm_results = []

        for query_result in query_results:
            content_refs = self.get_content_refs(query_result.results, 4000)

            evaluation = await self.evaluate(query_result.query, content_refs, possible_intents)

            answer = await self.get_answer(query_result.query, content_refs)

            llm_results.append(LLMResult(
                query=query_result.query, 
                results=query_result.results, 
                intent=evaluation.intent, 
                can_answer=evaluation.content_contains_answer,
                answer=answer
            ))
        return llm_results

    
    def get_content_refs(self, chunks: List[DocumentChunkWithScore], max_characters: int): 
        """
        Takes in a list of document chunks and returns a string of content references
        """
        content_refs = ""
        i = 0
        for chunk in chunks:
            chunk_content = ""
            if chunk.title:
                chunk_content += f"# {chunk.title} "
            chunk_content += f"{chunk.text}"

            content_refs += f"<Content{i}>{chunk_content}</Content{i}>"
            i += 1
            if len(content_refs) > max_characters:
                break

        return content_refs

    async def evaluate(self, query: str, content_refs: str, possible_intents: List[Intent]) -> EvaluationResult:
        """
        Takes in a query result and possible intents and returns a list of query results with matching document chunks and scores.
        """

        formatted_intents = ""

        for intent in possible_intents:
            formatted_intents += f"- {intent.name}: {intent.description}\n"
        
        system_prompt = f"Use only this content to construct your response. {content_refs}"

        user_instructions = """User inquiry: {message}
Instructions: First, determine the user's intent: 
{formatted_intents}
Second, respond with a JSON in the format:
{{
"user_intent": string, // The user's intent
"content_contains_answer": boolean, // true or false. Whether the information in the content is sufficient to resolve the issue.
"justification": string // Why the content you found is or is not sufficient to resolve the issue.
}}""".format(message=query, formatted_intents=formatted_intents)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_instructions},
            ],
            temperature=0
        )
        json_string = response['choices'][0]['message']['content']
        json_object = json.loads(json_string)

        intent = Intent(name=json_object['user_intent'], description="")
        content_contains_answer = json_object['content_contains_answer']
        justification = json_object['justification']

        return EvaluationResult(intent=intent, content_contains_answer=content_contains_answer, justification=justification)
    
    async def get_answer(self, query: str, content_refs: str) -> str:
        """
        Takes in a query result and intent and returns a string answer.
        """

        system_prompt = f"Use only the information in the following pieces of content to construct your response. {content_refs}"
        user_instructions = f"Respond to this question, preserving any markdown format: {query}"

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_instructions},
            ],
            temperature=0
        )
        return response['choices'][0]['message']['content']


