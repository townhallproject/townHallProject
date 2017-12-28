'use strict';

var page = page;
var stateView = stateView;

page('/',
  mapController.reset,
  mapController.webGlsupported,
  mapController.setBounds,
  mapController.setMap,
  mapController.readData
);

page('/:stateName',
  mapController.webGlsupported,
  mapController.getState,
  mapController.setBounds,
  mapController.setMap,
  mapController.readStateData,
  mapController.maskCountry
);

page();
