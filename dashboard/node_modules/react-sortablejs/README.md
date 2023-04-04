# `react-sortablejs`

React bindings to [SortableJS](https://github.com/SortableJS/Sortable)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Please note that this is not considered ready for production, as there are still a number of bugs being sent through.

## Features

## Installation

`sortablejs` and `@types/sortablejs` are peer dependencies. The latter only used if intellisense/typescript is desired.

```shell
npm install --save react-sortablejs sortablejs
npm install --save-dev @types/sortablejs

# OR
yarn add react-sortablejs sortablejs
yarn add -D @types/sortablejs
```

## Learn

Here is the TLDR of what sortable is:

```md
- Shopping List: # list of items / sortable. This represents `react-sortablejs`
  - eggs # list item. These are all the items in the list and is what you move around.
  - bread # list item
  - milk # list item
```

## Usage/Examples

### Function Component

```tsx
import React, { FC, useState } from "react";
import { ReactSortable } from "react-sortablejs";

interface ItemType {
  id: number;
  name: string;
}

export const BasicFunction: FC = (props) => {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
  ]);

  return (
    <ReactSortable list={state} setList={setState}>
      {state.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
};
```

### Class Component

```tsx
import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";

interface BasicClassState {
  list: { id: string; name: string }[];
}

export class BasicClass extends Component<{}, BasicClassState> {
  state: BasicClassState = {
    list: [{ id: "1", name: "shrek" }],
  };
  render() {
    return (
      <ReactSortable
        list={this.state.list}
        setList={(newState) => this.setState({ list: newState })}
      >
        {this.state.list.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </ReactSortable>
    );
  }
}
```

## Plugins

Sortable has some pretty cool plugins such as MultiDrag and Swap.

By Default:

- AutoScroll is premounted and enabled.
- OnSpill is premounted and NOT enabled.
- MultiDrag and Swap and NOT premounted and NOT enabled

You must mount the plugin with sortable **ONCE ONLY**.

```tsx
import React from "react";
import { ReactSortable, Sortable, MultiDrag, Swap } from "react-sortablejs";

// mount whatever plugins you'd like to. These are the only current options.
Sortable.mount(new MultiDrag(), new Swap());

const App = () => {
  const [state, setState] = useState([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
  ]);

  return (
    <ReactSortable
      multiDrag // enables mutidrag
      // OR
      swap // enables swap
    >
      {state.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
};
```

## Sortable API

For a comprehensive list of options, please visit https://github.com/SortableJS/Sortable#options.

Those options are applied as follows.

```tsx
Sortable.create(element, {
  group: " groupName",
  animation: 200,
  delayOnTouchStart: true,
  delay: 2,
});

// --------------------------
// Will now be..
// --------------------------

import React from "react";
import { ReactSortable } from "react-sortablejs";

const App = () => {
  const [state, setState] = useState([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
  ]);

  return (
    <ReactSortable
      // here they are!
      group="groupName"
      animation={200}
      delayOnTouchStart={true}
      delay={2}
    >
      {state.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
};
```

## React API

### id, className, style

These are all defaults DOM attributes. Nothing special here.

### list

The same as `state` in `const [ state, setState] = useState([{ id: 1}, {id: 2}])`

`state` must be an array of items, with each item being an object that has the following shape:

```ts
  /** The unique id associated with your item. It's recommended this is the same as the key prop for your list item. */
  id: string | number;
  /** When true, the item is selected using MultiDrag */
  selected?: boolean;
  /** When true, the item is deemed "chosen", which basically just a mousedown event. */
  chosen?: boolean;
  /** When true, it will not be possible to pick this item up in the list. */
  filtered?: boolean;
  [property: string]: any;
```

### setList

The same as `setState` in `const [ state, setState] = useState([{ id: 1}, {id: 2}])`

### clone

If you're using `{group: { name: 'groupName', pull: 'clone'}}`, this means your in 'clone' mode. You should provide a function for this.

Check out the source code of the clone example for more information. I'll write it here soon.

### tag

ReactSortable is a `div` element by default. This can be changed to be any HTML element (for example `ul`, `ol`)
or can be a React component.

This value, be the component or the HTML element should be passed down under `props.tag`.

Let's explore both here.

#### HTML Element

Here we will use a `ul`. You can use any HTML.
Just add the string and ReactSortable will use a `li` instead of a `div`.

```tsx
import React, { FC, useState } from "react";
import { ReactSortable } from "react-sortablejs";

export const BasicFunction: FC = (props) => {
  const [state, setState] = useState([{ id: "1", name: "shrek" }]);

  return (
    <ReactSortable tag="ul" list={state} setList={setState}>
      {state.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ReactSortable>
  );
};
```

#### Custom Component

When using a custom component in the `tag` prop, the only component it allows is a `forwardRef` component.
Currently we only support components who use the `React.forwardRef` API.

If it doesn't have one, you can add one using `React.forwardRef()`.

> todo: Some third party UI components may have nested elements to create the look they're after.
> This could be an issue and not sure how to fix.

```tsx
import React, { FC, useState, forwardRef } from "react";
import { ReactSortable } from "react-sortablejs";

// This is just like a normal component, but now has a ref.
const CustomComponent = forwardRef<HTMLDivElement, any>((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

export const BasicFunction: FC = (props) => {
  const [state, setState] = useState([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
  ]);

  return (
    <ReactSortable tag={CustomComponent} list={state} setList={setState}>
      {state.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
};
```

## How does it work?

Sortable affects the DOM, adding, and removing nodes/css when it needs to in order to achieve the smooth transitions we all know an love.
This component reverses many of it's actions of the DOM so React can handle this when the state changes.

## Caveats / Gotchas

### `key !== index`

DO NOT use the index as a key for your list items. Sorting will not work.

In all the examples above, I used an object with an ID. You should do the same!

I may even enforce this into the design to eliminate errors.

### Nesting

#### Problem

Basically the child updates the state twice. I'm working on this.

#### What does work?

Our usage indicates that as long as we only move items between lists that don't use the same `setState` function.

I hope to provide an example soon.

#### Solutions

We don't have anything that works 100%, but here I'd like to spit ball some potential avenues to look down.

- Use `onMove` to handle state changes instead of `onAdd`,`onRemove`, etc.
- Create a Sortable plugin specifically for react-sortbalejs
