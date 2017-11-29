'use strict';

var page = page;
const stateView = require('./views/stateView.js');


page('/state', function(){
  console.log('Testing page routing');
  alert('State route working');
});

page();
