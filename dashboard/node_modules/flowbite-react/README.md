<div align="center">
  <h1>:construction: flowbite-react (unreleased) :construction:</h1>
  <p>
    <a href="https://flowbite-react.com">
      <img alt="Flowbite - Tailwind CSS components" width="350" src=".github/assets/flowbite-react-github.png">
    </a>
  </p>
  <p>
    Build websites even faster with components on top of React and Tailwind CSS
  </p>
  <p>
    <a href="https://codecov.io/gh/themesberg/flowbite-react">
      <img src="https://codecov.io/gh/themesberg/flowbite-react/branch/main/graph/badge.svg?token=wnw40SeY4k"/>
    </a>
    <a href="https://discord.com/invite/4eeurUVvTy">
      <img src="https://img.shields.io/discord/902911619032576090?color=%237289da&label=Discord" alt="Discord">
    </a>
    <a href="https://www.npmjs.com/package/flowbite-react">
      <img src="https://img.shields.io/npm/dt/flowbite-react.svg" alt="Total Downloads">
    </a>
    <a href="https://badge.fury.io/js/flowbite-react">
      <img alt="Latest release" src="https://badge.fury.io/js/flowbite-react.svg">
    </a>
    <a href="https://flowbite.com/getting-started/license/">
      <img src="https://img.shields.io/badge/license-MIT-blue" alt="Licenese">
    </a>
  </p>
</div>

---

