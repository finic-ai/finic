from models.models import AppConfig, Connection, AskQuestionResult
from appstatestore.statestore import StateStore
from connectors.connector_utils import get_document_connector_for_id
from models.api import GetDocumentsRequest
from typing import List
import pdb

from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQAWithSourcesChain


class QuestionService:
    def __init__(self, config: AppConfig, openai_api_key: str):
        self.config = config
        self.openai_api_key = openai_api_key

    # TODO: Use a persistent vector store and delete all documents older than 7 days
    async def ask(
        self, question: str, connections: List[Connection]
    ) -> AskQuestionResult:
        from server.main import get_documents

        raw_docs = []
        for connection in connections:
            raw_docs.extend(
                (
                    await get_documents(
                        request=GetDocumentsRequest(
                            connector_id=connection.connector_id,
                            account_id=connection.account_id,
                            chunked=True,
                        ),
                        config=self.config,
                    )
                ).documents
            )
        documents = [
            Document(
                page_content=doc.content,
                metadata={"title": doc.title, "source": doc.uri},
            )
            for doc in raw_docs
        ]
        embeddings = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
        # Limit to 1000 document chunks since we use a transient local chroma instance
        vdb = Chroma.from_documents(documents[0:1000], embeddings)
        chain = RetrievalQAWithSourcesChain.from_chain_type(
            OpenAI(openai_api_key=self.openai_api_key, temperature=0),
            chain_type="stuff",
            retriever=vdb.as_retriever(),
        )
        answer = chain({"question": question}, return_only_outputs=True)
        # Chain returns sources as a string, with inconsistent delimiters. Try to split on comma or newline
        delimiters = [", ", "\n"]
        sources = []
        for delimiter in delimiters:
            if delimiter in answer["sources"]:
                sources = answer["sources"].split(delimiter)
                break
            sources = [answer["sources"]]
        return AskQuestionResult(answer=answer["answer"], sources=sources)
