'use strict';

var assert = require('assert');
var SweatMap = require('../node/sweatmap.js');

describe('SweatMap', function() {
    describe('#constructor(existing_strings, additional_ranges)', function () {

        it('Default character limits:', function() {
            var myMap = new SweatMap();
            
            assert.equal(myMap.characters['1'].length, 96);
            assert.equal(myMap.characters['2'].length, 1776);
            assert.equal(myMap.characters['3'].length, 57440);
        });
        
        it('Can pass in existing UTF-8 String key/values:', function() {
            var myMap = new SweatMap({
                "existing_strings": {
                    "SafeString": "Whatever",
                    "☃": "�",
                    "Ignored": {}
                }
            });

            assert.equal(myMap.fmap.get('SafeString'), 'Whatever');
            assert.equal(myMap.fmap.get('☃'), '�');
            assert.equal(myMap.fmap.get('Ignored'), undefined);

            assert.equal(myMap.rmap.get('Whatever'), 'SafeString');
            assert.equal(myMap.rmap.get('�'), '☃');
        });
        
        it('Can pass in adjusted character ranges:', function() {
            var myMap = new SweatMap({
                "additional_ranges": {
                    "A-P": { start: '41', end: '50' }, //Add A-Z
                    "A-Z": { start: '41', end: '5A' }, //Any non-unique chars are filtered out!
                    "a-z": { start: '61', end: '7A' }, //Add a-z
                    "Basic Latin": { end: null }       //Removes Basic Latin
                }
            });

            assert.equal(myMap.characters['1'].length, 52);
            assert.equal(myMap.characters['2'].length, 1776);
            assert.equal(myMap.characters['3'].length, 57440);
        });
        
        it('Character ranges are frozen:', function() {
            var myMap = new SweatMap();

            assert.equal(Object.isFrozen(myMap.characters), true);
            assert.equal(Object.isFrozen(myMap.characters['1']), true);
            assert.equal(Object.isFrozen(myMap.characters['2']), true);
            assert.equal(Object.isFrozen(myMap.characters['3']), true);
        });
        
        it('No default entries:', function() {
            var myMap = new SweatMap();

            assert.deepEqual(myMap.fmap.entries().next(), {value: undefined, done: true});
            assert.deepEqual(myMap.rmap.entries().next(), {value: undefined, done: true});
        });
        
        it('Can set CSS Safe Mode:', function() {
            var myMap = new SweatMap({ cssSafe: true });

            assert.equal(myMap.cssSafe, true);
        });
    });
    
    describe('bytes(str)', function () {
        
        it('Returns bytes for a given string:', function () {
            var myMap = new SweatMap();

            assert.equal(myMap.bytes('a'), 1);
            assert.equal(myMap.bytes('aA'), 2);
            assert.equal(myMap.bytes('×'), 2);
            assert.equal(myMap.bytes('×ø×ø!'), 9);
            assert.equal(myMap.bytes('☃'), 3);
            assert.equal(myMap.bytes('�bb☃'), 8);
        });
        
    });
    
    describe('cssSafeString(str)', function () {
        
        it('Determines if a string is a valid css identifier (e.g. class/id):', function () {
            var myMap = new SweatMap();

            assert.equal(myMap.cssSafeString('a'), true);
            assert.equal(myMap.cssSafeString('*'), false);
            assert.equal(myMap.cssSafeString('--'), false);
            assert.equal(myMap.cssSafeString('-'), false);
            assert.equal(myMap.cssSafeString('-8'), false);
            assert.equal(myMap.cssSafeString('a-8'), true);
            assert.equal(myMap.cssSafeString('�'), true);
            assert.equal(myMap.cssSafeString('8a'), false);
            assert.equal(myMap.cssSafeString('a8'), true);
        });
        
    });

    describe('generatePatternForBytes(bytes)', function () {
        var myMap;
        var patternCountTest = function (bytes) {
            var expectedPatterns = Math.pow(2, bytes - 1);
            var patterns = myMap.generatePatternForBytes(bytes);
            var patternCount = 0;

            for (var i = 0; i < expectedPatterns; i++) {
                try {
                    if (patterns[i].length > 0) {
                        patternCount++;
                    }
                } catch (err) {
                    break;
                }
            }

            assert.equal(patternCount, expectedPatterns);
        };
        
        beforeEach(function() {
            myMap = new SweatMap({
                "additional_ranges": {
                    "A-Z": { start: '41', end: '5A' },  //Add A-Z
                    "a-z": { start: '61', end: '7A' },  //Add a-z
                    "Basic Latin": { end: null }        //Removes Basic Latin
                }
            });
        });

        it('Should generate proper number of patterns for 1 bytes', function () {
            patternCountTest(1);
        });

        it('Should generate proper number of patterns for 2 bytes', function () {
            patternCountTest(2);
        });

        it('Should generate proper number of patterns for 3 bytes', function () {
            patternCountTest(3);
        });

        it('Should generate proper number of patterns for 4 bytes', function () {
            patternCountTest(4);
        });

        it('Should generate proper number of patterns for 5 bytes', function () {
            patternCountTest(5);
        });
    });
    
    describe('set(key)', function () {

        var myMap;
        
        beforeEach(function() {
            myMap = new SweatMap({
                "additional_ranges": {
                    "A-Z": { start: '41', end: '5A' },  //Add A-Z
                    "a-z": { start: '61', end: '7A' },  //Add a-z
                    "Basic Latin": { end: null }        //Removes Basic Latin
                }
            });
        });

        it('Returns the same obfuscated value given the same key:', function () {
            var str1 = myMap.set('string');
            var str2 = myMap.set('string');

            assert.equal(str1, str2);
        });
        
        it('Returns an error if the key is not a string:', function () {
            assert.throws(() => { myMap.set({}); }, Error, '{} is not a string');
            assert.throws(() => { myMap.set(0); }, Error, '0 is not a string');
            assert.throws(() => { myMap.set([]); }, Error, '[] is not a string');
            assert.throws(() => { myMap.set(function(){}); }, Error, 'function(){} is not a string');
            assert.throws(() => { myMap.set(true); }, Error, 'true is not a string');
            assert.throws(() => { myMap.set(null); }, Error, 'null is not a string');
        });
        
        it('Returns an error if the key is an empty string:', function () {
            assert.throws(() => { myMap.set(''); }, Error, '"" is an empty string');
        });
        
        it('Obfuscates the given keys correctly:', function () {
            //LONG Timeout -> 1min
            this.timeout(60000);
            
            var i, str;
            
            assert.equal(myMap.characters['1'].length, 52);
            assert.equal(myMap.characters['2'].length, 1776);
            assert.equal(myMap.characters['3'].length, 57440);

            for(i = 0; i < 5000; i++) {
                str = myMap.set('string'+ i);
                
                if(i < 52) { //(52)[A] == 52
                    assert.equal(myMap.bytes(str), 1);
                } else if(i < 4532) { //(^)[A] + (52*52)[AA] + (1776)[B] == 4532
                    assert.equal(myMap.bytes(str), 2);
                } else { //(^)[A][AA][B] + (52*52*52)[AAA] + (1776*52)[BA] + (52*1776)[AB] + (57440)[C] ==   4532 + 140608 + 92532 + 92352 + 57440 == 387644
                    assert.equal(myMap.bytes(str), 3);
                }
            }
        });
        
        
        it('Obfuscates the given keys correctly (CSS Safe):', function () {
            //LONG Timeout -> 1min
            this.timeout(60000);
            
            var i, str, myOtherMap = new SweatMap({ cssSafe: true });
            
            assert.equal(myOtherMap.characters['1'].length, 96);
            assert.equal(myOtherMap.characters['2'].length, 1776);
            assert.equal(myOtherMap.characters['3'].length, 57440);
            assert.equal(myOtherMap.cssSafe, true);
            
            for(i = 0; i < 5300; i++) {
                str = myOtherMap.set('string'+ i);
                
                if(i < 53) { // a-z(26) + A-Z(26) + _(1)
                    assert.equal(myMap.bytes(str), 1);
                } else if(i < 5274) { //(53)[A]+ (54*64-11{--, -\d})[AA] + (1776)[B] == 5274
                    assert.equal(myMap.bytes(str), 2);
                } else {
                    assert.equal(myMap.bytes(str), 3);
                }
            }
        });

    });
    
    describe('delete(key)', function () {
        
        it('Deletes values from both fmap and rmap for a given key:', function () {
            var myMap = new SweatMap();
            
            var astr = myMap.set('A-String');
            var bstr = myMap.set('B-String');
            
            assert.equal(myMap.fmap.has('A-String'), true);
            assert.equal(myMap.fmap.has('B-String'), true);
            assert.equal(myMap.rmap.has(astr), true);
            assert.equal(myMap.rmap.has(bstr), true);
            
            myMap.delete('B-String');
            assert.equal(myMap.fmap.has('A-String'), true);
            assert.equal(myMap.fmap.has('B-String'), false);
            assert.equal(myMap.rmap.has(astr), true);
            assert.equal(myMap.rmap.has(bstr), false);
            
            myMap.delete('A-String');
            assert.equal(myMap.fmap.has('A-String'), false);
            assert.equal(myMap.fmap.has('B-String'), false);
            assert.equal(myMap.rmap.has(astr), false);
            assert.equal(myMap.rmap.has(bstr), false);
        });
        
    });
    
    describe('clear()', function () {
        
        it('Clears values from both fmap and rmap:', function () {
            var myMap = new SweatMap();
            
            var astr = myMap.set('A-String');
            var bstr = myMap.set('B-String');
            
            assert.equal(myMap.fmap.has('A-String'), true);
            assert.equal(myMap.fmap.has('B-String'), true);
            assert.equal(myMap.rmap.has(astr), true);
            assert.equal(myMap.rmap.has(bstr), true);
            
            myMap.clear();
            assert.equal(myMap.fmap.has('A-String'), false);
            assert.equal(myMap.fmap.has('B-String'), false);
            assert.equal(myMap.rmap.has(astr), false);
            assert.equal(myMap.rmap.has(bstr), false);
        });
        
    });
    
    describe('entries()', function () {
        
        it('Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order:', function () {
            var myMap = new SweatMap();
            
            myMap.set('A-String');
            myMap.set('B-String');

            assert.deepEqual(myMap.entries(), myMap.fmap.entries());
        });
        
    });
    
    describe('get(key)', function () {
        
        it('Get values from the map:', function () {
            var myMap = new SweatMap();
            
            var astr = myMap.set('A-String');
            
            assert.equal(myMap.get('A-String'), astr);
            assert.equal(myMap.get('A-String'), myMap.fmap.get('A-String'));
        });
        
    });
    
    describe('get_obfuscated(value)', function () {
        
        it('Get keys from the map:', function () {
            var myMap = new SweatMap();
            
            var astr = myMap.set('A-String');
            
            assert.equal(myMap.get_obfuscated(astr), 'A-String');
            assert.equal(myMap.get_obfuscated(astr), myMap.rmap.get(astr));
        });
        
    });
    
    describe('has(key)', function () {
        
        it('Can see if it has a key in the map:', function () {
            var myMap = new SweatMap();
            
            myMap.set('A-String');
            assert.equal(myMap.has('A-String'), true);
            
            myMap.delete('A-String');
            assert.equal(myMap.has('A-String'), false);
        });
        
    });
    
    describe('has_obfuscated(value)', function () {
        
        it('Can see if it has a value in the map:', function () {
            var myMap = new SweatMap();
            
            var astr = myMap.set('A-String');
            assert.equal(myMap.has_obfuscated(astr), true);
            
            myMap.delete('A-String');
            assert.equal(myMap.has(astr), false);
        });
        
    });
});