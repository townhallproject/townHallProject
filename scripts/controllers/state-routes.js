'use strict';

var page = page;
var stateView = stateView;
var mapView = mapView;

page('/:state', stateView.getState);

page();
