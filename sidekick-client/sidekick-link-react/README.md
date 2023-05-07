# getsidekick

`getsidekick` is a React library that provides a hook for easy authentication with popular SaaS applications such as Notion, Google Drive, and more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Running Locally](#running-locally)
- [Publishing](#publishing)
- [Troubleshooting](#troubleshooting)

## Installation

Install the library using npm:

```sh
npm install getsidekick
```

## Usage

Here's an example of how to use the `getsidekick` library:

```javascript
import React, { useEffect } from 'react';
import { useSidekickAuth } from 'getsidekick';

const App = () => {
  const publicKey = '5c362fda-bb72-4a6c-b930-71f33ad45f79';
  const connectionId = '2cbaa840-0b21-4d8e-924c-e418a08ce53f';
  const sidekickBaseUrl = 'http://localhost:8080';

  const { authorize, loading, newConnection, error } = useSidekickAuth(publicKey, sidekickBaseUrl);

  useEffect(() => {
    authorize('notion', connectionId);
  }, []);

  return (
    <div className="App">
      {newConnection && <div>{newConnection}</div>}
    </div>
  );
};

export default App;
```

## Running Locally

To run the `getsidekick` library locally, follow these steps:

1. Build the library:

   ```sh
   npm run build
   ```

2. Link the library to your local npm:

   ```sh
   npm link
   ```

3. Link the library to the target project (e.g. `sidekick-demo`):

   ```sh
   cd path/to/sidekick-demo
   npm link getsidekick
   ```

4. Import and use the library in the target project:

   ```javascript
   import { useSidekickAuth } from 'getsidekick';
   ```

## Publishing

To publish the `getsidekick` library, use the following command:

```sh
npm publish
```

## Troubleshooting

### Invalid Hook Call Warning

If you encounter an "Invalid hook call" warning when importing the library into another project, it might be caused by the library using a different version of React than the project. To resolve this issue, follow the instructions provided in this StackOverflow post: [Invalid hook call warning - linking a React app and a local npm package](https://stackoverflow.com/questions/57825421/invalid-hook-call-warning-linking-a-react-app-and-a-local-npm-package)

