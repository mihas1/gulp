var first = require('./modules/first.js'),
  second = require('./modules/second.js'),
  third = require('./modules/third.js');

first.init();
second.init();
third.init();
console.log('Hello world!');
third.warn();