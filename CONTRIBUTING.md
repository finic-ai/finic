# Contributing
Psychic is open for contribution!

## Creating a new Connector
- Create a new folder under `server/connectors` named `<data-source>_connector` where `<data-source>` is the name of the source you are connecting to.
- This folder should contain a file `<data-source>_connector.py` with a new class for the new connector that inherits from the `DataConnector` class and implements its functions.
- The folder should also include an `__init__.py` file that imports the new connector class as well as any config values that need to be set for this connector (e.g. credentials, paths)
- Create a new endpoint in `/server/main.py` that uses the new connector.
  
## Other changes
For changes to other server-side code or the Psychic modal or the Psychic dashboard, please email us at support@psychic.dev. 
We value your time, and want to make sure your contributions are aligned with the direction of the product before you being work on it!
