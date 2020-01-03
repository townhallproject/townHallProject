import page from 'page';
import mapController from './map-controller';
import indexController from './index-controller';


page('/',
  mapController.reset,
  mapController.checkUrlParamsForSelection,
  indexController.renderMainIndex,
  mapController.setBounds,
  mapController.webGlsupported,
  mapController.hideStateLegend,
  indexController.renderDom,
  mapController.setMap,
  mapController.readData,
  mapController.addDistrictListener,
  mapController.setDistrict,
);

page('/:stateName',
  mapController.getState,
  mapController.checkUrlParamsForSelection,
  indexController.renderStateIndex,
  mapController.setStateBounds,
  mapController.webGlsupported,
  mapController.showStateLegend,
  mapController.setborderListeners,
  indexController.renderDom,
  mapController.setMap,
  mapController.readStateData,
  mapController.maskCountry,
  mapController.addStateDistrictListener,
);

page()