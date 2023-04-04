<p align="center">
  <a href="https://clerk.com?utm_source=github&utm_medium=clerk_types" target="_blank" rel="noopener noreferrer">
    <img src="https://images.clerk.com/static/logo-light-mode-400x400.png" height="64">
  </a>
  <br />
</p>

# @clerk/types

<div align="center">

[![Chat on Discord](https://img.shields.io/discord/856971667393609759.svg?logo=discord)](https://discord.com/invite/b5rXHjAg7A)
[![Clerk documentation](https://img.shields.io/badge/documentation-clerk-green.svg)](https://clerk.com/docs?utm_source=github&utm_medium=clerk_types)
[![Follow on Twitter](https://img.shields.io/twitter/follow/ClerkDev?style=social)](https://twitter.com/intent/follow?screen_name=ClerkDev)

[Changelog](https://github.com/clerkinc/javascript/blob/main/packages/types/CHANGELOG.md)
·
[Report a Bug](https://github.com/clerkinc/javascript/issues/new?assignees=&labels=bug&template=bug_report.md&title=Bug%3A+)
·
[Request a Feature](https://github.com/clerkinc/javascript/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=Feature%3A+)
·
[Ask a Question](https://github.com/clerkinc/javascript/issues/new?assignees=&labels=question&template=ask_a_question.md&title=Support%3A+)

</div>

---

## Overview

This package provides the TypeScript type declarations for Clerk libraries.

## Getting Started

It is worth noting that Clerk packages automatically include their type declarations when installed so adding this package manually is not typically necessary.

### Installation

```sh
npm install --save-dev @clerk/types
```

### Build

```sh
npm run build
```

To build types in watch mode, run the following:

```sh
npm run dev
```

## Usage

Example implementation:

```ts
import type { OAuthStrategy } from '@clerk/types';

export type OAuthProps = {
  oAuthOptions: OAuthStrategy[];
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string | undefined>>;
};
```

_For further details and examples, please refer to our [Documentation](https://clerk.com/docs?utm_source=github&utm_medium=clerk_types)._

## Support

You can get in touch with us in any of the following ways:

- Join our official community [Discord server](https://discord.com/invite/b5rXHjAg7A)
- Open a [GitHub support issue](https://github.com/clerkinc/javascript/issues/new?assignees=&labels=question&template=ask_a_question.md&title=Support%3A+)
- Contact options listed on [our Support page](https://clerk.com/support?utm_source=github&utm_medium=clerk_types)

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read [our contribution guidelines](https://github.com/clerkinc/javascript/blob/main/packages/types/docs/CONTRIBUTING.md).

## Security

`@clerk/types` follows good practices of security, but 100% security cannot be assured.

`@clerk/types` is provided **"as is"** without any **warranty**. Use at your own risk.

_For more information and to report security issues, please refer to our [security documentation](https://github.com/clerkinc/javascript/blob/main/packages/types/docs/SECURITY.md)._

## License

This project is licensed under the **MIT license**.

See [LICENSE](https://github.com/clerkinc/javascript/blob/main/packages/types/LICENSE) for more information.
