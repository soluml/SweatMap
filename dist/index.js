var SweatMap = require('../src/map.js');

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


console.log( myMap.entries() );

