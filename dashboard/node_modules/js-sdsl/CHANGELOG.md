# Change Log

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [4.1.5] - 2022.09.30

### Added

- Add `find`, `remove`, `updateItem` and `toArray` functions to `PriorityQueue`.
- Support single package release (use scope @js-sdsl).

## [4.1.5-beta.1] - 2022.09.23

### Fixed

- Get wrong tree index when size is 0.

## [4.1.5-beta.0] - 2022.09.23

### Added

- Add `index` property to tree iterator which represents the sequential index of the iterator in the tree.

### Changed

- Minimal optimization with private properties mangling, macro inlining and const enum.
- Private properties are now mangled.
- Remove `checkWithinAccessParams` function.
- Constants of `HashContainer` are moved to `HashContainerConst` const enum.
- The iteratorType parameter in the constructor now changed from `boolean` type to `IteratorType` const enum type.
- The type of `TreeNode.color` is now changed from `boolean` to `TreeNodeColor` const enum.
- Turn some member exports into export-only types.

### Fixed

- Fixed wrong iterator error message.

## [4.1.4] - 2022.09.07

### Added

- Add some notes.

### Changed

- Optimize hash container.
- Abstracting out the hash container.

### Fixed

- Fixed tree get height function return one larger than the real height.
- Tree-shaking not work in ES module.
- `Queue` and `Deque` should return `undefined` when container is empty.

## [4.1.4-beta.0] - 2022.08.31

### Added

- Add function update key by iterator.
- Add iterator copy function to get a copy of itself.
- Add insert by iterator hint function in tree container.

### Changed

- Changed OrderedMap's iterator pointer get from `Object.defineProperty'` to  `Proxy`.
- Improve iterator performance by remove some judgment.
- Change iterator type description from `normal` and `reverse` to boolean.

## [4.1.2-beta.0] - 2022.08.27

### Added

- Make `SequentialContainer` and `TreeBaseContainer` export in the index.

### Changed

- Change rbTree binary search from recursive to loop implementation (don't effect using).
- Reduce memory waste during deque initialization.

### Fixed

- Fixed priority queue not dereference on pop.

## [4.1.1] - 2022.08.23

### Fixed

- Forgot to reset root node on rotation in red-black tree delete operation.
- Fix iterator invalidation after tree container removes iterator.

## [4.1.0] - 2022.08.21

### Changed

- Change some functions from recursive to loop implementation (don't effect using).
- Change some iterator function parameter type.
- Change commonjs target to `es6`.
- Change `Deque` from sequential queue to circular queue.
- Optimize so many places (don't affect using).

### Fixed

- Fix `Vector` length bugs.

## [4.0.3] - 2022-08-13

### Changed

- Change `if (this.empty())` to `if (!this.length)`.
- Change some unit test.
- Change class type and optimized type design.

### Fixed

- Fix can push undefined to deque.

## [4.0.0] - 2022-07-30

### Changed

- Remove InternalError error as much as possible (don't affect using).
- Change `HashSet` api `eraseElementByValue`'s name to `eraseElementByKey`.
- Change some unit tests to improve coverage (don't affect using).

## [4.0.0-beta.0] - 2022-07-24

### Added

- Complete test examples (don't effect using).
- The error thrown is standardized, you can catch it according to the error type.

### Changed

- Refactor all container from function to class (don't affect using).
- Abstracting tree containers and hash containers, change `Set`'s and `Map`'s name to `OrderedSet` and `OrderedMap` to distinguish it from the official container.
- Change `OrderedSet` api `eraseElementByValue`'s name to `eraseElementByKey`.

### Fixed

- Fixed so many bugs.

## [3.0.0-beta.0] - 2022-04-29

### Added

- Bidirectional iterator is provided for all containers except Stack, Queue, HashSet and HashMap.
- Added begin, end, rBegin and rEnd functions to some containers for using iterator.
- Added `eraseElementByIterator` function.

### Changed

- Changed Pair type `T, K` to `K, V` (don't affect using).
- Changed `find`, `lowerBound`, `upperBound`, `reverseLowerBound` and `reverseUpperBound` function's returned value to `Iterator`.

### Fixed

- Fixed an error when the insert value was 0.
- Fixed the problem that the lower version browser does not recognize symbol Compilation error caused by iterator.
