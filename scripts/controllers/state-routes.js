'use strict';

var page = page;
var stateView = stateView;

page('/', stateView.reset);
page('/:state', stateView.getState);

page();
