(function closure(firebase) {

  window.readData = function (){
    var townHallsFB = firebase.database().ref('/townHalls/').once('value').then(function(snapshot){
      var ele = new TownHall (snapshot.val());
      filterMap(ele);
      makePointLayer(ele);
    });
  };

  // Specify Mapbox default access token
  var accessToken = 'pk.eyJ1IjoiZG1vcmlhcnR5IiwiYSI6ImNpejlid2Y1djAxNWsyeHFwNTVoM2ZibWEifQ.MlGaldJiUQ91EDGdjJxLsA';

  // Specify uploaded Mapbox Studio style URL
  var styleURL = 'mapbox://styles/dmoriarty/cizljl81e000x2rqk280evaee';
  var mapId = 'dmoriarty.cd-114-2015'; // used by the click handler only

  // Define an intial view for the US
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
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    addClickListener();
    addPopup();
  });

  // Add click listener to each district. Used for creating the sidebar, drawing a 'selected' state to the district, & zooming in. TODO: Plug into a sidebar to draw up the list of Town Halls.
  function addClickListener() {
    map.on('click', function(e) {
      var feature = null;

      if (1) {
        var features = map.queryRenderedFeatures(
          e.point,
          {
            layers: ['district_interactive']
          });
        if (features.length > 0)
          feature = features[0];
      } else {
        $.ajax({
          url: 'https://api.mapbox.com/v4/' + mapId + '/tilequery/' + e.lngLat.lng + ',' + e.lngLat.lat + '.json?radius=0&access_token=' + accessToken,
          method: 'GET',
          success: function(resp) {
            if (resp.type === 'FeatureCollection' && resp.features.length > 0)
              feature = resp.features[0];
          }
        });
      }

      if (feature) {
        console.log(feature.properties);
        focusMap(feature.properties.ABR, feature.properties.GEOID.substring(2,4));
        highlightDistrict(feature.properties.GEOID);
      } else {
        if (visibility === 'visible') {
          map.setLayoutProperty('selected-fill', 'visibility', 'none');
          map.setLayoutProperty('selected-border', 'visibility', 'none');
        }
      }
    });
  }

  // Creates the point layer. TODO: Replace circle feature type with icons
  function makePointLayer (data) {
    var featuresHome = {
      type: 'FeatureCollection',
      features: []
    };

    for (key in data){
      if (data[key].lat) {
        featuresHome.features.push({
          type: 'Feature',
          properties: {
            district: data[key].District,
            icon: 'monument'
          },
          geometry: {
            type: 'Point',
            coordinates: [data[key].lng, data[key].lat]
          }
        });
      }
    }

    map.addLayer({
      'id': 'townhall-points',
      'type': 'circle',
      'source': {
        'type': 'geojson',
        'data': featuresHome
      },
      'paint': {
        'circle-radius': 2.5,
        'circle-color': '#000000'
      }
    });
  }

  // Adds a Popup listener to the point layer. TODO: Determine content for the popup.
  function addPopup () {
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mousemove', function(e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['townhall-points'] });
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (!features.length) {
        popup.remove();
        return;
      }

      var feature = features[0];

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.district)
          .addTo(map);
    });
  }

  // Does the initial filter for the map to determine which districts have Town Halls. TODO: Add in a data-driven style for the district layer that does a different fill if it's a local represenative vs. a Senator
  function filterMap (townHallData) {
    var filter = ['any'];

    for (key in townHallData){
      district = townHallData[key].District;
      if (district === 'Senate' && townHallData[key].State) {
        filter.push(['==', 'NAME', townHallData[key].State]);
      } else if (district) {
        var districtId = district.substring(3,5);
        var getFIPS;

        if (districtId.length === 1){
          districtId = '0' + districtId;
        }

        stateData.forEach(function(n){
          if (n.Name === townHallData[key].State) {
            getFIPS = n.FIPS;
          }
        });

        var geoid = getFIPS + districtId;

        filter.push(['==', 'GEOID', geoid]);
      }
    }

    map.setFilter('district_fill', filter);
    map.setFilter('district_glow', filter);
  }

  // Refocuses the map to predetermined bounding boxes based on a state code & (optionally) a district #.
  function focusMap(stateAbbr, districtCode) {
    var height = window.innerHeight,
      width = window.innerWidth,
      districtAbbr = districtCode ? districtCode : '';

    var view = geoViewport.viewport(bboxes[stateAbbr + districtAbbr], [width/2, height/2]);
    view.zoom = view.zoom - 0.5;
    map.flyTo(view);
  }

  // Handles the highlight for districts when clicked on. 
  function highlightDistrict (geoid) {
    var visibility = map.getLayoutProperty('selected-fill', 'visibility');
    // If there are no selections, turn dem layers on
    if (visibility === 'none') {
      map.setLayoutProperty('selected-fill', 'visibility', 'visible');
      map.setLayoutProperty('selected-border', 'visibility', 'visible');
    }

    // Filter for which district has been selected
    var filter = ['all', ['==', 'GEOID', geoid]];

    // Set that layer filter to the selected
    map.setFilter('selected-fill', filter);
    map.setFilter('selected-border', filter);
  }

  readData();

}(window.firebase));
