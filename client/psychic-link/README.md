# Psychic Link

`@psychic-api/link` is a React library that provides a hook for easy authentication with popular SaaS applications such as Notion, Google Drive, and more. Find us at https://psychic.dev

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## Installation

Install the library using npm:

```sh
npm install @psychic-api/link
```

## Usage

Here's an example of how to use the library:

```javascript
import React, { useEffect, useState } from "react";
import { usePsychicLink } from "@psychic-api/link";

const App = () => {
  const [newConnection, setNewConnection] = useState(null);
  // Your Psychic.dev public API key
  const publicKey = "5c362fda-bb72-4a6c-b930-71f33ad45f79";

  // Unique ID for the account that is requesting this connection
  const accountId = "2cbaa840-0b21-4d8e-924c-e418a08ce53f";

  // usePsychicLink accepts a callback that handles your application logic once a new connection is established
  const { open, isReady, isLoading, error } = usePsychicLink(
    publicKey,
    (newConnection: { accountId: string, connectorId: string }) =>
      setNewConnection(newConnection)
  );

  useEffect(() => {
    // Shows the Psychic Link modal to the user
    open(accountId);
  }, []);

  return (
    <div className="App">{newConnection && <div>{newConnection}</div>}</div>
  );
};

export default App;
```

### Open to a specific connector

By default, the Psychic modal displays a list of connectors for the user to pick. If you want the modal to open to a specific connector, such as Notion, use the optional `connectorId` parameter in the `open` function:

```
// Import the ConnectorId enum
import { usePsychicLink, ConnectorId } from '@psychic-api/link';

// Pass in the connector that you want to display to the user
open(accountId, ConnectorId.Notion);
```

## Troubleshooting

For assistance, join the Psychic community Slack [here](https://join.slack.com/t/psychicapi/shared_invite/zt-1yptnhwcz-SiOCnrbqnBDsuzps9sEMSw)

### Invalid Hook Call Warning

If you encounter an "Invalid hook call" warning when importing the library into another project, it might be caused by the library using a different version of React than the project. To resolve this issue, follow the instructions provided in this StackOverflow post: [Invalid hook call warning - linking a React app and a local npm package](https://stackoverflow.com/questions/57825421/invalid-hook-call-warning-linking-a-react-app-and-a-local-npm-package)
