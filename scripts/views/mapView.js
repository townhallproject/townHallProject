(function closure(module) {

  var townhallData;
  var map;
  var mapView = {};
  var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  mapView.zoomLocation = false;

  // Define an intial view for the US
  var continentalView = function(w,h) {
    return geoViewport.viewport([-128.8, 23.6, -65.4, 50.2], [w, h]);
  };
  var continental = continentalView(window.innerWidth/2, window.innerHeight/2);
  var mainBB = [-128.8, 23.6, -65.4, 50.2];
  var bounds = new mapboxgl.LngLatBounds([-128.8, 23.6], [-65.4, 50.2]);

  function setMap(){
    // Specify Mapbox default access token
    var accessToken = 'pk.eyJ1IjoidG93bmhhbGxwcm9qZWN0IiwiYSI6ImNqMnRwOG4wOTAwMnMycG1yMGZudHFxbWsifQ.FXyPo3-AD46IuWjjsGPJ3Q';

    // Specify uploaded Mapbox Studio style URL
    var styleURL = 'mapbox://styles/townhallproject/cj2tpe64q000y2spk1wjsrilw';
    var mapId = 'townhallproject.d46r2w4l'; // used by the click handler only

    mapboxgl.accessToken = accessToken;
    map = new mapboxgl.Map({
      container: 'map',
      style: styleURL,
      center: continental.center,
      zoom: continental.zoom,
      minZoom: 1.5,
      attributionControl: false
    });
    map.addControl(new mapboxgl.AttributionControl(), 'top-left');


    // Set Mapbox map controls
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.on('load', function() {
      backSpaceHack();
      makeZoomToNationalButton();
      addDistrictListener();
      addPopups();
      addLayer ();
      readData(true);
      TownHall.isMap = true;
      mapView.map = map;
    });
  }

  mapView.initialView = function setInitialView() {
    bounds = new mapboxgl.LngLatBounds([-128.8, 23.6], [-65.4, 50.2]);
    if (mapView.webGL) {
      map.fitBounds(bounds);
    }
  };

  mapView.resetView = function resetView() {
    mapView.killSidebar();
    mapView.zoomLocation = false;
    $('#representativeCards').hide();
    if (mapView.webGL && mapView.map) {
      mapView.initialView();
      var visibility = mapView.map.getLayoutProperty('selected-fill', 'visibility');
      if (visibility === 'visible') {
        mapView.map.setLayoutProperty('selected-fill', 'visibility', 'none');
        mapView.map.setLayoutProperty('selected-border', 'visibility', 'none');
      }
    } else {
      setTimeout(function () {
        onResizeMap();
      }, 50);
    }
    urlParamsHandler.setUrlParameter('zipcode', false);
    urlParamsHandler.setUrlParameter('district', false);
  };

  // Creates the button in our zoom controls to go to the national view
  function makeZoomToNationalButton() {
    document.querySelector('.mapboxgl-ctrl-compass').remove();

    var usaButton = document.createElement('button');

    usaButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-usa';
    usaButton.innerHTML = '<span class="usa-icon"></span>';
    usaButton.addEventListener('click', eventHandler.resetHome);

    document.querySelector('.mapboxgl-ctrl-group').appendChild(usaButton);
  }

  mapView.districtSelect = function(feature) {
    if (feature.state) {
      eventHandler.renderResults(feature.state, [feature.district], feature.geoID);
      var firstArg = feature.district ? feature.state : 'state';
      var secondArg = feature.district ? feature.district : feature.state;
      repCardHandler.renderRepresentativeCards(TownHall.lookupReps(firstArg, secondArg), $('#representativeCards section'), feature.state);

      urlParamsHandler.setUrlParameter('zipcode', false);
      urlParamsHandler.setUrlParameter('district', feature.state + '-' + feature.district + '-' + feature.geoID);
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
        var points = map.queryRenderedFeatures(e.point, { layers: ['townhall-points'] });
        // selected a marker
        if (points.length > 0) {
          feature.state = points[0].properties.stateAbbr;
          feature.district = points[0].properties.districtId;
          feature.geoID = points[0].properties.stateCode + feature.district;
          mapView.districtSelect(feature);
          return;
        }
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

  mapView.zeroPad = function zeroPad(districtID) {
    var padding = '00';
    return padding.substring(0, padding.length - districtID.length) + districtID;
  };
  // puts tele town halls by House members in the district.
  //TODO: geocode the data on the way in
  function teleTownHallMarker(townhall, state){
    if (townhall.District !== 'Senate') {
      var districtId = townhall.District.split('-')[1];
      districtId = mapView.zeroPad(districtId);
      key = townhall.District.split('-')[0] + districtId;
    } else {
      var key = state;
    }
    var bb = bboxes[key];
    if (!bb) {
      return townhall;
    }
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
    if (townhall.meetingType === 'DC Event' || !townhall.iconFlag) {
      return;
    }
    var iconKey = townhall.iconFlag;
    var districtId = '';
    var state = stateData.filter(function(ele){
      return ele.Name === townhall.State;
    });
    stateAbbr = state[0].USPS;
    stateCode = state[0].FIPS;
    if (townhall.District && townhall.District !== 'Senate') {
      if (!townhall.District.split('-')[1]) {
        return;
      }
      districtId = mapView.zeroPad(townhall.District.split('-')[1]);
    }

    if (iconKey === 'tele'){
      iconKey = 'phone-in';
      townhall = teleTownHallMarker(townhall, stateAbbr);
      if (!townhall.lat) {
        return;
      }
    }



    featuresHome.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: jitterPoint(townhall.lng, townhall.lat)
      },
      properties: {
        //TODO: normalize this.
        repeatingEvent: townhall.repeatingEvent,
        date: townhall.Date,
        Date: townhall.Date,
        Time: townhall.Time,
        district: townhall.District,
        District: townhall.District,
        districtId: districtId,
        stateCode: stateCode,
        stateAbbr: stateAbbr,
        member: townhall.Member,
        Member: townhall.Member,
        address: townhall.address,
        meetingType: townhall.meetingType,
        icon: iconKey
      },
    });
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
    }, 'district_interactive');
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
      var mapPopoverTemplate = Handlebars.getTemplate('mapPopover');
      var townhall = new TownHall(feature.properties);
      popup.setLngLat(feature.geometry.coordinates)
          .setHTML(mapPopoverTemplate(townhall))
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

  mapView.getBoundingBox = function(stateAbbr, districtCodes) {
    var statekey = stateAbbr,
      bb = bboxes[stateAbbr];
    if (districtCodes && districtCodes.length === 1) {
      statekey = statekey + districtCodes[0];
      bb = bboxes[statekey];
    } else if (districtCodes && districtCodes.length > 1) {
      bb = masterBoundingBox(stateAbbr, districtCodes);
    }
    return bb;
  };
  // Refocuses the map to predetermined bounding boxes based on a state code & (optionally) a district #.
  mapView.focusMap = function focusMap (bb) {
    var height = window.innerHeight,
      width = window.innerWidth,
      view = geoViewport.viewport(bb, [width/2, height/2]);
    if (view.zoom < 2.5) {
      view.zoom = 2.5;
    } else {
      view.zoom = view.zoom - 0.5;
    }
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
  function readData (webgl) {
    var townHallsFB = firebasedb.ref('/townHalls/');
    townHallsFB.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall (snapshot.val());
      TownHall.allTownHalls.push(ele);
      TownHall.addFilterIndexes(ele);
      tableHandler.initialTable(ele);

      if (webgl) {
        filterMap(ele);
        makePoint(ele);
      } else {
        noWebGlMapView.setData(ele);
      }
    });
    townHallsFB.once('value', function(snap) {
      if (webgl) {
        map.getSource('townhall-points').setData(featuresHome);
        mapView.initialView();
      }
      zipLookUpHandler.zipSearchByParam();
    });


  };

  function backSpaceHack () {
    var rx = /INPUT|SELECT|TEXTAREA/i;

    $(document).bind('keydown keypress', function(e) {
      if (e.which === 8) {
        if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
          mapView.killSidebar();
          urlParamsHandler.setUrlParameter('zipcode', false);
          urlParamsHandler.setUrlParameter('district', false);

          map.fitBounds(bounds);
          var visibility = mapView.map.getLayoutProperty('selected-fill', 'visibility');
          if (visibility === 'visible') {
            mapView.map.setLayoutProperty('selected-fill', 'visibility', 'none');
            mapView.map.setLayoutProperty('selected-border', 'visibility', 'none');
          }
        }
      }
    });
  }

  // Create a sidebar and map half view
  mapView.makeSidebar = function makeSidebar (selectedData) {
    $('.header-with-results').removeClass('hidden');
    $('.map-container-large').addClass('hidden');
    $('.map-container-split').removeClass('hidden');
    $('.map-legend').appendTo('.map-small');
    $('#map').prependTo('.map-fixing');
    if (mapView.webGL) {
      map.resize();
    } else {
      onResizeMap();
    }
  };

  // go back to full screen
  mapView.killSidebar = function killSidebar () {
    $('.header-with-results').addClass('hidden');
    $('.map-container-large').removeClass('hidden');
    $('.map-container-split').addClass('hidden');
    $('.map-legend').appendTo('.map-large');
    $('#map').prependTo('.map-large');
    if (mapView.webGL) {
      map.resize();
    }
  };

  $(document).ready(function(){
    if (!mapboxgl.supported()) {
      $('.show-if-no-webgl').removeClass('hidden');
      $('.hide-if-no-webgl').addClass('hidden');
      $('.map-container-split').addClass('no-web-gl');
      $('.webGL-kill').click(function(){
        $('.webgl-banner').addClass('hidden');
      });
      mapView.webGL = false;
      readData(false);
    } else {
      mapView.webGL = true;
      setMap();
      $( window ).resize(function() {
        bounds = mapView.zoomLocation ? mapView.zoomLocation : mainBB;
        mapView.focusMap(bounds);
      });
    }
  });
  module.mapView = mapView;

}(window));
