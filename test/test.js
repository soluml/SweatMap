var assert = require('assert');
var SweatMap = require('../src/map.js');

describe('SweatMap', function() {
    describe('#constructor()', function () {

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
        
        
        
        
        
        
        
        
        it('SweatMap tests are being written:', function () {
            var myMap = new SweatMap({
                "SafeClass": "SafeClass"
            }, {
                "A-Z": { start: '41', end: '5A' },  //Add A-Z
                "A-Z2": { start: '41', end: '5A' }, //Add A-Z again, this is filtered out!
                "a-z": { start: '61', end: '7A' },  //Add a-z
                "Basic Latin": { end: null }        //Removes Basic Latin
            });
            
            
            myMap.set('meh');
            myMap.set('yo');
            myMap.set('SafeClass');
            
            console.log(myMap.entries());
            
            assert.equal(-1, [1,2,3].indexOf(5));
        });
    });
});