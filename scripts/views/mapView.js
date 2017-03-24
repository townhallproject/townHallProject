(function closure(firebase) {

  var eventHandler = {};
  var townhallData;
  var map;
  
  // Define an intial view for the US
  var continentalView = function(w,h) { return geoViewport.viewport([-128.8, 23.6, -65.4, 50.2], [w, h]); };
  var continental = continentalView(window.innerWidth/2, window.innerHeight/2);

  function setMap(){
    // Specify Mapbox default access token
    var accessToken = 'pk.eyJ1IjoiZG1vcmlhcnR5IiwiYSI6ImNpejlid2Y1djAxNWsyeHFwNTVoM2ZibWEifQ.MlGaldJiUQ91EDGdjJxLsA';

    // Specify uploaded Mapbox Studio style URL
    var styleURL = 'mapbox://styles/dmoriarty/cizljl81e000x2rqk280evaee';
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
    });
  }

  // Creates the button in our zoom controls to go to the national view
  function makeZoomToNationalButton() {
    document.querySelector('.mapboxgl-ctrl-compass').remove();

    var usaButton = document.createElement('button');

    usaButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-usa';
    usaButton.innerHTML = '<span class="usa-icon"></span>';
    usaButton.addEventListener('click', function(){
      killSidebar();
      map.flyTo(continentalView(window.innerWidth/2, window.innerHeight/2));
    });

    document.querySelector('.mapboxgl-ctrl-group').appendChild(usaButton);
  }

  // Add click listener to each district. Used for creating the sidebar, drawing a 'selected' state to the district, & zooming in. TODO: Plug into a sidebar to draw up the list of Town Halls.
  function addDistrictListener() {
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
        focusMap(feature.properties.ABR, feature.properties.GEOID.substring(2,4));
        highlightDistrict(feature.properties.GEOID);
        makeSidebar(feature.properties.ABR, feature.properties.GEOID.substring(2,4))
      } else {
        var visibility = map.getLayoutProperty('selected-fill', 'visibility');
        if (visibility === 'visible') {
          map.setLayoutProperty('selected-fill', 'visibility', 'none');
          map.setLayoutProperty('selected-border', 'visibility', 'none');
        }
      }
    });
  }

  // Fetch data from Firebase, run map filter & point layers
  function readData () {
    var townHallsFB = firebase.database().ref('/townHalls/').once('value').then(function(snapshot){
      var ele = new TownHall (snapshot.val());
      townhallData = ele

      filterMap(ele);
      makePointLayer(ele);
      makeTable(ele);
    });
  };

  // Creates the point layer. TODO: Replace circle feature type with icons
  function makePointLayer (data) {
    var featuresHome = {
      type: 'FeatureCollection',
      features: []
    };

    for (key in data){
      var type = data[key].meetingType;

      if (type === 'Teletown Hall' || type === 'Tele-town Hall'){
        var iconKey = 'phone-in';
      } else {
        var iconKey = 'in-person';
      }

      if (data[key].lat) {
        featuresHome.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [data[key].lng, data[key].lat]
          },
          properties: {
            district: data[key].District,
            icon: iconKey
          },
        });
      }
    }

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

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.district)
          .addTo(map);
    });
  }

  // Does the initial filter for the map to determine which districts have Town Halls. TODO: Add in a data-driven style for the district layer that does a different fill if it's a local represenative vs. a Senator
  function filterMap (townHallData) {
    var filterDistrict = ['any'];
    var includedStates = ['in', 'NAME'];

    // Fetch states with senators in em'
    for (key in townHallData){
      k = townHallData[key]

      if (k.StateAb === 'AZ') {
        console.log(k)
      }

      if (k.District == 'Senate' && k.State && k.City !== 'Washington') {
        includedStates.push(k.State)
      }
    }

    var filterSenate = ['all', includedStates];

    // Fetch districts w/ town halls occuring
    for (key in townHallData){
      k = townHallData[key]
      district = k.District;

      if (district && district !== 'Senate' && k.City !== 'Washington') {
        var districtId = district.substring(3,5);
        var getFIPS;

        if (districtId.length === 1){
          districtId = '0' + districtId;
        }

        stateData.forEach(function(n){
          if (n.Name === k.State) {
            getFIPS = n.FIPS;
          }
        });

        var geoid = getFIPS + districtId;

        filterSenate.push(['!=', 'GEOID', geoid]);
        filterDistrict.push(['==', 'GEOID', geoid]);
      }
    }

    // Apply the filters to each of these layers
    toggleFilters(['senate_glow', 'senate_fill'], filterSenate);
    toggleFilters(['district_glow', 'district_fill'], filterDistrict);
  }

  function toggleFilters (layers, filter) {
    layers.forEach(function (layer) {
      map.setFilter(layer, filter);
      map.setLayoutProperty(layer, 'visibility', 'visible');
    })
  }

  // Refocuses the map to predetermined bounding boxes based on a state code & (optionally) a district #.
  function focusMap (stateAbbr, districtCode) {
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

  // Make the Table below the map
  function makeTable (data) {
    var tableRowTemplate = Handlebars.getTemplate('eventTableRow');
    for (key in data){
      var ele = data[key];
      if(ele.Member){
        var id = ele.Member+ele.Date;
        ele.rowid = id.replace(/[\W]/g, '');
        TownHall.allTownHalls.push(ele);
        $('#all-events-table').append(tableRowTemplate(ele));
      }
    }
  }

  // Assign Zip Lookup function to Search field
  function sidebarEvents () {
    $('#look-up').on('submit', eventHandler.lookup);
  }

  function killSidebar () {
      $('.header-with-results').addClass('hidden')
      $('.map-container-large').removeClass('hidden')
      $('.map-container-split').addClass('hidden')
      $('#map').prependTo('.map-large')
      map.resize();
  }

  // Zip Code Lookup!
  eventHandler.lookup = function (e) {
    e.preventDefault();
    var zip = $('#look-up input').val();
    if (zip) {
      var validDistricts = [];
      var callbackTrigger = 0;
      var thisState;

      zipLookup.forEach(function(n){
        if (n.zip === zip) {
          focusMap(n.abr, n.dis);
          thisState = n.abr;
          validDistricts.push(n.dis);
        // Fall back on first four strings if exact zip match doesn't exist
        } else if (n.zip.substring(0,4) === zip.substring(0,4)) {
          focusMap(n.abr, n.dis);
          thisState = n.abr;
          validDistricts.push(n.dis);
        }

        callbackTrigger++;
        if(callbackTrigger === zipLookup.length){
          makeSidebar(thisState, validDistricts);
        }
      });
    }
  };

  // Match the looked up zip code to district #
  function matchSelectionToZip (state, districts) {
    var fetchedData = []

    for (key in townhallData){
      var k = townhallData[key];
      if (k.StateAb === state) {
        if (k.District === 'Senate') {
          fetchedData.push(k)
        } else {
          if(districts.constructor === Array) {
            districts.forEach((d) => {
              let districtMatcher = state + '-' + d
              if (k.District === districtMatcher) {
                fetchedData.push(k)
              }
            })   
          } else {
            let districtMatcher = state + '-' + districts
            if (k.District === districtMatcher) {
              fetchedData.push(k)
            }
          }
        }
      }
    }

    return fetchedData
  }

  // Create a sidebar and load it with Town Hall event cards.
  function makeSidebar (state, districts) {
    var districtMatcher = state + '-' + districts;
    let selectedData = matchSelectionToZip(state, districts)
    var districtCard = Handlebars.getTemplate('eventCards');

    $('.nearest-with-results').empty()

    selectedData.forEach((d) => {
      $('.nearest-with-results').append(districtCard(d))
    });

    $('.map-container-large').addClass('hidden')
    $('.map-container-split').removeClass('hidden')
    $('#map').prependTo('.map-fixing')

    map.resize();
  }

  $(document).ready(function(){
    setMap();
    readData();
    sidebarEvents();
    $('.kill-results').on('click', killSidebar());
  });

}(window.firebase));
