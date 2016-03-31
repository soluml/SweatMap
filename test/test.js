'use strict';

var assert = require('assert');
var SweatMap = require('../src/map.js');

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
                "SafeString": "Whatever",
                "☃": "�",
                "Ignored": {}
            });

            assert.equal(myMap.fmap.get('SafeString'), 'Whatever');
            assert.equal(myMap.fmap.get('☃'), '�');
            assert.equal(myMap.fmap.get('Ignored'), undefined);

            assert.equal(myMap.rmap.get('Whatever'), 'SafeString');
            assert.equal(myMap.rmap.get('�'), '☃');
        });
        
        it('Can pass in adjusted character ranges:', function() {
            var myMap = new SweatMap({}, {
                "A-P": { start: '41', end: '50' }, //Add A-Z
                "A-Z": { start: '41', end: '5A' }, //Any non-unique chars are filtered out!
                "a-z": { start: '61', end: '7A' }, //Add a-z
                "Basic Latin": { end: null }       //Removes Basic Latin
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
    
    describe('set(key)', function () {

        var myMap;
        
        beforeEach(function() {
            myMap = new SweatMap({}, {
                "A-Z": { start: '41', end: '5A' },  //Add A-Z
                "a-z": { start: '61', end: '7A' },  //Add a-z
                "Basic Latin": { end: null }        //Removes Basic Latin
            });
        });

        it('Returns the same obfuscated value given the same key:', function () {
            var str1 = myMap.set('string');
            var str2 = myMap.set('string');

            assert.equal(str1, str2);
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
        
    });
    
    describe('delete(key)', function () {
        
        it('Deletes values from both fmap and rmap for a given key:', function () {
            var myMap = new SweatMap();
            
            myMap.set('A-String');
            myMap.set('B-String');
            
            assert.equal(myMap.fmap.has('A-String'), true);
            assert.equal(myMap.fmap.has('B-String'), true);
            
            myMap.delete('B-String');
            assert.equal(myMap.fmap.has('A-String'), true);
            assert.equal(myMap.fmap.has('B-String'), false);
            
            myMap.delete('A-String');
            assert.equal(myMap.fmap.has('A-String'), false);
            assert.equal(myMap.fmap.has('B-String'), false);
        });
        
    });
});