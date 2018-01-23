var page = page;
var mapController = mapController;
var indexController = indexController;

page('/',
  mapController.reset,
  indexController.renderMainIndex,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.hideStateLegend,
  mapController.setMap,
  mapController.readData,
  mapController.addDistrictListener
);

page('/:stateName',
  mapController.getState,
  indexController.renderStateIndex,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.showStateLegend,
  mapController.setborderListeners,
  mapController.setMap,
  mapController.readStateData,
  mapController.maskCountry,
  mapController.addStateDistrictListener
);

page();
