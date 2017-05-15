(function closure(module) {

  var townhallData;
  var map;
  var mapView = {};

  // Define an intial view for the US
  var continentalView = function(w,h) { return geoViewport.viewport([-128.8, 23.6, -65.4, 50.2], [w, h]); };
  var continental = continentalView(window.innerWidth/2, window.innerHeight/2);

  function setMap(){
    // Specify Mapbox default access token
    var accessToken = 'pk.eyJ1IjoiZG1vcmlhcnR5IiwiYSI6ImNpejlid2Y1djAxNWsyeHFwNTVoM2ZibWEifQ.MlGaldJiUQ91EDGdjJxLsA';

    // Specify uploaded Mapbox Studio style URL
    var styleURL = 'mapbox://styles/dmoriarty/cj18brxs7002q2sptb60i1zfc';
    var mapId = 'dmoriarty.cd-114-2015'; // used by the click handler only

    mapboxgl.accessToken = accessToken;
    map = new mapboxgl.Map({
      container: 'map',
      style: styleURL,
      center: continental.center,
      zoom: continental.zoom,
      minZoom: 3
    });

    // Set Mapbox map controls
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.on('load', function() {
      makeZoomToNationalButton();
      addDistrictListener();
      addPopups();
      addLayer ();
      readData();
      TownHall.isMap = true;
      mapView.map = map;
    });
  }

  mapView.resetView = function resetView() {
    mapView.killSidebar();
    mapView.map.flyTo(continentalView(window.innerWidth/2, window.innerHeight/2));
    var visibility = mapView.map.getLayoutProperty('selected-fill', 'visibility');
    if (visibility === 'visible') {
      mapView.map.setLayoutProperty('selected-fill', 'visibility', 'none');
      mapView.map.setLayoutProperty('selected-border', 'visibility', 'none');
    }
  };

  // Creates the button in our zoom controls to go to the national view
  function makeZoomToNationalButton() {
    document.querySelector('.mapboxgl-ctrl-compass').remove();

    var usaButton = document.createElement('button');

    usaButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-usa';
    usaButton.innerHTML = '<span class="usa-icon"></span>';
    usaButton.addEventListener('click', mapView.resetView);

    document.querySelector('.mapboxgl-ctrl-group').appendChild(usaButton);
  }

  mapView.districtSelect = function(feature) {
    if (feature.state) {
      eventHandler.renderResults(feature.state, [feature.district], feature.geoID);
      mapView.focusMap(feature.state, [feature.district]);
      eventHandler.setUrlParameter('district', feature.state + '-' + feature.district + '-' + feature.geoID);
    } else {
      var visibility = map.getLayoutProperty('selected-fill', 'visibility');
      if (visibility === 'visible') {
        map.setLayoutProperty('selected-fill', 'visibility', 'none');
        map.setLayoutProperty('selected-border', 'visibility', 'none');
      }
    }
  };
  // Add click listener to each district. Used for creating the sidebar, drawing a 'selected' state to the district, & zooming in.
  // TODO: Plug into a sidebar to draw up the list of Town Halls.
  function addDistrictListener() {
    map.on('click', function(e) {
      var feature = {};

      if (1) {
        var features = map.queryRenderedFeatures(
          e.point,
          {
            layers: ['district_interactive']
          });
        if (features.length > 0) {
          feature.state = features[0].properties.ABR;
          feature.district = features[0].properties.GEOID.substring(2,4);
          feature.geoID = features[0].properties.GEOID;
          mapView.districtSelect(feature);
        }
      } else {
        $.ajax({
          url: 'https://api.mapbox.com/v4/' + mapId + '/tilequery/' + e.lngLat.lng + ',' + e.lngLat.lat + '.json?radius=0&access_token=' + accessToken,
          method: 'GET',
          success: function(resp) {
            if (resp.type === 'FeatureCollection' && resp.features.length > 0) {
              feature.state = resp.features[0].properties.ABR;
              feature.district = resp.features[0].properties.GEOID.substring(2,4);
              feature.geoID = resp.features[0].properties.GEOID;
              mapView.districtSelect(feature);
            }
          }
        });
      }
    });
  }

  // Offset points slightly to see events happening at same location.
  function jitterPoint(lng, lat) {
    var jitter = Math.random() * .001;
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    var plusOrMinus1 = Math.random() < 0.5 ? -1 : 1;
    return [lng + jitter * plusOrMinus, lat + jitter * plusOrMinus1];
  }
  // puts tele town halls by House members in the district.
  //TODO: geocode the data on the way in
  function teleTownHallDistrict(townhall){
    var districtId = townhall.District.split('-')[1];
    if (districtId.length === 1){
      districtId = '0' + districtId;
    }
    if (districtId === '00') {
      districtId = '01';
    }
    var bb = bboxes[townhall.District.split('-')[0] + districtId];
    townhall.lng = (bb[2] - bb[0])/2 + bb[0];
    townhall.lat = (bb[3] - bb[1])/2 + bb[1];
    return townhall;
  }

  var featuresHome = {
    type: 'FeatureCollection',
    features: []
  };

  // Creates the point layer.
  function makePoint (townhall) {
    var type = townhall.meetingType.toLowerCase();
    if (type === 'teletown hall' || type === 'tele-town hall'){
      var iconKey = 'phone-in';
      if (townhall.District && townhall.District !== 'Senate') {
        townhall = teleTownHallDistrict(townhall);
      }
    } else {
      var iconKey = 'in-person';
    }
    if (townhall.lat) {
      featuresHome.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: jitterPoint(townhall.lng, townhall.lat)
        },
        properties: {
          district: townhall.District,
          member: townhall.Member,
          meetingType: townhall.meetingType,
          icon: iconKey
        },
      });
    } else {
      // console.log(townhall.eventId, townhall.meetingType, townhall.State);
    }
  }

  function addLayer () {
    map.addLayer({
      'id': 'townhall-points',
      'type': 'symbol',
      'source': {
        'type': 'geojson',
        'data': featuresHome
      },
      'layout': {
        'icon-image': '{icon}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'icon-ignore-placement': true,
        'icon-ignore-placement': true,
        'icon-offset': {
          'base': 1,
          'stops': [
              [0, [0, -15]],
              [10, [0, -10]],
              [12, [0, 0]]
          ]
        }
      }
    });
  }
  // Adds a Popup listener to the point layer. TODO: Determine content for the popup.
  function addPopups () {
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
      var popupDistrict = '';

      if (feature.properties.district && feature.properties.district !== 'Senate') {
        popupDistrict = ', District ' + (feature.properties.district).substring(3);
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(feature.geometry.coordinates)
          .setHTML('<b>' + feature.properties.member + '</b>' + popupDistrict + '<br><span>' + feature.properties.meetingType + '</span>')
          .addTo(map);
    });
  }

  var filterDistrict = ['any'];
  var includedStates = ['in', 'NAME'];

  // Does the initial filter for the map to determine which districts have Town Halls.
  // TODO: Add in a data-driven style for the district layer that does a different fill if it's a local represenative vs. a Senator
  function filterMap (townHall) {
    // Fetch states with senators in em'
    if (townHall.District === 'Senate' && townHall.State && townHall.meetingType !== 'DC Event') {
      includedStates.push(townHall.State);
    }

    var filterSenate = ['all', includedStates];

    // Fetch districts w/ town halls occuring
    district = townHall.District;

    if (district && district !== 'Senate' && townHall.meetingType !== 'DC Event') {
      var districtId = district.split('-')[1];
      var getFIPS;
      if (!districtId) {
        return;
      }

      if (districtId.length === 1){
        districtId = '0' + districtId;
      }
      if (districtId === '00') {
        districtId = '01';
      }

      stateData.forEach(function(n){
        if (n.Name === townHall.State) {
          getFIPS = n.FIPS;
        }
      });

      var geoid = getFIPS + districtId;

      filterDistrict.push(['==', 'GEOID', geoid]);
    }
    // Apply the filters to each of these layers
    toggleFilters('senate_fill', filterSenate);
    toggleFilters('district_fill', filterDistrict);
  }

  function toggleFilters (layer, filter) {
    map.setFilter(layer, filter);
    map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  //TODO: add sentate events to a master bounding box so they are in the view
  function masterBoundingBox (stateAbbr, districtCodes) {
    var masterBB = [0,0,0,0];
    districtCodes.forEach(function(district) {
      newBB = bboxes[stateAbbr + district];
      masterBB[0] = Math.min(masterBB[0], newBB[0]);
      masterBB[2] = Math.min(masterBB[2], newBB[2]);
      masterBB[1] = Math.max(masterBB[1], newBB[1]);
      masterBB[3] = Math.max(masterBB[3], newBB[3]);
    });
    return masterBB;
  }
  // Refocuses the map to predetermined bounding boxes based on a state code & (optionally) a district #.
  mapView.focusMap = function focusMap (stateAbbr, districtCodes) {
    var height = window.innerHeight,
      width = window.innerWidth,
      statekey = stateAbbr,
      bb = bboxes[stateAbbr];
    if (districtCodes && districtCodes.length ===1) {
      statekey = statekey + districtCodes[0];
      bb = bboxes[statekey];
    } else if (districtCodes && districtCodes.length > 1) {
      bb = masterBoundingBox(stateAbbr, districtCodes);
    }

    var view = geoViewport.viewport(bb, [width/2, height/2]);
    view.zoom = view.zoom - 0.5;
    map.flyTo(view);
  };

  // Handles the highlight for districts when clicked on.
  mapView.highlightDistrict = function highlightDistrict (geoid) {
    var filter;
    // Filter for which district has been selected.
    if(typeof geoid === 'object') {
      filter = ['any'];

      geoid.forEach(function(i){
        filter.push(['==', 'GEOID', i]);
      });
    } else {
      filter = ['all', ['==', 'GEOID', geoid]];
    }

    // Set that layer filter to the selected
    toggleFilters('selected-fill', filter);
    toggleFilters('selected-border', filter);
  };
  // Fetch data from Firebase, run map filter & point layers
  // listens for new data.
  function readData () {
    var townHallsFB = firebase.database().ref('/townHalls/');
    townHallsFB.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall (snapshot.val());
      TownHall.allTownHalls.push(ele);
      TownHall.addFilterIndexes(ele);
      filterMap(ele);
      makePoint(ele);
      eventHandler.initialTable(ele);
    });
    townHallsFB.once('value', function(snap) {
    // console.log("initial data loaded!", snap.numChildren() === TownHall.allTownHalls.length);
      map.getSource('townhall-points').setData(featuresHome);
      eventHandler.zipSearchByParam();
    });
  };

  // Create a sidebar and map half view
  mapView.makeSidebar = function makeSidebar (selectedData) {
    $('.nearest-with-results').empty();
    $('.map-container-large').addClass('hidden');
    $('.map-container-split').removeClass('hidden');
    $('#map').prependTo('.map-fixing');
    map.resize();
  };

  // go back to full screen
  mapView.killSidebar = function killSidebar () {
    $('.header-with-results').addClass('hidden');
    $('.map-container-large').removeClass('hidden');
    $('.map-container-split').addClass('hidden');
    $('#map').prependTo('.map-large');
    map.resize();
  };

  $(document).ready(function(){
    setMap();

  });
  module.mapView = mapView;

}(window));
