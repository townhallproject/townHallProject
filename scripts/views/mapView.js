(function closure(firebase) {
// Specify Mapbox default access token
  var accessToken = 'pk.eyJ1IjoiZG1vcmlhcnR5IiwiYSI6ImNpejlid2Y1djAxNWsyeHFwNTVoM2ZibWEifQ.MlGaldJiUQ91EDGdjJxLsA';

  // Specify uploaded Mapbox Studio style URL
  var styleURL = 'mapbox://styles/dmoriarty/ciyyzloid003n2sq88m2ftdm3';
  var mapId = 'dmoriarty.cd-114-2015'; // used by the click handler only

  var continentalView = function(w,h) { return geoViewport.viewport([-128.8, 23.6, -65.4, 50.2], [w, h]); };
  var continental = continentalView(window.innerWidth/2, window.innerHeight/2);

  mapboxgl.accessToken = accessToken;
  var map = new mapboxgl.Map({
    container: 'map',
    style: styleURL,
    center: continental.center,
    zoom: continental.zoom,
    minZoom: 2.5
  });

  map.on('load', function() {
    // Enable Zoom Controls
    map.addControl(new mapboxgl.NavigationControl());

    // Disable rotate
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
  });

  map.on('click', function(e) {
    var district = null;

    if (1) {
      // The map control provides a client-side-only way to determine what
      // is under the cursor. We restrict the query to only the layers that
      // provide congressional district polygons. Note that this only scans
      // features that are currently shown on the map. So if you've filtered
      // the districts so only a state or a single district is showing, this
      // will restrict the query to those districts.
      var features = map.queryRenderedFeatures(
        e.point,
        {
          layers: ['district_interactive']
        });
      if (features.length > 0)
        // The feature properties come from the original GeoJSON uploaded to Mapbox.
        district = features[0];
    } else {
      // Use the Mapbox tilequery API instead.
      //
      // Note that, from the Mapbox API docs:
      // "Use of this endpoint is rate limited to 600 requests per minute."
      $.ajax({
        url: 'https://api.mapbox.com/v4/' + mapId + '/tilequery/' + e.lngLat.lng + ',' + e.lngLat.lat + '.json?radius=0&access_token=' + accessToken,
        method: 'GET',
        success: function(resp) {
          if (resp.type === 'FeatureCollection' && resp.features.length > 0)
            // resp is always a FeatureCollection, just sanity checking, but it might
            // be empty. If it's not empty, it will contain a single Feature
            // (whose geometry is a Polygon) represending the boundaries of a
            // congressional district. Its properties come from the original
            // GeoJSON uploaded to Mapbox.
            district = resp.features[0];
        }
      });
    }

    if (district) {
      console.log('you\'ve gone and clicked a district. Good work!');
    }    
  });

}(window.firebase));
