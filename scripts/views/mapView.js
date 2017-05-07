(function closure(firebase) {

  var townhallData;
  var map;

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
        makeSidebar(feature.properties.ABR, feature.properties.GEOID.substring(2,4));
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
      townhallData = ele;

      filterMap(ele);
      makePointLayer(ele);
      makeTable(ele);
    });
  };

  // Creates the point layer.
  function makePointLayer (data) {
    var featuresHome = {
      type: 'FeatureCollection',
      features: []
    };

    for (key in data){
      var type = data[key].meetingType;

      if (type === 'Teletown Hall' || type === 'Tele-Town Hall'){
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
            member: data[key].Member,
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
      var popupDistrict = '';

      if (feature.properties.district && feature.properties.district !== 'Senate') {
        popupDistrict = ', District ' + (feature.properties.district).substring(3);
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(feature.geometry.coordinates)
          .setHTML('<b>' + feature.properties.member + '</b>' + popupDistrict)
          .addTo(map);
    });
  }

  // Does the initial filter for the map to determine which districts have Town Halls. TODO: Add in a data-driven style for the district layer that does a different fill if it's a local represenative vs. a Senator
  function filterMap (townHallData) {
    var filterDistrict = ['any'];
    var includedStates = ['in', 'NAME'];

    // Fetch states with senators in em'
    for (key in townHallData){
      k = townHallData[key];

      if (k.District === 'Senate' && k.State) {
        includedStates.push(k.State);
      }
    }

    var filterSenate = ['all', includedStates];

    // Fetch districts w/ town halls occuring
    for (key in townHallData){
      k = townHallData[key];

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

        filterDistrict.push(['==', 'GEOID', geoid]);
      }
    }

    // Apply the filters to each of these layers
    toggleFilters('senate_fill', filterSenate);
    toggleFilters('district_fill', filterDistrict);
  }

  function toggleFilters (layer, filter) {
    map.setFilter(layer, filter);
    map.setLayoutProperty(layer, 'visibility', 'visible');
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

  // Zip Code Lookup!
  eventHandler.lookup = function (e) {
    e.preventDefault();
    var zip = $('#look-up input').val();
    if (zip) {
      var validDistricts = [];
      var validSelections = [];
      var callbackTrigger = 0;
      var thisState;
      var stateCode;

      zipLookup.forEach(function(n){
        if (n.zip === zip || n.zip.substring(0,4) === zip.substring(0,4)) {
          stateData.forEach(function(l){
            if (l.USPS === n.abr) {
              stateCode = l.FIPS;
            }
          });
          var geoid = stateCode + n.dis;

          focusMap(n.abr, n.dis);
          thisState = n.abr;
          validDistricts.push(n.dis);
          validSelections.push(geoid);
        }

        callbackTrigger++;
        if(callbackTrigger === zipLookup.length){
          highlightDistrict(validSelections);
          makeSidebar(thisState, validDistricts);
        }
      });
    }
  };
// listens for new events
// Adds all events into main data array
// Adds all events as markers
// renders tables
  // window.readData = function (){
  //   var townHallsFB = firebase.database().ref('/townHalls/').orderByChild('dateObj');
  //   townHallsFB.on('child_added', function getSnapShot(snapshot) {
  //     var tableRowTemplate = Handlebars.getTemplate('eventTableRow');
  //     var mapPopoverTemplate = Handlebars.getTemplate('mapPopover');
  //     var ele = new TownHall (snapshot.val());
  //     TownHall.allTownHalls.push(ele);
  //     TownHall.addFilterIndexes(ele);
  //     eventHandler.initialTable(ele);
  //     $('[data-toggle="popover"]').popover({
  //       container: 'body',
  //       html:true
  //     });
  //     var coords = [ele.lng, ele.lat];
  //     var latLng = new google.maps.LatLng(coords[1], coords[0]);
  //     // eslint-disable-next-line no-unused-vars
  //     ele.addressLink = 'https://www.google.com/maps?q=' + escape(ele.address);
  //     var contentString = mapPopoverTemplate(ele);
  //     var marker = new google.maps.Marker({
  //       strokeColor: '#FF0000',
  //       strokeOpacity: 0.8,
  //       strokeWeight: 0.5,
  //       fillColor: '#FF0000',
  //       fillOpacity: 0.35,
  //       map: map,
  //       position: latLng,
  //       name: ele.name,
  //       time: ele.time
  //     });
  //     marker.setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png');
  //     marker.addListener('click', function() {
  //       infowindow.setContent(contentString);
  //       infowindow.open(map, marker);


  // Match the looked up zip code to district #
  function matchSelectionToZip (state, districts) {
    var fetchedData = [];
    var stateName;

    // Fetch full state name
    stateData.forEach(function(n){
      if (n.USPS === state) {
        stateName = n.Name;
      }
    });

    // Filter through the town halls
    for (key in townhallData){
      var k = townhallData[key];

      // Filter townhalls for ones within this state
      if (k.State === stateName) {

        // If this townhall is a Senate race, automatically add it
        if (k.District === 'Senate') {
          fetchedData.push(k);
        } else {

          // Otherwise, check to see if there are multiple districts captured. (In the case of looking up via zip code)
          if(districts.constructor === Array) {
            districts.forEach(function(d) {
              var districtMatcher = state + '-' + parseInt(d);
              var dataMatcher = k.District.substring(0,3) + k.District.substring(3);

              if (districtMatcher === dataMatcher) {
                fetchedData.push(k);
              }
            });

          // If only one district is selected, match it up from that
          } else {
            var districtNumber = parseInt(k.District.substring(3));

            if (districtNumber === parseInt(districts)) {
              fetchedData.push(k);
            }
          }
        }
      }
    }

    return fetchedData;
  }

  // Create a sidebar and load it with Town Hall event cards.
  function makeSidebar (state, districts) {

    var districtMatcher = state + '-' + districts;
    var selectedData = matchSelectionToZip(state, districts);
    var districtCard = Handlebars.getTemplate('eventCards');

    $('.nearest-with-results').empty();

    selectedData.forEach(function(d) {
      d.partyShorten = d.Party.slice(0,3);
      $('.nearest-with-results').append(districtCard(d));
    });

    $('.map-container-large').addClass('hidden');
    $('.map-container-split').removeClass('hidden');
    $('#map').prependTo('.map-fixing');
    map.resize();
  }

  function killSidebar () {
    $('.header-with-results').addClass('hidden');
    $('.map-container-large').removeClass('hidden');
    $('.map-container-split').addClass('hidden');
    $('#map').prependTo('.map-large');
    map.resize();
  }

  $(document).ready(function(){
    setMap();
    readData();
    sidebarEvents();
    $('.kill-results').on('click', function() {
      killSidebar();
    });
  });

}(window.firebase));
