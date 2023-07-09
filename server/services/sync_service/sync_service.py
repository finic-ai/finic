from models.models import AppConfig, Sync, ConnectionFilter, SyncResults, SyncResult
from appstatestore.statestore import StateStore
from connectors.connector_utils import get_document_connector_for_id
import requests
from typing import List, Optional, Dict
import time


class SyncService:
    def __init__(self, config: AppConfig):
        self.config = config

    async def run(self, sync_all: bool) -> List[bool]:
        if sync_all:
            syncs = StateStore().get_syncs(app_id_filter=None)
            result: List[bool] = []
            for sync in syncs:
                success = await self.run_sync(sync)
                result.append(success)
            return result

        else:
            syncs = StateStore().get_syncs(app_id_filter=self.config.app_id)
            if len(syncs) == 0:
                return []
            success = await self.run_sync(syncs[0])
            return [success]

    async def run_sync(self, sync: Sync) -> bool:
        app_id = sync.app_id
        webhook_url = sync.webhook_url
        config = AppConfig(app_id=app_id, user_id="")

        connections = StateStore().get_connections(
            filter=ConnectionFilter(connector_id=None, account_id=None), config=config
        )
        success = True
        results = SyncResults(last_updated=int(time.time()), results=[])
        for connection in connections:
            try:
                connector = get_document_connector_for_id(
                    connection.connector_id, config
                )

                print(connector.connector_id)

                documents = await connector.load(account_id=connection.account_id)

                requests.post(
                    webhook_url,
                    json={
                        "account_id": connection.account_id,
                        "connector_id": connection.connector_id,
                        "documents": [doc.dict() for doc in documents],
                    },
                )
                results.results.append(
                    SyncResult(
                        account_id=connection.account_id,
                        connector_id=connection.connector_id,
                        success=True,
                        docs_synced=len(documents),
                    )
                )

            except Exception as e:
                print(e)
                results.results.append(
                    SyncResult(
                        account_id=connection.account_id,
                        connector_id=connection.connector_id,
                        success=False,
                        docs_synced=0,
                        error=str(e),
                    )
                )
                success = False

        StateStore().save_sync_results(sync=sync, results=results)
        return success
