#SweatMap
[![npm version](https://badge.fury.io/js/sweatmap.svg)](http://badge.fury.io/js/sweatmap)
[![Build Status](https://travis-ci.org/soluml/SweatMap.svg?branch=master)](https://travis-ci.org/soluml/SweatMap)

Take in a series of UTF-8 strings and map them to UTF-8 strings that are as small as possible while still being unique.

###Why?
The motivation behind SweatMap was to take semantic CSS Identifiers (e.g. for selectors) and make them as small as possible at build time. With new tools that can take advantage of CSS Modules all we needed was something to map our current class names to something smaller.

##Installation
`npm install sweatmap --save`

##How to use
*SweatMap uses a few ES6 features that may not be present in your Node/Browser depending on the version.*
These include: `Array.fill`, `Object.assign`, `Object.freeze`, and `Object.keys`

* **Constructor(obj):**

  *Takes in an object with up to three optional properties:*
  * *cssSafe [default `false`]:* `true` disallows characters that aren't safe for [CSS Identifiers](https://www.w3.org/TR/CSS2/syndata.html#characters).
  * *additional_ranges [[`object`](https://github.com/soluml/SweatMap/blob/master/node/sweatmap.js#L27)]:* An object where the key is a "range name" and the value is an object with a start character point and an end character point. You can set null to either start or end to remove a character range.
  * *existing_strings [default `{}`]:* Pass in an object of strings that you don't want changed. Key is the original name, value is the name that should be used.

* **bytes(string):** Returns a byte count of the string passed in.
* **size():** Returns number of entries in the map.
* **cssSafeString(string):** Determines if the string is a safe [CSS Identifier](https://www.w3.org/TR/CSS2/syndata.html#characters).
* **set(string):** Returns an obfuscated UTF-8 string that's unique to all strings in the map.
* **delete(key):** Removes the string from the map.
* **clear():** Empties the map.
* **clear():** Empties the map.
* **entries():** Returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
* **get(key):** Returns the value for a given key.
* **get_obfuscated(value):** Returns the key for a given value.
* **has(key):** Returns true/false if a key exists in the map.
* **has_obfuscated(value):** Returns true/false if a value exists in the map.
