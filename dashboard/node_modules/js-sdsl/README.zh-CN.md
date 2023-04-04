<p align="center">
  <a href="https://js-sdsl.github.io/" target="_blank" rel="noopener noreferrer">
    <img src="https://js-sdsl.github.io/assets/logo-removebg.png" alt="js-sdsl logo" width="120" />
  </a>
</p>

<h3><p align="center">一款参考 C++ STL 实现的 JavaScript 标准数据结构库</p></h3>

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

<p align="center"><a href="https://github.com/js-sdsl/js-sdsl/blob/main/README.md">English</a> | 简体中文</p>

## 包含的数据结构

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

## 基准测试

我们和其他数据结构库进行了基准测试，在某些场景我们甚至超过了当前最流行的库

查看 [benchmark](https://js-sdsl.github.io/#/zh-cn/test/benchmark-analyze) 以获取更多信息

## 支持的平台

- node.js (using es6)
- react/vue (using es5)
- browser (support most browsers)

## 下载

使用 cdn 直接引入

- [js-sdsl.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.js) (for development)
- [js-sdsl.min.js](https://unpkg.com/js-sdsl/dist/umd/js-sdsl.min.js) (for production)

使用 npm 下载

```bash
npm install js-sdsl
```

## 使用说明

您可以[访问我们的主页](https://js-sdsl.github.io/)获取更多信息

并且我们提供了完整的 [API 文档](https://js-sdsl.github.io/js-sdsl/index.html)供您参考

### 在浏览器中使用

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

### npm 引入

```javascript
// esModule
import { OrderedMap } from 'js-sdsl';
// commonJs
const { OrderedMap } = require('js-sdsl');
const myOrderedMap = new OrderedMap();
myOrderedMap.setElement(1, 2);
console.log(myOrderedMap.getElementByKey(1)); // 2
```

## 从源码构建

您可以克隆此仓库后运行 `yarn build` 命令重新构建这个库

## 测试

### 单元测试

我们使用 `jest` 库来编写我们的单元测试，并将结果同步到了 [coveralls](https://coveralls.io/github/js-sdsl/js-sdsl) 上，你可以使用 `yarn test:unit` 命令来重建它

### 对于性能的校验

我们对于编写的所有 API 进行了性能测试，并将结果同步到了 [`gh-pages/performance.md`](https://github.com/js-sdsl/js-sdsl/blob/gh-pages/performance.md) 中，你可以通过 `yarn test:performance` 命令来重现它

您也可以访问[我们的网站](https://js-sdsl.github.io/#/zh-cn/test/performance-test)来获取结果

## 维护者

[@ZLY201](https://github.com/ZLY201)

## 贡献

我们欢迎所有的开发人员提交 issue 或 pull request，阅读[贡献者指南](https://github.com/js-sdsl/js-sdsl/blob/main/.github/CONTRIBUTING.md)可能会有所帮助

### 贡献者

感谢对本项目做出贡献的开发者们：

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

本项目遵循 [all-contributors](https://github.com/all-contributors/all-contributors) 规范。 欢迎任何形式的贡献！

## 许可证

[MIT](https://github.com/js-sdsl/js-sdsl/blob/main/LICENSE) © ZLY201
