'use strict';

var page = page;
var stateView = stateView;

page('/',
  mapController.reset,
  mapController.webGlsupported,
  mapController.setMap,
  mapController.readData
);

page('/:stateName',
  mapController.webGlsupported,
  mapController.setMap,
  mapController.getState,
  mapController.readStateData
);

page();
