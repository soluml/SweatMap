'use strict';

const uniq = require('lodash.uniq');

const SweatMap = class SweatMap {
    constructor(obj) {
        obj = typeof obj == 'object' ? obj : {};
        
        //Adhere to CSS class/id rules -> https://www.w3.org/TR/CSS2/syndata.html#characters
        //Does not yet work with escaped characters or ISO 10646 characters as a numeric code
        this.cssSafe = obj.cssSafe;

        //Map containing original string to obfuscated string values
        this.fmap = new Map();
        
        //Map containing obfuscated string to original string values
        this.rmap = new Map();
        
        //Available characters keyed by number of bytes
        this.characters = {};

        //Default Ranges
        const Ranges = Object.assign({
            //http://jrgraphix.net/research/unicode_blocks.php
            //https://www.cs.tut.fi/~jkorpela/ucs.html8
            //http://en.wikipedia.org/wiki/List_of_Unicode_characters
            "Basic Latin": { start: '0020', end: '007F' },
            "Latin-1 Supplement": { start: '00A0', end: '00FF' },
            "Latin Extended-A": { start: '0100', end: '017F' },
            "Latin Extended-B": { start: '0180', end: '024F' },
            "IPA Extensions": { start: '0250', end: '02AF' },
            "Spacing Modifier Letters": { start: '02B0', end: '02FF' },
            "Combining Diacritical Marks": { start: '0300', end: '036F' },
            "Greek and Coptic": { start: '0370', end: '03FF' },
            "Cyrillic": { start: '0400', end: '04FF' },
            "Cyrillic Supplementary": { start: '0500', end: '052F' },
            "Armenian": { start: '0530', end: '058F' },
            "Hebrew": { start: '0590', end: '05FF' },
            "Arabic": { start: '0600', end: '06FF' },
            "Syriac": { start: '0700', end: '074F' },
            "Thaana": { start: '0780', end: '07BF' },
            "Devanagari": { start: '0900', end: '097F' },
            "Bengali": { start: '0980', end: '09FF' },
            "Gurmukhi": { start: '0A00', end: '0A7F' },
            "Gujarati": { start: '0A80', end: '0AFF' },
            "Oriya": { start: '0B00', end: '0B7F' },
            "Tamil": { start: '0B80', end: '0BFF' },
            "Telugu": { start: '0C00', end: '0C7F' },
            "Kannada": { start: '0C80', end: '0CFF' },
            "Malayalam": { start: '0D00', end: '0D7F' },
            "Sinhala": { start: '0D80', end: '0DFF' },
            "Thai": { start: '0E00', end: '0E7F' },
            "Lao": { start: '0E80', end: '0EFF' },
            "Tibetan": { start: '0F00', end: '0FFF' },
            "Myanmar": { start: '1000', end: '109F' },
            "Georgian": { start: '10A0', end: '10FF' },
            "Hangul Jamo": { start: '1100', end: '11FF' },
            "Ethiopic": { start: '1200', end: '137F' },
            "Cherokee": { start: '13A0', end: '13FF' },
            "Unified Canadian Aboriginal Syllabics": { start: '1400', end: '167F' },
            "Ogham": { start: '1680', end: '169F' },
            "Runic": { start: '16A0', end: '16FF' },
            "Tagalog": { start: '1700', end: '171F' },
            "Hanunoo": { start: '1720', end: '173F' },
            "Buhid": { start: '1740', end: '175F' },
            "Tagbanwa": { start: '1760', end: '177F' },
            "Khmer": { start: '1780', end: '17FF' },
            "Mongolian": { start: '1800', end: '18AF' },
            "Limbu": { start: '1900', end: '194F' },
            "Tai Le": { start: '1950', end: '197F' },
            "Khmer Symbols": { start: '19E0', end: '19FF' },
            "Phonetic Extensions": { start: '1D00', end: '1D7F' },
            "Latin Extended Additional": { start: '1E00', end: '1EFF' },
            "Greek Extended": { start: '1F00', end: '1FFF' },
            "General Punctuation": { start: '2000', end: '206F' },
            "Superscripts and Subscripts": { start: '2070', end: '209F' },
            "Currency Symbols": { start: '20A0', end: '20CF' },
            "Combining Diacritical Marks for Symbols": { start: '20D0', end: '20FF' },
            "Letterlike Symbols": { start: '2100', end: '214F' },
            "Number Forms": { start: '2150', end: '218F' },
            "Arrows": { start: '2190', end: '21FF' },
            "Mathematical Operators": { start: '2200', end: '22FF' },
            "Miscellaneous Technical": { start: '2300', end: '23FF' },
            "Control Pictures": { start: '2400', end: '243F' },
            "Optical Character Recognition": { start: '2440', end: '245F' },
            "Enclosed Alphanumerics": { start: '2460', end: '24FF' },
            "Box Drawing": { start: '2500', end: '257F' },
            "Block Elements": { start: '2580', end: '259F' },
            "Geometric Shapes": { start: '25A0', end: '25FF' },
            "Miscellaneous Symbols": { start: '2600', end: '26FF' },
            "Dingbats": { start: '2700', end: '27BF' },
            "Miscellaneous Mathematical Symbols-A": { start: '27C0', end: '27EF' },
            "Supplemental Arrows-A": { start: '27F0', end: '27FF' },
            "Braille Patterns": { start: '2800', end: '28FF' },
            "Supplemental Arrows-B": { start: '2900', end: '297F' },
            "Miscellaneous Mathematical Symbols-B": { start: '2980', end: '29FF' },
            "Supplemental Mathematical Operators": { start: '2A00', end: '2AFF' },
            "Miscellaneous Symbols and Arrows": { start: '2B00', end: '2BFF' },
            "CJK Radicals Supplement": { start: '2E80', end: '2EFF' },
            "Kangxi Radicals": { start: '2F00', end: '2FDF' },
            "Ideographic Description Characters": { start: '2FF0', end: '2FFF' },
            "CJK Symbols and Punctuation": { start: '3000', end: '303F' },
            "Hiragana": { start: '3040', end: '309F' },
            "Katakana": { start: '30A0', end: '30FF' },
            "Bopomofo": { start: '3100', end: '312F' },
            "Hangul Compatibility Jamo": { start: '3130', end: '318F' },
            "Kanbun": { start: '3190', end: '319F' },
            "Bopomofo Extended": { start: '31A0', end: '31BF' },
            "Katakana Phonetic Extensions": { start: '31F0', end: '31FF' },
            "Enclosed CJK Letters and Months": { start: '3200', end: '32FF' },
            "CJK Compatibility": { start: '3300', end: '33FF' },
            "CJK Unified Ideographs Extension A": { start: '3400', end: '4DBF' },
            "Yijing Hexagram Symbols": { start: '4DC0', end: '4DFF' },
            "CJK Unified Ideographs": { start: '4E00', end: '9FFF' },
            "Yi Syllables": { start: 'A000', end: 'A48F' },
            "Yi Radicals": { start: 'A490', end: 'A4CF' },
            "Hangul Syllables": { start: 'AC00', end: 'D7AF' },
            "High Surrogates": { start: 'D800', end: 'DB7F' },
            "High Private Use Surrogates": { start: 'DB80', end: 'DBFF' },
            "Low Surrogates": { start: 'DC00', end: 'DFFF' },
            "Private Use Area": { start: 'E000', end: 'F8FF' },
            "CJK Compatibility Ideographs": { start: 'F900', end: 'FAFF' },
            "Alphabetic Presentation Forms": { start: 'FB00', end: 'FB4F' },
            "Arabic Presentation Forms-A": { start: 'FB50', end: 'FDFF' },
            "Variation Selectors": { start: 'FE00', end: 'FE0F' },
            "Combining Half Marks": { start: 'FE20', end: 'FE2F' },
            "CJK Compatibility Forms": { start: 'FE30', end: 'FE4F' },
            "Small Form Variants": { start: 'FE50', end: 'FE6F' },
            "Arabic Presentation Forms-B": { start: 'FE70', end: 'FEFF' },
            "Halfwidth and Fullwidth Forms": { start: 'FF00', end: 'FFEF' },
            "Specials": { start: 'FFF0', end: 'FFFF' }
        }, obj.additional_ranges);
        
        //Add existing strings to map
        if(typeof obj.existing_strings == 'object') {
            Object.keys(obj.existing_strings).forEach(key => {
                if(typeof key == 'string' && typeof obj.existing_strings[key] == 'string') {
                    this.fmap.set(key, obj.existing_strings[key]);
                    this.rmap.set(obj.existing_strings[key], key);
                }
            });
        }

        //Build chars array.
        Object.keys(Ranges).forEach(CR => {
            if(Ranges[CR].start == undefined || Ranges[CR].end == undefined)
                return;
            
            for(let i = parseInt(Ranges[CR].start, 16); i <= parseInt(Ranges[CR].end, 16); i++) {
                try {
                    let char  = String.fromCharCode(i),
                        bytes = this.bytes(char);

                    if(!this.characters[bytes])
                        this.characters[bytes] = [];

                    this.characters[bytes].push(char);
                } catch(e) {
                    //Character contains lone surrogates, should be avoided -> https://mathiasbynens.be/notes/javascript-unicode
                }
            }
        });
        
        //Removes duplicate chars in the array then freeze to ensure nothing is changed
        Object.keys(this.characters).forEach(C => {
            this.characters[C] = uniq(this.characters[C]);
            Object.freeze(this.characters[C]);
        });
        
        Object.freeze(this.characters);
    }
    
    bytes(str) {
        //Determine how many bytes are in a given utf8 string -> https://gist.github.com/mathiasbynens/1010324
        return unescape(encodeURI(str)).length;
    }
    
    cssSafeString(str) {
        //https://www.w3.org/TR/CSS2/syndata.html#characters
        //Does not yet work with escaped characters or ISO 10646 characters as a numeric code
        if(/^[0-9]/.test(str) || /^\-\-/.test(str) || /^\-[0-9]/.test(str) || /^\-$/.test(str) || !/^[\-_a-zA-Z0-9\u00A0-\uFFFF]+$/.test(str))
            return false;
        
        return true;
    }

    size() {
        return this.fmap.size && this.rmap.size;
    }

    generatePatternForBytes(bytes) {
        // We will need to remove duplicate sums later
        const removeDuplicatesFromArrayOfArrays = function (array) {
            const uniqueArray = [];
            array.forEach(function (item) {
                let found = false;
                let stringified = JSON.stringify(item);

                uniqueArray.forEach(function (uniqueItem) {
                    if (JSON.stringify(uniqueItem) == stringified) {
                        found = true;
                    }
                });

                if (!found) {
                    uniqueArray.push(item);
                }
            });
            return uniqueArray;
        };

        // Find all the different possible combinations of sums
        const calculateSumCombinations = function (n) {
            let possibleSums = [];
            // Our subset sum function for finding possible sums combinations for our target value
            const subsetSum = function (subset, target, partial = []) {
                let s = partial.reduce((a, b) => a + b, 0);

                if (s === target) {
                    possibleSums.push(partial);
                } else if (s >= target) {
                    return;
                }

                subset.forEach(function (number) {
                    let remaining = subset.filter((value, index) => index > 0);
                    subsetSum(remaining, target, partial.concat(number));
                });
            };

            // Create our subset
            let subset = [];
            for (let i = 1; i <= n; i++) {
                // Adding max duplicates of each number to simplify the logic
                // It also has the benefit of not needing to calculate permutations separately once we remove duplicates
                subset = subset.concat(new Array(n).fill(i));
            }
            subsetSum(subset, n);

            return possibleSums;
        };

        // Remove all duplicate sums
        let numericPatternArray = removeDuplicatesFromArrayOfArrays(calculateSumCombinations(bytes));

        return numericPatternArray.map((pattern) => {
            return pattern.map((value) => {
               return this.characters['' + value];
            });
        });
    }

    set(key) {
        //If it's already been done, don't do it again!
        if(this.fmap.has(key))
            return this.fmap.get(key);
        
        //If the key is not a string, throw an error
        if(typeof key != 'string' || key === '')
            throw new Error('SweatMap keys must be strings.');

        const getPatterns = () => {
            return this.generatePatternForBytes(bytes);
        };
        
        const isGoodValue = value => {
            if(this.cssSafe)
                return this.cssSafeString(value) && !this.has_obfuscated(value);
            else
                return !this.has_obfuscated(value);
        };
        
        var bytes = 0, //Determines what patterns to try
            value;     //The obfuscated UTF-8 String

        do {
            //Increment the bytes to look at new patterns
            bytes++;

            //Get all possible patterns
            let patterns = getPatterns(); 
            
            //Which pattern are we are currently trying
            let patternsCounter = 0;

            while(!isGoodValue(value) && patternsCounter < patterns.length) {
                //Current pattern we're working through
                let currentPattern = patterns[patternsCounter];
                
                //Array of counters, one for each charlist
                let currentPatternCounters = currentPattern.map(() => 0);
                
                //Last possible match
                let lastMatch = currentPattern.map(charlist => charlist[charlist.length-1]).join('');

                //Loop through the all charlists trying all combinations before giving up.
                while(!isGoodValue(value) && lastMatch != value) {
                    //Reset Value
                    value = '';

                    //Add the next character from each charlist to the value
                    currentPattern.forEach((charlist, i) => {
                        value += charlist[currentPatternCounters[i]];
                    });
                    
                    //Increment Counters
                    for(let i = 0, ln = currentPatternCounters.length; i < ln; i++) {
                        currentPatternCounters[i]++;
                        
                        //If the current counter is less than or equal to the total number of chars in this charlist, you don't need to increment anymore
                        if(currentPatternCounters[i] <= currentPattern[i].length) {
                            
                            //If it's equal and there are more charlists
                            if(currentPatternCounters[i] == currentPattern[i].length && i < ln-1) {
                                currentPatternCounters[i] = 0;
                                continue;
                            }
                            
                            break;
                        }
                    }
                }

                //Go to next pattern
                patternsCounter++;
            }
        } while(!isGoodValue(value));

        //Set maps
        this.fmap.set(key, value);
        this.rmap.set(value, key);

        return value;
    }
    
    delete(key) {
        const value = this.fmap.get(key);
        
        if(value !== undefined) {
            this.fmap.delete(key);
            this.rmap.delete(value);
        }
    }
    
    clear() {
        this.fmap.clear();
        this.rmap.clear();
    }
    
    entries() {
        return this.fmap.entries();
    }
    
    get(key) {
        return this.fmap.get(key);
    }
    
    get_obfuscated(value) {
        return this.rmap.get(value);
    }
    
    has(key) {
        if(!key)
            return true;

        return this.fmap.has(key);
    }
    
    has_obfuscated(value) {
        if(!value)
            return true;

        return this.rmap.has(value);
    }
};


//Export SweatMap for Browsers ...
if(typeof window === 'object')
    window.SweatMap = SweatMap;

//... and CommonJS
if(typeof module === 'object' && module.exports)
    module.exports = SweatMap;
