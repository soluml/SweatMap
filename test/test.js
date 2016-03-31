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
        
        it('Obfuscates the given keys up to 52 strings:', function () {
            var i, str;

            for(i = 0; i < 53; i++) {
                str = myMap.set('string'+ i);
                
                if(i < 52)
                    assert.equal(str.length, 1);
                else
                    assert.equal(str.length, 2);
            }
        });
        
        
        
    });
});