import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { inspect } from "node:util";
import SweatMap from "../src/sweatmap.ts";

//Returns how many values of each byte length the map generates for `count` new keys
const byteLengths = (myMap: SweatMap, count: number): Record<number, number> => {
  const lengths: Record<number, number> = {};

  for (let i = 0; i < count; i++) {
    const bytes = myMap.bytes(myMap.set(`string${String(i)}`));

    lengths[bytes] = (lengths[bytes] ?? 0) + 1;
  }

  return lengths;
};

describe("SweatMap", function () {
  describe("#constructor(existing_strings, additional_ranges)", function () {
    it("Default character limits:", function () {
      const myMap = new SweatMap();

      //Basic Latin(96)[A] == 96
      assert.deepEqual(byteLengths(myMap, 97), { 1: 96, 2: 1 });
    });

    it("Can pass in existing UTF-8 String key/values:", function () {
      const myMap = new SweatMap({
        existing_strings: {
          SafeString: "Whatever",
          "☃": "�",
          // @ts-expect-error - JavaScript callers can pass non-string values, which are ignored
          Ignored: {},
        },
      });

      assert.equal(myMap.get("SafeString"), "Whatever");
      assert.equal(myMap.get("☃"), "�");
      assert.equal(myMap.get("Ignored"), undefined);

      assert.equal(myMap.get_obfuscated("Whatever"), "SafeString");
      assert.equal(myMap.get_obfuscated("�"), "☃");
    });

    it("Can pass in adjusted character ranges:", function () {
      const myMap = new SweatMap({
        additional_ranges: {
          "A-P": { start: "41", end: "50" }, //Add A-Z
          "A-Z": { start: "41", end: "5A" }, //Any non-unique chars are filtered out!
          "a-z": { start: "61", end: "7A" }, //Add a-z
          "Basic Latin": { end: null }, //Removes Basic Latin
        },
      });

      //(A-Z + a-z)(52)[A] == 52
      assert.deepEqual(byteLengths(myMap, 53), { 1: 52, 2: 1 });
    });

    it("Skips byte lengths with no available characters:", function () {
      const myMap = new SweatMap({
        additional_ranges: {
          "Basic Latin": { start: "61", end: "7A" }, //Only a-z
          //Remove every default range with 2 byte characters
          "Latin-1 Supplement": { end: null },
          "Latin Extended-A": { end: null },
          "Latin Extended-B": { end: null },
          "IPA Extensions": { end: null },
          "Spacing Modifier Letters": { end: null },
          "Combining Diacritical Marks": { end: null },
          "Greek and Coptic": { end: null },
          Cyrillic: { end: null },
          "Cyrillic Supplementary": { end: null },
          Armenian: { end: null },
          Hebrew: { end: null },
          Arabic: { end: null },
          Syriac: { end: null },
          Thaana: { end: null },
        },
      });

      //(26)[A] + (26*26)[AA] == 702, then 3 bytes since there is no [B]
      assert.deepEqual(byteLengths(myMap, 703), { 1: 26, 2: 676, 3: 1 });
    });

    it("Internal state is not exposed:", function () {
      const myMap = new SweatMap({ cssSafe: true });

      myMap.set("A-String");

      assert.deepEqual(Object.keys(myMap), []);
    });

    it("No default entries:", function () {
      const myMap = new SweatMap();

      assert.equal(myMap.size(), 0);
      assert.deepEqual(myMap.entries().next(), {
        value: undefined,
        done: true,
      });
    });

    it("Can set CSS Safe Mode:", function () {
      const myMap = new SweatMap();
      const myCssSafeMap = new SweatMap({ cssSafe: true });

      //Basic Latin starts with a space, which isn't CSS safe
      assert.equal(myMap.set("string"), " ");
      assert.equal(myCssSafeMap.set("string"), "A");
    });

    it("Exposes CSS Safe Mode as read-only:", function () {
      const myMap = new SweatMap();
      const myCssSafeMap = new SweatMap({ cssSafe: true });

      assert.equal(myMap.cssSafe, false);
      assert.equal(myCssSafeMap.cssSafe, true);

      assert.throws(() => {
        // @ts-expect-error - cssSafe is read-only
        myCssSafeMap.cssSafe = false;
      }, TypeError);
      assert.equal(myCssSafeMap.cssSafe, true);
    });
  });

  describe("bytes(str)", function () {
    it("Returns bytes for a given string:", function () {
      const myMap = new SweatMap();

      assert.equal(myMap.bytes("a"), 1);
      assert.equal(myMap.bytes("aA"), 2);
      assert.equal(myMap.bytes("×"), 2);
      assert.equal(myMap.bytes("×ø×ø!"), 9);
      assert.equal(myMap.bytes("☃"), 3);
      assert.equal(myMap.bytes("�bb☃"), 8);
      assert.equal(myMap.bytes("%20%"), 4);
      assert.equal(myMap.bytes("😀"), 4);
    });

    it("Throws for lone surrogates:", function () {
      const myMap = new SweatMap();

      assert.throws(() => myMap.bytes("\uD800"), URIError);
    });
  });

  describe("size(str)", function () {
    it("Returns size of map:", function () {
      const myMap = new SweatMap();

      assert.equal(myMap.size(), 0);
      myMap.set("aA");
      myMap.set("×");
      myMap.set("×ø×ø!");
      myMap.set("☃");
      myMap.set("�bb☃");
      assert.equal(myMap.size(), 5);
    });
  });

  describe("cssSafeString(str)", function () {
    it("Determines if a string is a valid css identifier (e.g. class/id):", function () {
      const myMap = new SweatMap();

      assert.equal(myMap.cssSafeString("a"), true);
      assert.equal(myMap.cssSafeString("*"), false);
      assert.equal(myMap.cssSafeString("--"), false);
      assert.equal(myMap.cssSafeString("-"), false);
      assert.equal(myMap.cssSafeString("-8"), false);
      assert.equal(myMap.cssSafeString("a-8"), true);
      assert.equal(myMap.cssSafeString("�"), true);
      assert.equal(myMap.cssSafeString("8a"), false);
      assert.equal(myMap.cssSafeString("a8"), true);
    });
  });

  describe("set(key)", function () {
    let myMap: SweatMap;

    beforeEach(function () {
      myMap = new SweatMap({
        additional_ranges: {
          "A-Z": { start: "41", end: "5A" }, //Add A-Z
          "a-z": { start: "61", end: "7A" }, //Add a-z
          "Basic Latin": { end: null }, //Removes Basic Latin
        },
      });
    });

    it("Returns the same obfuscated value given the same key:", function () {
      const str1 = myMap.set("string");
      const str2 = myMap.set("string");

      assert.equal(str1, str2);
    });

    it("Returns an error if the key is not a string:", function () {
      for (const key of [{}, 0, [], function () {}, true, null]) {
        assert.throws(
          () => {
            // @ts-expect-error - JavaScript callers can pass non-string keys
            myMap.set(key);
          },
          Error,
          `${inspect(key)} is not a string`,
        );
      }
    });

    it("Returns an error if the key is an empty string:", function () {
      assert.throws(
        () => {
          myMap.set("");
        },
        Error,
        '"" is an empty string',
      );
    });

    it("Obfuscates the given keys correctly:", { timeout: 60000 }, function () {
      //(52)[A] == 52
      //(^)[A] + (52*52)[AA] + (1776)[B] == 4532
      //(^)[A][AA][B] + (52*52*52)[AAA] + (1776*52)[BA] + (52*1776)[AB] + (57440)[C] ==   4532 + 140608 + 92532 + 92352 + 57440 == 387644
      assert.deepEqual(byteLengths(myMap, 5000), { 1: 52, 2: 4480, 3: 468 });
    });

    it("Obfuscates the given keys correctly (CSS Safe):", { timeout: 60000 }, function () {
      const myOtherMap = new SweatMap({ cssSafe: true });

      // a-z(26) + A-Z(26) + _(1)
      //(53)[A]+ (54*64-11{--, -\d})[AA] + (1776)[B] == 5274
      assert.deepEqual(byteLengths(myOtherMap, 5300), { 1: 53, 2: 5221, 3: 26 });
    });

    it("Generates many unique CSS safe values quickly:", { timeout: 5000 }, function () {
      const myCssSafeMap = new SweatMap({ cssSafe: true });
      const values = new Set<string>();

      for (let i = 0; i < 100_000; i++) values.add(myCssSafeMap.set(`string${String(i)}`));

      assert.equal(values.size, 100_000);
      assert.ok([...values].every((value) => myCssSafeMap.cssSafeString(value)));
    });

    it("Reuses the smallest freed value after delete() and clear():", function () {
      const myCssSafeMap = new SweatMap({ cssSafe: true });

      assert.equal(myCssSafeMap.set("a"), "A");
      assert.equal(myCssSafeMap.set("b"), "B");
      assert.equal(myCssSafeMap.set("c"), "C");

      myCssSafeMap.delete("c");
      myCssSafeMap.delete("a");
      assert.equal(myCssSafeMap.set("d"), "A");
      assert.equal(myCssSafeMap.set("e"), "C");
      assert.equal(myCssSafeMap.set("f"), "D");

      myCssSafeMap.clear();
      assert.equal(myCssSafeMap.set("g"), "A");
    });

    it("Skips values passed in as existing strings:", function () {
      const myCssSafeMap = new SweatMap({ cssSafe: true, existing_strings: { kept: "B" } });

      assert.equal(myCssSafeMap.set("a"), "A");
      assert.equal(myCssSafeMap.set("b"), "C");
    });
  });

  describe("delete(key)", function () {
    it("Deletes a key and its obfuscated value:", function () {
      const myMap = new SweatMap();

      const astr = myMap.set("A-String");
      const bstr = myMap.set("B-String");

      assert.equal(myMap.has("A-String"), true);
      assert.equal(myMap.has("B-String"), true);
      assert.equal(myMap.has_obfuscated(astr), true);
      assert.equal(myMap.has_obfuscated(bstr), true);

      myMap.delete("B-String");
      assert.equal(myMap.has("A-String"), true);
      assert.equal(myMap.has("B-String"), false);
      assert.equal(myMap.has_obfuscated(astr), true);
      assert.equal(myMap.has_obfuscated(bstr), false);

      myMap.delete("A-String");
      assert.equal(myMap.has("A-String"), false);
      assert.equal(myMap.has("B-String"), false);
      assert.equal(myMap.has_obfuscated(astr), false);
      assert.equal(myMap.has_obfuscated(bstr), false);
    });
  });

  describe("clear()", function () {
    it("Clears all keys and obfuscated values:", function () {
      const myMap = new SweatMap();

      const astr = myMap.set("A-String");
      const bstr = myMap.set("B-String");

      assert.equal(myMap.has("A-String"), true);
      assert.equal(myMap.has("B-String"), true);
      assert.equal(myMap.has_obfuscated(astr), true);
      assert.equal(myMap.has_obfuscated(bstr), true);

      myMap.clear();
      assert.equal(myMap.has("A-String"), false);
      assert.equal(myMap.has("B-String"), false);
      assert.equal(myMap.has_obfuscated(astr), false);
      assert.equal(myMap.has_obfuscated(bstr), false);
      assert.equal(myMap.size(), 0);
    });
  });

  describe("entries()", function () {
    it("Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order:", function () {
      const myMap = new SweatMap();

      const astr = myMap.set("A-String");
      const bstr = myMap.set("B-String");

      assert.deepEqual(
        [...myMap.entries()],
        [
          ["A-String", astr],
          ["B-String", bstr],
        ],
      );
    });
  });

  describe("get(key)", function () {
    it("Get values from the map:", function () {
      const myMap = new SweatMap();

      const astr = myMap.set("A-String");

      assert.equal(myMap.get("A-String"), astr);
      assert.equal(myMap.get("B-String"), undefined);
    });
  });

  describe("get_obfuscated(value)", function () {
    it("Get keys from the map:", function () {
      const myMap = new SweatMap();

      const astr = myMap.set("A-String");

      assert.equal(myMap.get_obfuscated(astr), "A-String");
      assert.equal(myMap.get_obfuscated("not-a-value"), undefined);
    });
  });

  describe("has(key)", function () {
    it("Can see if it has a key in the map:", function () {
      const myMap = new SweatMap();

      myMap.set("A-String");
      assert.equal(myMap.has("A-String"), true);

      myMap.delete("A-String");
      assert.equal(myMap.has("A-String"), false);
    });
  });

  describe("has_obfuscated(value)", function () {
    it("Can see if it has a value in the map:", function () {
      const myMap = new SweatMap();

      const astr = myMap.set("A-String");
      assert.equal(myMap.has_obfuscated(astr), true);

      myMap.delete("A-String");
      assert.equal(myMap.has_obfuscated(astr), false);
    });
  });
});
