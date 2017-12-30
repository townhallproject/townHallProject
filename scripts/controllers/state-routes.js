var page = page;
var mapController = mapController;

page('/',
  mapController.reset,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.setMap,
  mapController.readData
);

page('/:stateName',
  mapController.getState,
  mapController.renderHeader,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.setMap,
  mapController.readStateData,
  mapController.maskCountry
);

page();
