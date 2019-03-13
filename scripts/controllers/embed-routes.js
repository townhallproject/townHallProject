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

page('/mapEmbed.html',
  mapController.getUrlParams,
  mapController.reset,
  mapController.getStateEmbed,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.legendEmbed,
  mapController.borderEmbed,
  mapController.setMap,
  mapController.readDataNoTable,
  mapController.maskCountry,
  mapController.addDistrictListenerEmbed
);

page();
