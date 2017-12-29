var page = page;
var stateView = stateView;

page('/',
  mapController.reset,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.setMap,
  mapController.readData
);

page('/:stateName',
  mapController.getState,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.setMap,
  mapController.readStateData,
  mapController.maskCountry
);

page();
