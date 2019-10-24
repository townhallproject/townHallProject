import page from 'page';
import mapController from './map-controller';
import indexController from './index-controller';

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
