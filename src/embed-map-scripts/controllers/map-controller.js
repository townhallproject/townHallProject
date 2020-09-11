import $ from 'jquery';
import urlParamsHandler from '../../scripts/lib/urlParams';
import stateData from '../../data/states';
import TownHall from '../../scripts/models/TownHall';
import stateView from '../../scripts/views/stateView';
import mapView from '../../scripts/views/mapView';
import noWebGlMapView from '../../scripts/views/googleMapView';
import mapboxView from '../../scripts/views/mapboxView';

const mapController = {};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// Turns state variable with dashes into the state name
function parseState(string) {
  var nameArray = string.split('-').map(function (name) {
    return capitalizeFirstLetter(name);
  });
  return nameArray.join(' ');
}

mapController.webGlsupported = function (ctx, next) {
  if (!mapboxgl.supported()) {
    ctx.webGL = false;
    noWebGlMapView.noWebGlMapinit();
  } else {
    ctx.webGL = true;
    mapboxView.webGlinit(ctx.parentBB);
  }
  next();
};

mapController.getUrlParams = function (ctx, next) {
  if (ctx.querystring && ctx.querystring.split('=')[0] === 'event-type') {
    urlParamsHandler.getUrlParamFromQuery(ctx.querystring, 'event-type');
    ctx.filters = ctx.querystring.split('=')[1].split(',');
  }
  if (ctx.querystring && ctx.querystring.split('=')[0] === 'state-name') {
    urlParamsHandler.getUrlParamFromQuery(ctx.querystring, 'state-name');
    ctx.stateName = ctx.querystring.split('=')[1].split(',')[0];
  }
  next();
};

mapController.setBounds = function (ctx, next) {
  ctx.parentBB = [-128.8, 23.6, -65.4, 50.2];
  ctx.bounds = new mapboxgl.LngLatBounds([-128.8, 23.6], [-65.4, 50.2]);
  next();
};

mapController.getStateEmbed = function (ctx, next) {
  // ///convert state name to necessary coordinates for mapbox url
  if (ctx.stateName) {
    var stateInfo = $.grep(stateData, function (e) {
      return e.Name === parseState(ctx.stateName);
    });
    ctx.params.stateName = stateInfo;
    if (stateInfo.length > 0) {
      var stateUPSP = stateInfo[0]['USPS'];
      ctx.stateUPSP = stateUPSP;
      stateView.state = ctx.stateUPSP;
      next();
    } else {
      next();
    }
  } else {
    next();
  }
};

mapController.legendEmbed = function (ctx, next) {
  if (ctx.stateUPSP) {
    mapController.showStateLegend(ctx, next);
    return next();
  }
  mapController.hideStateLegend(ctx, next);
  next();
};

mapController.hideStateLegend = function (ctx, next) {
  if (ctx.webGL) {
    mapboxView.hideStateLegend();
  }
  next();
};

mapController.borderEmbed = function (ctx, next) {
  if (ctx.stateUPSP) {
    return mapController.setborderListeners(ctx, next);
  }
  next();
};

mapController.readDataNoTable = function (ctx, next) {
  if (ctx.stateUPSP) {
    return mapController.readStateData(ctx, next);
  }
  if (!ctx.webGL) {
    mapView.readData(false, 'noTable', ctx.filters);
    return next();
  }
  ctx.map.on('load', function () {
    mapboxView.onLoad();
    mapView.readData(true, 'noTable', ctx.filters);
    TownHall.isMap = true;
    next();
  });
};

mapController.setMap = function (ctx, next) {
  if (ctx.webGL) {
    var style = null;
    if (ctx.stateUPSP) {
      style = 'mapbox://styles/townhallproject/cjbqzhc4b8c1x2trz43dk8spj';
    }
    ctx.map = mapView.setMap(style, ctx.parentBB, ctx.bounds);
    next();
  }
};

mapController.readData = function (ctx, next) {
  if (!ctx.webGL) {
    mapView.readData(false);
    return next();
  }
  ctx.map.on('load', function () {
    mapboxView.onLoad();
    mapView.readData(true);
    TownHall.isMap = true;
    next();
  });
};

mapController.maskCountry = function (ctx, next) {
  if (ctx.webGL) {
    stateView.maskCountry(ctx.map, ctx.stateUPSP);
  }
  next();
};

mapController.addDistrictListenerEmbed = function (ctx, next) {
  if (ctx.stateUPSP) {
    return (mapController.addStateDistrictListener(ctx, next));
  }
  if (ctx.webGL) {
    mapboxView.addDistrictListener();
  }
  next();
};

mapController.reset = function (ctx, next) {
  TownHall.allTownHalls = [];
  TownHall.currentContext = [];
  TownHall.isCurrentContext = false;
  stateView.state = null;
  stateView.stateCoords = undefined;
  next();
};

export default mapController;