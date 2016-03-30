var assert = require('assert');
var SweatMap = require('../src/map.js');

describe('SweatMap', function() {
    describe('#constructor()', function () {
        var myMap;
        
        before(function() {
            myMap = new SweatMap({
                "SafeClass": "SafeClass"
            }, {
                "A-Z": { start: '41', end: '5A' },  //Add A-Z
                "A-Z2": { start: '41', end: '5A' }, //Add A-Z again, this is filtered out!
                "a-z": { start: '61', end: '7A' },  //Add a-z
                "Basic Latin": { end: null }        //Removes Basic Latin
            });
        });
        
        
        it('SweatMap tests are being written:', function () {
            myMap.set('meh');
            myMap.set('yo');
            myMap.set('SafeClass');
            
            console.log(myMap.entries());
            
            assert.equal(-1, [1,2,3].indexOf(5));
        });
    });
});