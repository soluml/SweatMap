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
   * Character ranges to use instead of the defaults, keyed by range name.
   * `additional_ranges` still adds to, or overrides, these.
   */
  ranges?: Readonly<Record<string, CharacterRange>> | undefined;
  /**
   * Character ranges to add to, or override, the defaults (or `ranges`),
   * keyed by range name.
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

//Code points that take each number of bytes in UTF-8, within the 16-bit range String.fromCharCode() covers
const UTF8_BYTE_RANGES: ReadonlyMap<number, readonly [number, number]> = new Map([
  [1, [0x0000, 0x007f]],
  [2, [0x0080, 0x07ff]],
  [3, [0x0800, 0xffff]],
]);

//https://www.w3.org/TR/CSS2/syndata.html#characters
//Can't start with a digit, "--" or "-" and a digit, or be just "-"
//Does not yet work with escaped characters or ISO 10646 characters as a numeric code
const CSS_IDENTIFIER = /^(?!-?[0-9]|--|-$)[-_a-zA-Z0-9\u00A0-\uFFFF]+$/;

//A single character that can appear somewhere in a CSS identifier
const CSS_CHARACTER = /^[-_a-zA-Z0-9\u00A0-\uFFFF]$/;

const isLowSurrogate = (code: number): boolean => code >= 0xdc00 && code <= 0xdfff;

//Character lists built from the default ranges, shared by every instance that doesn't add its own
const defaultCharlists = new Map<number, string>();
const defaultCssSafeCharlists = new Map<number, string>();

const compositionsCache = new Map<number, readonly (readonly number[])[]>();

//Every way to split a byte length into per-character byte lengths of 1-3, in order,
//e.g. 3 -> [1, 1, 1], [1, 2], [2, 1], [3]
const compositions = (bytes: number): readonly (readonly number[])[] => {
  if (bytes === 0) return [[]];

  let cached = compositionsCache.get(bytes);

  if (cached === undefined) {
    const result: number[][] = [];

    for (let first = 1; first <= Math.min(bytes, 3); first++) {
      for (const rest of compositions(bytes - first)) result.push([first, ...rest]);
    }

    cached = result;
    compositionsCache.set(bytes, cached);
  }

  return cached;
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
  readonly #cssSafe: boolean;

  //Map containing original string to obfuscated string values
  readonly #fmap = new Map<string, string>();

  //Map containing obfuscated string to original string values
  readonly #rmap = new Map<string, string>();

  //Character ranges as [start, end] code points
  readonly #ranges: readonly (readonly [number, number])[];

  //Available characters keyed by number of bytes, each list as one string. Built when first needed.
  readonly #charlists: Map<number, string>;

  //Where the search for the next value continues from. Restarted by delete() and clear() so freed values are reused.
  #candidates: Iterator<string, never>;

  constructor(options: SweatMapOptions = {}) {
    this.#cssSafe = options.cssSafe ?? false;

    this.#ranges = Object.values({
      ...(options.ranges ?? DEFAULT_RANGES),
      ...options.additional_ranges,
    }).flatMap(({ start, end }) =>
      start == null || end == null ? [] : [[parseInt(start, 16), parseInt(end, 16)] as const],
    );

    if (options.ranges || options.additional_ranges) this.#charlists = new Map();
    else this.#charlists = this.#cssSafe ? defaultCssSafeCharlists : defaultCharlists;

    //Add existing strings to map. Values are checked at runtime for JavaScript callers.
    const existingStrings: Readonly<Record<string, unknown>> = options.existing_strings ?? {};

    for (const [key, value] of Object.entries(existingStrings)) {
      if (typeof value == "string") {
        this.#fmap.set(key, value);
        this.#rmap.set(value, key);
      }
    }

    this.#candidates = this.#generateCandidates();
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
    let bytes = 0;

    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);

      if (code < 0x80) bytes += 1;
      else if (code < 0x800) bytes += 2;
      else if (code < 0xd800 || code > 0xdfff) bytes += 3;
      else if (code <= 0xdbff && isLowSurrogate(str.charCodeAt(i + 1))) {
        //A surrogate pair is one 4 byte character
        bytes += 4;
        i++;
      } else throw new URIError("Lone surrogates can't be encoded as UTF-8.");
    }

    return bytes;
  }

  /**
   * Checks whether a string is a valid
   * [CSS identifier](https://www.w3.org/TR/CSS2/syndata.html#characters).
   * Escaped characters are not supported.
   */
  cssSafeString(str: string): boolean {
    return CSS_IDENTIFIER.test(str);
  }

  /**
   * Returns the number of entries in the map.
   */
  size(): number {
    return this.#fmap.size && this.#rmap.size;
  }

  //Returns every available character of the given byte length, in range order without duplicates
  #charlist(bytes: number): string {
    let charlist = this.#charlists.get(bytes);

    if (charlist === undefined) {
      const chars = new Set<string>();
      const [min, max] = UTF8_BYTE_RANGES.get(bytes) ?? [1, 0];

      for (const [start, end] of this.#ranges) {
        for (let i = Math.max(start, min); i <= Math.min(end, max); i++) {
          //Lone surrogates can't be encoded, should be avoided -> https://mathiasbynens.be/notes/javascript-unicode
          if (i >= 0xd800 && i <= 0xdfff) continue;

          const char = String.fromCharCode(i);

          //In CSS safe mode, any value containing an unsafe character would be rejected anyway
          if (!this.#cssSafe || CSS_CHARACTER.test(char)) chars.add(char);
        }
      }

      charlist = Array.from(chars).join("");
      this.#charlists.set(bytes, charlist);
    }

    return charlist;
  }

  //Yields every possible value in the order they should be used: fewest bytes first, then by
  //pattern of character byte lengths, then with the first character changing fastest
  *#generateCandidates(): Generator<string, never> {
    //Checked in order so longer character lists are only built if the shorter ones are empty
    if (this.#charlist(1) === "" && this.#charlist(2) === "" && this.#charlist(3) === "")
      throw new Error("SweatMap has no characters to generate values from.");

    for (let bytes = 1; ; bytes++) {
      for (const pattern of compositions(bytes)) {
        const charlists = pattern.map((charBytes) => this.#charlist(charBytes));

        //Skip patterns that need a byte length with no available characters
        if (charlists.includes("")) continue;

        const total = charlists.reduce((count, charlist) => count * charlist.length, 1);

        for (let index = 0; index < total; index++) {
          let value = "";
          let rest = index;

          for (const charlist of charlists) {
            value += charlist.charAt(rest % charlist.length);
            rest = Math.floor(rest / charlist.length);
          }

          yield value;
        }
      }
    }
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

    //Continue the search from the last value handed out, since every earlier candidate is taken or unsafe
    for (;;) {
      const { value } = this.#candidates.next();

      if (!this.has_obfuscated(value) && (!this.#cssSafe || this.cssSafeString(value))) {
        this.#fmap.set(key, value);
        this.#rmap.set(value, key);

        return value;
      }
    }
  }

  /**
   * Removes a key and its obfuscated value from the map.
   */
  delete(key: string): void {
    const value = this.#fmap.get(key);

    if (value !== undefined) {
      this.#fmap.delete(key);
      this.#rmap.delete(value);
      this.#candidates = this.#generateCandidates();
    }
  }

  /**
   * Removes every entry from the map.
   */
  clear(): void {
    this.#fmap.clear();
    this.#rmap.clear();
    this.#candidates = this.#generateCandidates();
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
