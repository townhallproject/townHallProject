var page = page;
var mapController = mapController;
var indexController = indexController;

page('/',
  mapController.reset,
  indexController.renderMainIndex,
  indexController.renderMainTable
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.setMap,
  mapController.readData
);

page('/:stateName',
  mapController.getState,
  indexController.renderStateIndex,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.setMap,
  mapController.readStateData,
  mapController.maskCountry
);

page();
