/**
 * A range of UTF-16 code units, given as hexadecimal strings (e.g. `"0041"`).
 * Set `start` or `end` to `null` to remove a range, including a default one.
 */
export interface CharacterRange {
  /** First code unit in the range, in hex. */
  start?: string | null | undefined;
  /** Last code unit in the range, in hex. */
  end?: string | null | undefined;
}

export interface SweatMapOptions {
  /**
   * Only generate values that are valid
   * [CSS identifiers](https://www.w3.org/TR/CSS2/syndata.html#characters).
   * Defaults to `false`.
   */
  cssSafe?: boolean | undefined;
  /**
   * Character ranges to add to, or override, the defaults, keyed by range name.
   */
  additional_ranges?: Readonly<Record<string, CharacterRange>> | undefined;
  /**
   * Mappings that should not change. Key is the original string, value is the
   * string to use for it.
   */
  existing_strings?: Readonly<Record<string, string>> | undefined;
}

//Default Ranges
const DEFAULT_RANGES: Readonly<Record<string, CharacterRange>> = {
  //http://jrgraphix.net/research/unicode_blocks.php
  //https://www.cs.tut.fi/~jkorpela/ucs.html8
  //http://en.wikipedia.org/wiki/List_of_Unicode_characters
  "Basic Latin": { start: "0020", end: "007F" },
  "Latin-1 Supplement": { start: "00A0", end: "00FF" },
  "Latin Extended-A": { start: "0100", end: "017F" },
  "Latin Extended-B": { start: "0180", end: "024F" },
  "IPA Extensions": { start: "0250", end: "02AF" },
  "Spacing Modifier Letters": { start: "02B0", end: "02FF" },
  "Combining Diacritical Marks": { start: "0300", end: "036F" },
  "Greek and Coptic": { start: "0370", end: "03FF" },
  Cyrillic: { start: "0400", end: "04FF" },
  "Cyrillic Supplementary": { start: "0500", end: "052F" },
  Armenian: { start: "0530", end: "058F" },
  Hebrew: { start: "0590", end: "05FF" },
  Arabic: { start: "0600", end: "06FF" },
  Syriac: { start: "0700", end: "074F" },
  Thaana: { start: "0780", end: "07BF" },
  Devanagari: { start: "0900", end: "097F" },
  Bengali: { start: "0980", end: "09FF" },
  Gurmukhi: { start: "0A00", end: "0A7F" },
  Gujarati: { start: "0A80", end: "0AFF" },
  Oriya: { start: "0B00", end: "0B7F" },
  Tamil: { start: "0B80", end: "0BFF" },
  Telugu: { start: "0C00", end: "0C7F" },
  Kannada: { start: "0C80", end: "0CFF" },
  Malayalam: { start: "0D00", end: "0D7F" },
  Sinhala: { start: "0D80", end: "0DFF" },
  Thai: { start: "0E00", end: "0E7F" },
  Lao: { start: "0E80", end: "0EFF" },
  Tibetan: { start: "0F00", end: "0FFF" },
  Myanmar: { start: "1000", end: "109F" },
  Georgian: { start: "10A0", end: "10FF" },
  "Hangul Jamo": { start: "1100", end: "11FF" },
  Ethiopic: { start: "1200", end: "137F" },
  Cherokee: { start: "13A0", end: "13FF" },
  "Unified Canadian Aboriginal Syllabics": { start: "1400", end: "167F" },
  Ogham: { start: "1680", end: "169F" },
  Runic: { start: "16A0", end: "16FF" },
  Tagalog: { start: "1700", end: "171F" },
  Hanunoo: { start: "1720", end: "173F" },
  Buhid: { start: "1740", end: "175F" },
  Tagbanwa: { start: "1760", end: "177F" },
  Khmer: { start: "1780", end: "17FF" },
  Mongolian: { start: "1800", end: "18AF" },
  Limbu: { start: "1900", end: "194F" },
  "Tai Le": { start: "1950", end: "197F" },
  "Khmer Symbols": { start: "19E0", end: "19FF" },
  "Phonetic Extensions": { start: "1D00", end: "1D7F" },
  "Latin Extended Additional": { start: "1E00", end: "1EFF" },
  "Greek Extended": { start: "1F00", end: "1FFF" },
  "General Punctuation": { start: "2000", end: "206F" },
  "Superscripts and Subscripts": { start: "2070", end: "209F" },
  "Currency Symbols": { start: "20A0", end: "20CF" },
  "Combining Diacritical Marks for Symbols": {
    start: "20D0",
    end: "20FF",
  },
  "Letterlike Symbols": { start: "2100", end: "214F" },
  "Number Forms": { start: "2150", end: "218F" },
  Arrows: { start: "2190", end: "21FF" },
  "Mathematical Operators": { start: "2200", end: "22FF" },
  "Miscellaneous Technical": { start: "2300", end: "23FF" },
  "Control Pictures": { start: "2400", end: "243F" },
  "Optical Character Recognition": { start: "2440", end: "245F" },
  "Enclosed Alphanumerics": { start: "2460", end: "24FF" },
  "Box Drawing": { start: "2500", end: "257F" },
  "Block Elements": { start: "2580", end: "259F" },
  "Geometric Shapes": { start: "25A0", end: "25FF" },
  "Miscellaneous Symbols": { start: "2600", end: "26FF" },
  Dingbats: { start: "2700", end: "27BF" },
  "Miscellaneous Mathematical Symbols-A": { start: "27C0", end: "27EF" },
  "Supplemental Arrows-A": { start: "27F0", end: "27FF" },
  "Braille Patterns": { start: "2800", end: "28FF" },
  "Supplemental Arrows-B": { start: "2900", end: "297F" },
  "Miscellaneous Mathematical Symbols-B": { start: "2980", end: "29FF" },
  "Supplemental Mathematical Operators": { start: "2A00", end: "2AFF" },
  "Miscellaneous Symbols and Arrows": { start: "2B00", end: "2BFF" },
  "CJK Radicals Supplement": { start: "2E80", end: "2EFF" },
  "Kangxi Radicals": { start: "2F00", end: "2FDF" },
  "Ideographic Description Characters": { start: "2FF0", end: "2FFF" },
  "CJK Symbols and Punctuation": { start: "3000", end: "303F" },
  Hiragana: { start: "3040", end: "309F" },
  Katakana: { start: "30A0", end: "30FF" },
  Bopomofo: { start: "3100", end: "312F" },
  "Hangul Compatibility Jamo": { start: "3130", end: "318F" },
  Kanbun: { start: "3190", end: "319F" },
  "Bopomofo Extended": { start: "31A0", end: "31BF" },
  "Katakana Phonetic Extensions": { start: "31F0", end: "31FF" },
  "Enclosed CJK Letters and Months": { start: "3200", end: "32FF" },
  "CJK Compatibility": { start: "3300", end: "33FF" },
  "CJK Unified Ideographs Extension A": { start: "3400", end: "4DBF" },
  "Yijing Hexagram Symbols": { start: "4DC0", end: "4DFF" },
  "CJK Unified Ideographs": { start: "4E00", end: "9FFF" },
  "Yi Syllables": { start: "A000", end: "A48F" },
  "Yi Radicals": { start: "A490", end: "A4CF" },
  "Hangul Syllables": { start: "AC00", end: "D7AF" },
  "High Surrogates": { start: "D800", end: "DB7F" },
  "High Private Use Surrogates": { start: "DB80", end: "DBFF" },
  "Low Surrogates": { start: "DC00", end: "DFFF" },
  "Private Use Area": { start: "E000", end: "F8FF" },
  "CJK Compatibility Ideographs": { start: "F900", end: "FAFF" },
  "Alphabetic Presentation Forms": { start: "FB00", end: "FB4F" },
  "Arabic Presentation Forms-A": { start: "FB50", end: "FDFF" },
  "Variation Selectors": { start: "FE00", end: "FE0F" },
  "Combining Half Marks": { start: "FE20", end: "FE2F" },
  "CJK Compatibility Forms": { start: "FE30", end: "FE4F" },
  "Small Form Variants": { start: "FE50", end: "FE6F" },
  "Arabic Presentation Forms-B": { start: "FE70", end: "FEFF" },
  "Halfwidth and Fullwidth Forms": { start: "FF00", end: "FFEF" },
  Specials: { start: "FFF0", end: "FFFF" },
};

