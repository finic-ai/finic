<p align="center">
  <a href="https://js-sdsl.github.io/" target="_blank" rel="noopener noreferrer">
    <img src="https://js-sdsl.github.io/assets/logo-removebg.png" alt="js-sdsl logo" width="120" />
  </a>
</p>

<h3><p align="center">A javascript standard data structure library which benchmark against C++ STL</p></h3>

<p align="center">
  <a href="https://www.npmjs.com/package/js-sdsl"><img src="https://img.shields.io/npm/v/js-sdsl.svg" alt="NPM Version" /></a>
  <a href="https://github.com/js-sdsl/js-sdsl/actions/workflows/build.yml"><img src="https://img.shields.io/github/workflow/status/js-sdsl/js-sdsl/js-sdsl%20CI" alt="Build Status" /></a>
  <a href='https://coveralls.io/github/js-sdsl/js-sdsl?branch=main'><img src='https://coveralls.io/repos/github/js-sdsl/js-sdsl/badge.svg?branch=main' alt='Coverage Status' /></a>
  <a href="https://github.com/js-sdsl/js-sdsl"><img src="https://img.shields.io/github/stars/js-sdsl/js-sdsl.svg" alt="GITHUB Star" /></a>
  <a href="https://npmcharts.com/compare/js-sdsl?minimal=true"><img src="https://img.shields.io/npm/dm/js-sdsl.svg" alt="NPM Downloads" /></a>
  <a href="https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js"><img src="https://img.badgesize.io/https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js?compression=gzip&style=flat-square/" alt="Gzip Size"></a>
  <a href="https://openbase.com/js/js-sdsl?utm_source=embedded&amp;utm_medium=badge&amp;utm_campaign=rate-badge"><img src="https://badges.openbase.com/js/rating/js-sdsl.svg?token=fh3LMNOV+JSWykSjtg1rA8kouSYkJoIDzGbvaByq5X0=" alt="Rate this package"/></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/npm/l/js-sdsl.svg" alt="MIT-license" /></a>
  <a href="https://github.com/js-sdsl/js-sdsl/"><img src="https://img.shields.io/github/languages/top/js-sdsl/js-sdsl.svg" alt="GITHUB-language" /></a>
</p>

<p align="center">English | <a href="https://github.com/js-sdsl/js-sdsl/blob/main/README.zh-CN.md">简体中文</a></p>

## Included data structures

- Vector
- Stack
- Queue
- LinkList
- Deque
- PriorityQueue
- OrderedSet (using RBTree)
- OrderedMap (using RBTree)
- HashSet
- HashMap

## Benchmark

We are benchmarking against other popular data structure libraries. In some ways we're better than the best library. See [benchmark](https://js-sdsl.github.io/#/test/benchmark-analyze).

## Supported platforms

- node.js (using es6)
- react/vue (using es5)
- browser (support most browsers)

## Download

Download directly

- [js-sdsl.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.js) (for development)
- [js-sdsl.min.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js) (for production)

Or install js-sdsl using npm

```bash
npm install js-sdsl
```

## Usage

You can visit our [official website](https://js-sdsl.github.io/) to get more information.

To help you have a better use, we also provide this [API document](https://js-sdsl.github.io/js-sdsl/index.html).

### For browser

```html
<script src="https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js"></script>
<script>
    const {
      Vector,
      Stack,
      Queue,
      LinkList,
      Deque,
      PriorityQueue,
      OrderedSet,
      OrderedMap,
      HashSet,
      HashMap
    } = sdsl;
    const myOrderedMap = new OrderedMap();
    myOrderedMap.setElement(1, 2);
    console.log(myOrderedMap.getElementByKey(1)); // 2
</script>
```

### For npm

```javascript
// esModule
import { OrderedMap } from 'js-sdsl';
// commonJs
const { OrderedMap } = require('js-sdsl');
const myOrderedMap = new OrderedMap();
myOrderedMap.setElement(1, 2);
console.log(myOrderedMap.getElementByKey(1)); // 2
```

## Build by source code

You can pull this repository and run `yarn build` to rebuild this library.

## Test

### Unit test

We use jest library to write unit tests, you can see test coverage on [coveralls](https://coveralls.io/github/js-sdsl/js-sdsl). You can run `yarn test:unit` command to reproduce it.

### For performance

We tested most of the functions for efficiency. You can go to [`gh-pages/performance.md`](https://github.com/js-sdsl/js-sdsl/blob/gh-pages/performance.md) to see our running results or reproduce it with `yarn test:performance` command.

You can also visit [here](https://js-sdsl.github.io/#/test/performance-test) to get the result.

## Maintainers

[@ZLY201](https://github.com/ZLY201)

## Contributing

Feel free to dive in! Open an issue or submit PRs. It may be helpful to read the [Contributor Guide](https://github.com/js-sdsl/js-sdsl/blob/main/.github/CONTRIBUTING.md).

### Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://www.linkedin.com/in/takatoshi-kondo-02a91410/"><img src="https://avatars.githubusercontent.com/u/275959?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Takatoshi Kondo</b></sub></a><br /><a href="https://github.com/js-sdsl/js-sdsl/commits?author=redboltz" title="Code">💻</a> <a href="https://github.com/js-sdsl/js-sdsl/commits?author=redboltz" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://www.youtube.com/c/noname0310"><img src="https://avatars.githubusercontent.com/u/48761044?v=4?s=100" width="100px;" alt=""/><br /><sub><b>noname</b></sub></a><br /><a href="https://github.com/js-sdsl/js-sdsl/commits?author=noname0310" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[MIT](https://github.com/js-sdsl/js-sdsl/blob/main/LICENSE) © ZLY201
