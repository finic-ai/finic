# Contributing
Sidekick is open for contribution!

## Creating a new DataConnector
* Create a new folder under connectors named `<data-source>_connector` where <data-source> is the name of the source you are connecting to.
* This folder should contain a file `<data-source>_connector.py` with a new class for the new connector that inherits from the `DataConnector` class and implements its functions.
* The folder should also include an `__init__.py` file that imports the new connector class as well as any configs that need to be set for this connector (e.g. API keys)
* Create a new endpoint in `/server/main.py` that uses the new connector.
  
## Creating a new DataChunker
* Create a new folder under connectors named `<content-type>_chunker` where <content-type> is the type of content this chunker processes. For example, MarkdownChunker or HTMLChunker.
* This folder should contain a file `<content-type>_connector.py` with a new class that inherits from the `DataChunker` class and implements its functions.
* Update `/server/main.py` to use the new chunker for the appropriate content types.
