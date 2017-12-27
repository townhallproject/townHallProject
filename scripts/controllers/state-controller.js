(function(module){
  var mapController = {};

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

// Turns state variable with dashes into the state name
  function parseState(string){
    var nameArray = string.split('-').map(function(name){
      return capitalizeFirstLetter(name);
    });
    return nameArray.join(' ');
  }

  mapController.webGlsupported = function(ctx, next){
    console.log('webgl', mapboxgl.supported());
    if (!mapboxgl.supported()) {
      mapView.webGL = false;
      ctx.webGL = false;
      mapView.noWebGlMapinit();
    } else {
      ctx.webGL = true;
      mapView.webGL = true;
      mapView.webGlinit();
    }
    next();
  };

  mapController.setMap = function(ctx, next){
    if (ctx.webGL) {
      console.log('is webGL');
      ctx.map = mapView.setMap();
    }
    next();
  };

  mapController.readData = function(ctx, next) {
    if (!ctx.webGL) {
      mapView.readData(false);
      return next();
    }
    ctx.map.on('load', function() {
      mapView.backSpaceHack();
      mapView.makeZoomToNationalButton();
      mapView.addDistrictListener();
      mapView.addPopups();
      mapView.addLayer();
      mapView.readData(true);
      TownHall.isMap = true;
      mapView.map = map;
    });
    next();
  };

  mapController.readStateData = function(ctx, next) {
    if (!ctx.webGL) {
      mapView.readStateData(false);
      return next();
    }
    ctx.map.on('load', function() {
      mapView.backSpaceHack();
      mapView.makeZoomToNationalButton(ctx.state);
      mapView.addDistrictListener();
      mapView.addPopups();
      mapView.addLayer();
      mapView.readStateData(true, ctx.state);
      TownHall.isMap = true;
      mapView.map = map;
    });
  };

  mapController.reset = function(ctx, next) {
    stateView.stateCoords = [-128.8, 23.6,-65.4, 50.2]; ///USA
    next();
  };

  mapController.getState = function(ctx, next){
    ///convert state name to necessary coordinates for mapbox url
    var stateName = $.grep(stateData, function(e){
      return e.Name === parseState(ctx.params.stateName);
    });

    ctx.params.stateName = stateName;
    if (stateName.length > 0) {
      var stateUsps = stateName[0]['USPS'];
      ctx.state = stateUsps;
      stateView.stateCoords = bboxes[stateUsps];
      stateView.state = stateUsps;
      console.log(stateView);
      next();
    } else {
      page('/');
    }
  };

  module.mapController = mapController;
})(window);
