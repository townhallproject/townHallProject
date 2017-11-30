'use strict';

var page = page;
var stateView = stateView;

page('/:state', stateView.getState);

page();
