# SweatMap

[![npm version](https://badge.fury.io/js/sweatmap.svg)](http://badge.fury.io/js/sweatmap)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)

Take in a series of UTF-8 strings and map them to UTF-8 strings that are as small as possible while still being unique.

**Zero dependencies.** Installing SweatMap adds nothing else to your `node_modules`.

### Why?

The motivation behind SweatMap was to take semantic CSS Identifiers (e.g. for selectors) and make them as small as possible at build time. With new tools that can take advantage of CSS Modules all we needed was something to map our current class names to something smaller.

## Installation

`npm install sweatmap --save`

## How to use

SweatMap is a single dependency-free ES module, so the same file works in Node and in the browser.

**Node (ESM):**

```js
import SweatMap from "sweatmap";
```

**Node (CommonJS):**

```js
const SweatMap = require("sweatmap");
```

**Browser:**

```html
<script type="module">
  import SweatMap from "./node_modules/sweatmap/dist/sweatmap.js";
</script>
```

Then:

```js
const myMap = new SweatMap({ cssSafe: true });

myMap.set("my-semantic-class-name"); // "A"
```

Requires Node `^20.19.0 || >=22.12.0` or any modern browser. TypeScript types are included.

- **Constructor(obj):**

  _Takes in an object with up to four optional properties:_

  - _cssSafe [default `false`]:_ `true` disallows characters that aren't safe for [CSS Identifiers](https://www.w3.org/TR/CSS2/syndata.html#characters).
  - _ranges [default: the built-in ranges]:_ An object of character ranges, in the same form as `additional_ranges`, to use instead of the built-in ones. For example, `{ letters: { start: "41", end: "5A" } }` generates values from `A-Z` only.
  - _additional_ranges [[`object`](https://github.com/soluml/SweatMap/blob/master/src/sweatmap.js#L19)]:_ An object where the key is a "range name" and the value is an object with a start character point and an end character point. You can set null to either start or end to remove a character range. Applied on top of `ranges` when both are given.
  - _existing_strings [default `{}`]:_ Pass in an object of strings that you don't want changed. Key is the original name, value is the name that should be used.

- **bytes(string):** Returns a byte count of the string passed in.
- **size():** Returns number of entries in the map.
- **cssSafeString(string):** Determines if the string is a safe [CSS Identifier](https://www.w3.org/TR/CSS2/syndata.html#characters).
- **set(string):** Returns an obfuscated UTF-8 string that's unique to all strings in the map.
- **delete(key):** Removes the string from the map.
- **clear():** Empties the map.
- **entries():** Returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
- **get(key):** Returns the value for a given key.
- **get_obfuscated(value):** Returns the key for a given value.
- **has(key):** Returns true/false if a key exists in the map.
- **has_obfuscated(value):** Returns true/false if a value exists in the map.

## Development

The source is TypeScript in `src/`. Node runs it directly (`^22.18.0 || >=23.6.0`, for built-in type stripping), so tests need no build step.

- `npm test` runs the tests.
- `npm run bench` runs a quick performance benchmark.
- `npm run typecheck` and `npm run lint` check the source and tests. Linting uses [Oxlint](https://oxc.rs/docs/guide/usage/linter) with type-aware rules.
- `npm run format` formats everything with [Oxfmt](https://oxc.rs/docs/guide/usage/formatter); `npm run format:check` verifies it.
- `npm run build` compiles `src/` to `dist/` (JavaScript and type declarations). It runs automatically on `npm pack` and `npm publish`.
