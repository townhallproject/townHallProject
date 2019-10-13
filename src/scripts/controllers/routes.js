// let page = page;
// let mapController = mapController;
// let indexController = indexController;
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

// page();