/**
 * Maps strings to UTF-8 strings that are as small as possible while still
 * being unique, e.g. for shortening CSS class names at build time.
 *
 * @example
 * const myMap = new SweatMap({ cssSafe: true });
 *
 * myMap.set("my-semantic-class-name"); // "A"
 */
export default class SweatMap {
  //Adhere to CSS class/id rules -> https://www.w3.org/TR/CSS2/syndata.html#characters
  //Does not yet work with escaped characters or ISO 10646 characters as a numeric code
  readonly #cssSafe: boolean;

  //Map containing original string to obfuscated string values
  readonly #fmap = new Map<string, string>();

  //Map containing obfuscated string to original string values
  readonly #rmap = new Map<string, string>();

  //Available characters keyed by number of bytes
  readonly #characters: ReadonlyMap<number, readonly string[]>;

  constructor(options: SweatMapOptions = {}) {
    this.#cssSafe = options.cssSafe ?? false;

    const ranges = { ...DEFAULT_RANGES, ...options.additional_ranges };

    //Add existing strings to map. Values are checked at runtime for JavaScript callers.
    const existingStrings: Readonly<Record<string, unknown>> = options.existing_strings ?? {};

    for (const [key, value] of Object.entries(existingStrings)) {
      if (typeof value == "string") {
        this.#fmap.set(key, value);
        this.#rmap.set(value, key);
      }
    }

    //Build chars array.
    const characters = new Map<number, string[]>();

    for (const { start, end } of Object.values(ranges)) {
      if (start == null || end == null) continue;

      for (let i = parseInt(start, 16); i <= parseInt(end, 16); i++) {
        try {
          const char = String.fromCharCode(i);
          const bytes = this.bytes(char);
          const chars = characters.get(bytes);

          if (chars) chars.push(char);
          else characters.set(bytes, [char]);
        } catch {
          //Character contains lone surrogates, should be avoided -> https://mathiasbynens.be/notes/javascript-unicode
        }
      }
    }

    //Removes duplicate chars in the array
    this.#characters = new Map(
      Array.from(characters, ([bytes, chars]) => [bytes, Array.from(new Set(chars))]),
    );
  }

  /**
   * Whether generated values are restricted to valid
   * [CSS identifiers](https://www.w3.org/TR/CSS2/syndata.html#characters).
   */
  get cssSafe(): boolean {
    return this.#cssSafe;
  }

  /**
   * Counts the bytes in a string when encoded as UTF-8.
   *
   * @throws {URIError} If `str` contains a lone surrogate.
   */
  bytes(str: string): number {
    //encodeURI escapes each byte of a non-ASCII character (and "%" itself) as %XX
    return encodeURI(str).replace(/%[0-9A-F]{2}/g, "%").length;
  }

  /**
   * Checks whether a string is a valid
   * [CSS identifier](https://www.w3.org/TR/CSS2/syndata.html#characters).
   * Escaped characters are not supported.
   */
  cssSafeString(str: string): boolean {
    //https://www.w3.org/TR/CSS2/syndata.html#characters
    //Does not yet work with escaped characters or ISO 10646 characters as a numeric code
    if (
      /^[0-9]/.test(str) ||
      /^--/.test(str) ||
      /^-[0-9]/.test(str) ||
      /^-$/.test(str) ||
      !/^[-_a-zA-Z0-9\u00A0-\uFFFF]+$/.test(str)
    )
      return false;

    return true;
  }

  /**
   * Returns the number of entries in the map.
   */
  size(): number {
    return this.#fmap.size && this.#rmap.size;
  }

  //Lists every way to build a value of the given byte length, as one character list per position
  #generatePatternForBytes(bytes: number): (readonly string[])[][] {
    // Find all the different possible combinations of sums
    const calculateSumCombinations = (n: number): number[][] => {
      const possibleSums: number[][] = [];
      let subset: number[] = [];

      // Our subset sum function for finding possible sums combinations for our target value
      const subsetSum = (subset: number[], target: number, partial: number[] = []): void => {
        const s = partial.reduce((a, b) => a + b, 0);

        if (s === target) possibleSums.push(partial);
        else if (s >= target) return;

        subset.forEach((num) => {
          subsetSum(subset.slice(1), target, partial.concat(num));
        });
      };

      // Create our subset
      for (let i = 1; i <= n; i++) {
        // Adding max duplicates of each number to simplify the logic
        // It also has the benefit of not needing to calculate permutations separately once we remove duplicates
        subset = subset.concat(new Array<number>(n).fill(i));
      }

      subsetSum(subset, n);

      return possibleSums;
    };

    //Remove duplicate patterns, keeping the first occurrence of each
    const uniquePatterns = new Map(
      calculateSumCombinations(bytes).map((pattern) => [pattern.join(), pattern]),
    );

    const patterns: (readonly string[])[][] = [];

    for (const pattern of uniquePatterns.values()) {
      const charlists = pattern.map((val) => this.#characters.get(val));

      //Skip patterns that need a byte length with no available characters
      if (charlists.every((charlist) => charlist !== undefined)) patterns.push(charlists);
    }

    return patterns;
  }

  /**
   * Returns the obfuscated value for a key, generating and storing the
   * shortest unused value if the key is new.
   *
   * @throws {Error} If `key` is not a string, or is an empty string.
   */
  set(key: string): string {
    //If it's already been done, don't do it again!
    const existing = this.#fmap.get(key);

    if (existing !== undefined) return existing;

    //If the key is not a string, throw an error. Checked at runtime for JavaScript callers.
    if (typeof (key as unknown) != "string" || key === "")
      throw new Error("SweatMap keys must be strings.");

    //Empty values are never good, since has_obfuscated("") is true
    const isGoodValue = (value: string): boolean =>
      !this.has_obfuscated(value) && (!this.#cssSafe || this.cssSafeString(value));

    let bytes = 0; //Determines what patterns to try
    let value = ""; //The obfuscated UTF-8 String

    do {
      //Increment the bytes to look at new patterns
      bytes++;

      //Try each possible pattern until a good value is found
      for (const currentPattern of this.#generatePatternForBytes(bytes)) {
        if (isGoodValue(value)) break;

        //Array of counters, one for each charlist
        const currentPatternCounters = currentPattern.map(() => 0);

        //Last possible match
        const lastMatch = currentPattern.map((charlist) => charlist.at(-1)).join("");

        //Loop through the all charlists trying all combinations before giving up.
        while (!isGoodValue(value) && lastMatch !== value) {
          //Take the next character from each charlist
          value = currentPattern
            .map((charlist, i) => charlist[currentPatternCounters[i] ?? 0])
            .join("");

          //Increment Counters
          for (const [i, charlist] of currentPattern.entries()) {
            const counter = (currentPatternCounters[i] ?? 0) + 1;

            currentPatternCounters[i] = counter;

            //If the current counter is less than or equal to the total number of chars in this charlist, you don't need to increment anymore
            if (counter <= charlist.length) {
              //If it's equal and there are more charlists
              if (counter === charlist.length && i < currentPattern.length - 1) {
                currentPatternCounters[i] = 0;
                continue;
              }

              break;
            }
          }
        }
      }
    } while (!isGoodValue(value));

    //Set maps
    this.#fmap.set(key, value);
    this.#rmap.set(value, key);

    return value;
  }

  /**
   * Removes a key and its obfuscated value from the map.
   */
  delete(key: string): void {
    const value = this.#fmap.get(key);

    if (value !== undefined) {
      this.#fmap.delete(key);
      this.#rmap.delete(value);
    }
  }

  /**
   * Removes every entry from the map.
   */
  clear(): void {
    this.#fmap.clear();
    this.#rmap.clear();
  }

  /**
   * Returns an iterator of `[key, value]` pairs in insertion order.
   */
  entries(): IterableIterator<[string, string]> {
    return this.#fmap.entries();
  }

  /**
   * Returns the obfuscated value for a key.
   */
  get(key: string): string | undefined {
    return this.#fmap.get(key);
  }

  /**
   * Returns the original key for an obfuscated value.
   */
  get_obfuscated(value: string): string | undefined {
    return this.#rmap.get(value);
  }

  /**
   * Checks whether a key is in the map. Empty keys always return `true`.
   */
  has(key: string): boolean {
    if (!key) return true;

    return this.#fmap.has(key);
  }

  /**
   * Checks whether an obfuscated value is in the map. Empty values always
   * return `true`.
   */
  has_obfuscated(value: string): boolean {
    if (!value) return true;

    return this.#rmap.has(value);
  }
}

//Lets CommonJS consumers keep using `const SweatMap = require("sweatmap")`
export { SweatMap as "module.exports" };