[![Screenshot of flowbite-react.com](https://i.postimg.cc/hjdhcF2t/Screen-Shot-2022-05-01-at-19-34-39-fullpage.png)](https://postimg.cc/bDqq95X7)

---

### `flowbite-react` is an open source collection of UI components, built in React, with utility classes from Tailwind CSS that you can use as a starting point for user interfaces and websites.

## Table of Contents

- [Documentation](#documentation)
- [Getting started](#getting-started)
  - [Require via `npm`](#require-via--npm-)
  - [Include via CDN](#include-via-cdn)
- [Components](#components)
- [Community](#community)
- [Contributing](#contributing)
- [Figma](#figma)
- [Copyright and license](#copyright-and-license)

## Documentation

Documentation for `flowbite-react` is not yet finished.

If you want to browse the components, visit [flowbite-react.com](https://flowbite-react.com/).

If you want to learn more about Flowbite, visit [Flowbite docs](https://flowbite.com/getting-started/introduction/).

## Getting started

To use `flowbite-react`, you just need to setup `flowbite` normally and install `flowbite-react` from `npm`.

`flowbite` can be included as a plugin into an existing Tailwind CSS project.

### Require via `npm`

Make sure that you have <a href="https://nodejs.org/en/" rel="nofollow" >Node.js</a> and <a href="https://tailwindcss.com/" rel="nofollow" >Tailwind CSS</a> installed.

1. Install `flowbite` as a dependency using `npm` by running the following command:

```bash
npm i flowbite flowbite-react
```

2. Require `flowbite` as a plugin inside the `tailwind.config.js` file:

```javascript
module.exports = {
  content: [
    ...,
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  plugins: [..., require('flowbite/plugin')],
};
```

## Components

<table>
  <tr>
    <td width="33.3333%">Alerts</td>
    <td width="33.3333%">Badge</td>
    <td width="33.3333%">Breadcrumbs</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/alerts/">
            <img alt="Tailwind CSS Alerts" src="https://flowbite.s3.amazonaws.com/github/alerts.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/badges/">
            <img alt="Tailwind CSS Badge" src="https://flowbite.s3.amazonaws.com/github/badge.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/breadcrumb/">
            <img alt="Tailwind CSS Breadcrumbs" src="https://flowbite.s3.amazonaws.com/github/breadcrumbs.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Buttons</td>
    <td width="33.3333%">Button group</td>
    <td width="33.3333%">Cards</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/buttons/">
            <img alt="Tailwind CSS Buttons" src="https://flowbite.s3.amazonaws.com/github/buttons.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/button-group/">
            <img alt="Tailwind CSS Button Group" src="https://flowbite.s3.amazonaws.com/github/button-group.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/card/">
            <img alt="Tailwind CSS Cards" src="https://flowbite.s3.amazonaws.com/github/cards.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Dropdown</td>
    <td width="33.3333%">Forms</td>
    <td width="33.3333%">List group</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/dropdown/">
            <img alt="Tailwind CSS Dropdown" src="https://flowbite.s3.amazonaws.com/github/dropdown.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/forms/">
            <img alt="Tailwind CSS Forms" src="https://flowbite.s3.amazonaws.com/github/forms.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/list-group/">
            <img alt="Tailwind CSS List group" src="https://flowbite.s3.amazonaws.com/github/list-group.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">:construction: Typography</td>
    <td width="33.3333%">Modal</td>
    <td width="33.3333%">Tabs</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite.com/docs/components/typography/">
            <img alt="Tailwind CSS Typography" src="https://flowbite.s3.amazonaws.com/github/typography.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/modal/">
            <img alt="Tailwind CSS Modal" src="https://flowbite.s3.amazonaws.com/github/modal.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/tabs/">
            <img alt="Tailwind CSS Tabs" src="https://flowbite.s3.amazonaws.com/github/tabs.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Navbar</td>
    <td width="33.3333%">Pagination</td>
    <td width="33.3333%">Timeline</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/navbars/">
            <img alt="Tailwind CSS Navbar" src="https://flowbite.s3.amazonaws.com/github/navbar.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/pagination/">
            <img alt="Tailwind CSS Pagination" src="https://flowbite.s3.amazonaws.com/github/pagination.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/timeline/">
            <img alt="Tailwind CSS Timeline" src="https://flowbite.s3.amazonaws.com/github/timeline.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Progress bar</td>
    <td width="33.3333%">Tables</td>
    <td width="33.3333%">Toast</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/progress/">
            <img alt="Tailwind CSS Progress Bar" src="https://flowbite.s3.amazonaws.com/github/progress.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/tables/">
            <img alt="Tailwind CSS Tables" src="https://flowbite.s3.amazonaws.com/github/tables.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/toast/">
            <img alt="Tailwind CSS Toast" src="https://flowbite.s3.amazonaws.com/github/toast.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Tooltips</td>
    <td width="33.3333%">:construction: Datepicker</td>
    <td width="33.3333%">Spinner</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/tooltips/">
            <img alt="Tailwind CSS Tooltips" src="https://flowbite.s3.amazonaws.com/github/tooltips.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite.com/docs/plugins/datepicker/">
            <img alt="Tailwind CSS Datepicker" src="https://flowbite.s3.amazonaws.com/github/datepicker.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/spinners/">
            <img alt="Tailwind CSS Spinner" src="https://flowbite.s3.amazonaws.com/github/spinner.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Footer</td>
    <td width="33.3333%">Accordion</td>
    <td width="33.3333%">Sidebar</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/footer/">
            <img alt="Tailwind CSS Footer" src="https://flowbite.s3.amazonaws.com/github/footer.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/accordion/">
            <img alt="Tailwind CSS Accordion" src="https://flowbite.s3.amazonaws.com/github/accordion.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/sidebar/">
            <img alt="Tailwind CSS Sidebar" src="https://flowbite.s3.amazonaws.com/github/sidebar.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Carousel</td>
    <td width="33.3333%">Avatar</td>
    <td width="33.3333%">Rating</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/carousel/">
            <img alt="Tailwind CSS Carousel" src="https://flowbite.s3.amazonaws.com/github/carousel.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/avatar/">
            <img alt="Tailwind CSS Avatar" src="https://flowbite.s3.amazonaws.com/github/avatar.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/rating/">
            <img alt="Tailwind CSS Rating" src="https://flowbite.s3.amazonaws.com/github/rating.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Input Field</td>
    <td width="33.3333%">File Input</td>
    <td width="33.3333%">:construction: Search Input</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/forms">
            <img alt="Tailwind CSS Input Field" src="https://flowbite.s3.amazonaws.com/github/input-field.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/forms#fileUpload">
            <img alt="Tailwind CSS File Input" src="https://flowbite.s3.amazonaws.com/github/file-input.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite.com/docs/forms/search-input/">
            <img alt="Tailwind CSS Search Input" src="https://flowbite.s3.amazonaws.com/github/search-input.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Select</td>
    <td width="33.3333%">Textarea</td>
    <td width="33.3333%">Checkbox</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/forms#select">
            <img alt="Tailwind CSS Select" src="https://flowbite.s3.amazonaws.com/github/select.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/forms#textarea">
            <img alt="Tailwind CSS Textarea" src="https://flowbite.s3.amazonaws.com/github/textarea.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/forms#checkbox">
            <img alt="Tailwind CSS Checkbox" src="https://flowbite.s3.amazonaws.com/github/checkbox.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">Radio</td>
    <td width="33.3333%">Toggle</td>
    <td width="33.3333%">:construction: Range Slider</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/forms#radio">
            <img alt="Tailwind CSS Radio" src="https://flowbite.s3.amazonaws.com/github/radio.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite-react.com/forms#toggle">
            <img alt="Tailwind CSS Toggle" src="https://flowbite.s3.amazonaws.com/github/toggle.jpg">
        </a>
    </td>
    <td width="33.3333%">
        <a href="https://flowbite.com/docs/forms/range/">
            <img alt="Tailwind CSS Range Slider" src="https://flowbite.s3.amazonaws.com/github/range-slider.jpg">
        </a>
    </td>
  </tr>
  <tr>
    <td width="33.3333%">:construction: Floating Label</td>
  </tr>
  <tr>
    <td width="33.3333%">
        <a href="https://flowbite.com/docs/forms/floating-label/">
            <img alt="Tailwind CSS Floating Label" src="https://flowbite.s3.amazonaws.com/github/floating-label.jpg">
        </a>
    </td>
  </tr>
</table>

## Community

If you need help or just want to discuss about the library join the community on Github:

⌨️ [Discuss about Flowbite on GitHub](https://github.com/themesberg/flowbite/discussions)

For casual chatting with others using the library:

💬 [Join the Flowbite Discord Server](https://discord.gg/4eeurUVvTy)

## Contributing

Thank you for your interest in helping! Visit our [guide on contributing](https://github.com/themesberg/flowbite-react/blob/main/CONTRIBUTING.md) to get started.

## Figma

If you need the Figma files for the components you can check out our website for more information:

🎨 [Get access to the Figma design files](https://flowbite.com/figma/)

## Copyright and license

The Flowbite name and logos are trademarks of Crafty Dwarf Inc.

📝 [Read about the licensing terms](https://flowbite.com/docs/getting-started/license/)
