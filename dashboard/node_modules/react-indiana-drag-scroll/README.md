# React Indiana Drag Scroll

> Implements scroll on drag

[Examples](https://norserium.github.io/react-indiana-drag-scroll/) / [Sandbox](https://codesandbox.io/s/react-indiana-drag-scroll-default-iw9xh)

[![NPM](https://img.shields.io/npm/v/react-indiana-drag-scroll.svg)](https://www.npmjs.com/package/react-indiana-drag-scroll) <a href="https://npmcharts.com/compare/react-indiana-drag-scroll?minimal=true"><img src="https://img.shields.io/npm/dm/react-indiana-drag-scroll.svg?sanitize=true" alt="Downloads"></a> [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Welcome to journey!

![](https://github.com/norserium/react-indiana-drag-scroll/blob/master/example/demo.gif?raw=true)

Try it yourself! Go to [demo website](https://norserium.github.io/react-indiana-drag-scroll/).

## Install

```bash
npm install --save react-indiana-drag-scroll
```

```bash
yarn add react-indiana-drag-scroll
```

## Usage

```jsx
import React, { Component } from 'react'

import ScrollContainer from 'react-indiana-drag-scroll'

class Example extends Component {
  render () {
    return (
      <ScrollContainer className="scroll-container">
        { ... }
      </ScrollContainer>
    )
  }
}
```

## Component properties

| Prop               | Type         | Description                                                                               | Default |
| ------------------ | ------------ | ----------------------------------------------------------------------------------------- | ------- |
| vertical           | Bool         | Allow vertical drag scrolling                                                             | true    |
| horizontal         | Bool         | Allow horizontal drag scrolling                                                           | true    |
| hideScrollbars     | Bool         | Hide the scrollbars                                                                       | true    |
| activationDistance | Number       | The distance that distinguish click and drag start                                        | 10      |
| children           | Node         | The content of scrolling container                                                        |
| onScroll           | Function     | Invoked when user scrolling container                                                     |
| onEndScroll        | Function     | Invoked when user ends scrolling container                                                |
| onStartScroll      | Function     | Invoked when user starts scrolling container                                              |
| onClick            | Function     | Invoked when user clicks the scrolling container without dragging                         |
| component          | String       | The component used for the root node.                                                     | 'div'
| className          | String       | The custom classname for the container                                                    |
| draggingClassName  | String       | The classname for the container during dragging                                           |
| style              | Number       | The custom styles for the container                                                       |
| innerRef           | ElementType  | The ref to the root node (experimental alternative to `getElement`)                       |
| ignoreElements     | String       | Selector for elements that should not trigger the scrolling behaviour (for example, `".modal, dialog"` or `"*[prevent-drag-scroll]"`) |
| nativeMobileScroll | Bool         | Use native mobile drag scroll for mobile devices                                          | true
| buttons            | Array<Number>| The list of mouse button numbers that will activate the scroll by drag                    | [0]

## Static functions

| Name               | Returns     | Description                                                                            |
| ------------------ | ----------- | -------------------------------------------------------------------------------------- |
| getElement         | HTMLElement | Returns the HTML element                                                               |


## FAQ

### How to set the initial scroll?

To set initial scroll you need get the ref to the root node of the `ScrollContainer`. It can be implemented by [using `innerRef`property](https://codesandbox.io/s/react-indiana-drag-scroll-initial-scroll-innerref-0g8v5?file=/index.js) or [the static function `getElement`](https://codesandbox.io/s/react-indiana-drag-scroll-initial-scroll-getelement-99o6q). At the worst you can use the [`ReactDOM.findDOMNode`](https://codesandbox.io/s/react-indiana-drag-scroll-initial-scroll-finddomnode-dvdop) method.

## License

The source code is licensed under MIT, all images (except [hieroglyphs](https://www.freepik.com/free-vector/ancient-egypt-hieroglyphics-background-with-flat-design_2754100.htm)) are copyrighted to their respective owner © [Norserium](https://github.com/norserium)
