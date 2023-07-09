import requests
import json
from typing import Dict, List, Optional
from models.models import (
    AppConfig,
    Document,
    ConnectorId,
    DocumentConnector,
    AuthorizationResult,
    Section,
    ConnectionFilter,
    SectionType,
)
from appstatestore.statestore import StateStore
import base64

BASE_URL = "https://api.clickup.com/api"


class ClickupConnector(DocumentConnector):
    connector_id: ConnectorId = ConnectorId.notion
    config: AppConfig
    headers: Dict = {}

    def __init__(self, config: AppConfig):
        super().__init__(config=config)

    async def authorize_api_key(self) -> AuthorizationResult:
        pass

    async def authorize(
        self, account_id: str, auth_code: Optional[str], metadata: Optional[Dict]
    ) -> AuthorizationResult:
        connector_credentials = StateStore().get_connector_credential(
            self.connector_id, self.config
        )
        try:
            client_id = connector_credentials["client_id"]
            client_secret = connector_credentials["client_secret"]
            authorization_url = connector_credentials["authorization_url"]
            redirect_uri = connector_credentials["redirect_uri"]
        except Exception as e:
            raise Exception("Connector is not enabled")

        if not auth_code:
            return AuthorizationResult(authorized=False, auth_url=authorization_url)

        try:
            # encode in base 64
            encoded = base64.b64encode(
                f"{client_id}:{client_secret}".encode("utf-8")
            ).decode("utf-8")
            headers = {
                "Authorization": f"Basic {encoded}",
                "Content-Type": "application/json",
            }

            data = {
                "code": auth_code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
            }

            response = requests.post(
                f"{BASE_URL}/v2/oauth/token", headers=headers, json=data
            )

            creds = response.json()
            creds_string = json.dumps(creds)

            access_token = creds["access_token"]

            headers = {
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            }
            response = requests.get(f"{BASE_URL}/v2/team", headers=headers)

            if response.status_code == 200:
                # Print the response data
                res = response.json()
                team_ids = [team["id"] for team in res["teams"]]
                team_ids_str = json.dumps(team_ids)
                if len(team_ids) < 1:
                    raise Exception("No workspaces found")
            else:
                raise Exception("Couldn't fetch workspaces")

        except Exception as e:
            raise Exception(f"Unable to load workspaces from Clickup due to error: {e}")

        new_connection = StateStore().add_connection(
            config=self.config,
            credential=creds_string,
            connector_id=self.connector_id,
            account_id=account_id,
            metadata={"team_ids": team_ids_str},
        )
        return AuthorizationResult(authorized=True, connection=new_connection)

    async def get_sections(self, account_id: str) -> List[Section]:
        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_string = connection.credential
        credential_json = json.loads(credential_string)
        access_token = credential_json["access_token"]
        query_clickup = self._query_clickup(
            access_token=access_token, entity="COLLECTION"
        )

        team_docs = query_clickup("team")["teams"]
        team_secs = []
        for team_doc in team_docs:
            team_id = team_doc["id"]
            team_sec = Section(
                id=team_id,
                name=team_doc["name"] + " [WORKSPACE]",
                type=SectionType.folder,
                children=[],
            )
            space_docs = query_clickup(f"team/{team_id}/space")["spaces"]
            for space_doc in space_docs:
                space_id = space_doc["id"]
                space_sec = Section(
                    id=space_id,
                    name=space_doc["name"] + " [SPACE]",
                    type=SectionType.folder,
                    children=[],
                )

                # lists without folders
                list_docs = query_clickup(f"space/{space_id}/list")["lists"]
                if len(list_doc) > 0:
                    unfoldered_sec = Section(
                        id=space_id,
                        name=" [UNFOLDERED LISTS]",
                        type=SectionType.folder,
                        children=[],
                    )
                for list_doc in list_docs:
                    list_id = list_doc["id"]
                    list_sec = Section(
                        id=list_id,
                        name=list_doc["name"] + " [LIST]",
                        type=SectionType.folder,
                        children=[],
                    )
                    unfoldered_sec.children.append(list_sec)

                space_sec.children.append(unfoldered_sec)
                folder_docs = query_clickup(f"space/{space_id}/folder")["folders"]
                for folder_doc in folder_docs:
                    folder_id = folder_doc["id"]
                    folder_sec = Section(
                        id=folder_id,
                        name=folder_doc["name"] + " [FOLDER]",
                        type=SectionType.folder,
                        children=[],
                    )

                    list_docs = query_clickup(f"folder/{folder_id}/list")["lists"]
                    for list_doc in list_docs:
                        list_id = list_doc["id"]
                        list_sec = Section(
                            id=list_id,
                            name=list_doc["name"] + " [LIST]",
                            type=SectionType.folder,
                            children=[],
                        )
                        folder_sec.children.append(list_sec)
                    space_sec.children.append(folder_sec)
                team_sec.children.append(space_sec)
            team_secs.append(team_sec)
        return team_secs

    async def load(self, connection_filter: ConnectionFilter) -> List[Document]:
        account_id = connection_filter.account_id
        uris = connection_filter.uris
        section_filter = connection_filter.section_filter_id

        connection = StateStore().load_credentials(
            self.config, self.connector_id, account_id
        )
        credential_string = connection.credential
        credential_json = json.loads(credential_string)
        access_token = credential_json["access_token"]

        # There should be section_filters only, no urls
        connection_filter = ConnectionFilter(
            connector_id=self.connector_id, account_id=account_id
        )
        connections = StateStore().get_connections(
            filter=connection_filter,
            config=self.config,
        )
        connection = connections[0]
        filters = connection.section_filters

        # get the filter with the right id
        sections = []
        for filter in filters:
            if filter.id == section_filter:
                sections = filter.sections

        list_id_path_array = []
        for section in sections:
            list_id_path_array.extend(self._get_all_lists(section, ""))

        query_clickup_tasks = self._query_clickup(
            access_token=access_token, entity="COLLECTION"
        )
        query_clickup_task = self._query_clickup(
            access_token=access_token, entity="TASK"
        )
        docs = []
        for list_id, path in list_id_path_array:
            partial_tasks = query_clickup_tasks(
                f"list/{list_id}/task", {"include_closed": True}
            )["tasks"]
            tasks_ids = [f"task/{pt['id']}" for pt in partial_tasks]
            tasks = [query_clickup_task(tid) for tid in tasks_ids]

            for task in tasks:
                content = f"Path: {path}{task['name']}\n\n"
                content + f"Name: {task['name']}\n"
                content + f"Content: {task['text_content']}\n"
                content + f"Description: {task['description']}\n"
                content + f"Status: {task['status']}\n"
                content + f"Date created: {task['date_created']}\n"
                content + f"Date updated: {task['date_updated']}\n"
                content + f"Date closed: {task['date_closed']}\n"
                content + f"Assignees: {','.join(task['assignees'])}\n"
                content + f"Checklists: {','.join(task['checklists'])}\n"
                content + f"Tags: {','.join(task['tags'])}\n"
                content + f"Due date: {task['due_date']}\n"
                content + f"Url: {task['url']}\n"
                docs.append(
                    Document(
                        title=task["name"],
                        content=content,
                        uri=task["url"],
                        connector_id=self.connector_id,
                        account_id=account_id,
                    )
                )
        return docs

    def _get_all_lists(self, section, path):
        lists = []
        if section.name.endsWith("[LIST]"):
            list_id = section.id
            lists.append((list_id, path))
        else:
            path += f"{section.name}/"
            for child_sec in section.children:
                lists.extend(self._get_all_lists(child_sec, path))
        return lists

    def _query_clickup(self, access_token, entity="COLLECTION"):
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }
        if entity == "COLLECTION":

            def _query_collection(collection_path, params={}):
                response = requests.get(
                    f"{BASE_URL}/v2/{collection_path}", headers=headers, params=params
                )
                return response.json()

            return _query_collection
        elif entity == "TASK":

            def _query_task(collection_path):
                response = requests.get(
                    f"{BASE_URL}/v2/{collection_path}", headers=headers
                )
                return response.json()

            return _query_task
        else:
            raise Exception("Invalid Clickup query")
