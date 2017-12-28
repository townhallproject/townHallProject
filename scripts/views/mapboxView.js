(function closure(module) {

  var mapboxView = {};
  var map;
  // Define an intial view for the map
  var continentalView = function(w,h) {
    if (stateView.stateCoords) {
      return geoViewport.viewport(stateView.stateCoords, [w, h]);
    } else {
      return geoViewport.viewport([-128.8, 23.6, -65.4, 50.2], [w, h]);
    }
  };

  mapboxView.initialView = function setInitialView(map) {
    var bounds = mapView.getBounds();
    if (mapView.webGL) {
      map.fitBounds(bounds);
    }
  };

  mapboxView.setMap = function(style, parentBB, ctxbounds){
    // Specify Mapbox default access token
    var accessToken = 'pk.eyJ1IjoidG93bmhhbGxwcm9qZWN0IiwiYSI6ImNqMnRwOG4wOTAwMnMycG1yMGZudHFxbWsifQ.FXyPo3-AD46IuWjjsGPJ3Q';
    // Specify uploaded Mapbox Studio style URL
    var styleURL = style ? style: 'mapbox://styles/townhallproject/cj2tpe64q000y2spk1wjsrilw';
    var mapId = 'townhallproject.d46r2w4l'; // used by the click handler only
    var continental = continentalView(window.innerWidth/2, window.innerHeight/2);
    mapboxgl.accessToken = accessToken;
    map = new mapboxgl.Map({
      container: 'map',
      style: styleURL,
      zoom: continental.zoom,
      center: continental.center,
      minZoom: 1.5,
      attributionControl: false
      // maxBounds: parentBB
    });
    $( window ).resize(function() {
      var bb = parentBB;
      var bounds = mapView.zoomLocation ? mapView.zoomLocation : bb;
      mapView.focusMap(bounds);
    });
    map.addControl(new mapboxgl.AttributionControl(), 'top-left');

    mapboxView.initialView(map);

    // Set Mapbox map controls
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    return map;
  };

  mapboxView.resetMap = function(map) {
    mapboxView.initialView(map);
    var visibility = map.getLayoutProperty('selected-fill', 'visibility');
    if (visibility === 'visible') {
      map.setLayoutProperty('selected-fill', 'visibility', 'none');
      map.setLayoutProperty('selected-border', 'visibility', 'none');
    }
  };

  module.mapboxView = mapboxView;
}(window));
