import geoViewport from '@mapbox/geo-viewport';
import $ from 'jquery';

import mapPopoverTemplate from '../../templates/mapPopover';
import fips from '../../data/fips-lookup';
import urlParamsHandler from '../lib/urlParams';
import mapHelperFunctions from '../lib/map-helper-functions';

import TownHall from '../models/TownHall';

import stateView from './stateView';
import mapView from './mapView';
import indexView from './indexView';
import eventHandler from './eventView';
import emailHandler from './emailSignUpView';

const mapboxView = {};
var map;
// Define an intial view for the map
var continentalView = function (w, h) {
  if (stateView.stateCoords) {
    return geoViewport.viewport(stateView.stateCoords, [w, h]);
  } else {
    return geoViewport.viewport([-128.8, 23.6, -65.4, 50.2], [w, h]);
  }
};

mapboxView.webGlinit = function () {
  mapView.webGL = true;
};

mapboxView.initialView = function setInitialView(map) {
  var bounds = mapboxView.getBounds();
  if (mapView.webGL) {
    map.fitBounds(bounds);
  }
};

mapboxView.resize = function () {
  map.resize();
};

// Refocuses the map to predetermined bounding boxes based on a state code & (optionally) a district #.
mapboxView.focusMap = function focusMap(bb) {
  if (!bb) {
    return;
  }
  var height = window.innerHeight,
    width = window.innerWidth,
    view = geoViewport.viewport(bb, [width / 2, height / 2]);
  if (view.zoom < 2.5) {
    view.zoom = 2.5;
  } else {
    view.zoom = view.zoom - 0.5;
  }
  map.flyTo(view);
};

mapboxView.getBounds = function () {
  var bounds;
  if (stateView.stateCoords) {
    bounds = new mapboxgl.LngLatBounds(stateView.stateCoords);
  } else {
    bounds = new mapboxgl.LngLatBounds([-128.8, 23.6], [-65.4, 50.2]);
  }
  return bounds;
};

mapboxView.setMap = function (style, parentBB) {
  // Specify Mapbox default access token
  var accessToken = 'pk.eyJ1IjoidG93bmhhbGxwcm9qZWN0IiwiYSI6ImNqMnRwOG4wOTAwMnMycG1yMGZudHFxbWsifQ.FXyPo3-AD46IuWjjsGPJ3Q';
  // Specify uploaded Mapbox Studio style URL
  var styleURL = style ? style : 'mapbox://styles/townhallproject/cj2tpe64q000y2spk1wjsrilw';
  var continental = continentalView(window.innerWidth / 2, window.innerHeight / 2);
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
  $(window).resize(function () {
    var bb = parentBB;
    var bounds = mapView.zoomLocation ? mapView.zoomLocation : bb;
    mapView.focusMap(bounds);
  });
  map.addControl(new mapboxgl.AttributionControl(), 'top-left');

  mapboxView.initialView(map);

  // Set Mapbox map controls
  map.addControl(new mapboxgl.NavigationControl());
  // Disable mousescroll zoom except after clicking map.
  // Using jQuery because this mapbox api doesn't support focus or blur 
  map.scrollZoom.disable();
  $('canvas.mapboxgl-canvas').on('focus', (function () { map.scrollZoom.enable(); }));
  $('canvas.mapboxgl-canvas').on('blur', (function () { map.scrollZoom.disable(); }));
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  return map;
};

mapboxView.onLoad = function (state) {
  mapboxView.backSpaceHack();
  mapboxView.makeZoomToNationalButton(state);
  mapboxView.addPopups(state);
  mapboxView.addLayer();
};

mapboxView.resetMap = function (map) {
  mapboxView.initialView(map);
  var visibility = map.getLayoutProperty('selected-fill', 'visibility');
  if (visibility === 'visible') {
    map.setLayoutProperty('selected-fill', 'visibility', 'none');
    map.setLayoutProperty('selected-border', 'visibility', 'none');
  }
};

// Creates the button in our zoom controls to go to the national view
mapboxView.makeZoomToNationalButton = function (state) {
  document.querySelector('.mapboxgl-ctrl-compass').remove();
  if (document.querySelector('.state-icon')) {
    document.querySelector('.state-icon').remove();
  }
  if (document.querySelector('.mapboxgl-ctrl-usa')) {
    document.querySelector('.mapboxgl-ctrl-usa').remove();
  }
  var usaButton = document.createElement('button');
  usaButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-usa';

  if (state) {
    usaButton.innerHTML = '<span class="state-icon">' + state + '</span>';
  } else {
    usaButton.innerHTML = '<span class="usa-icon"></span>';
  }
  usaButton.addEventListener('click', () => {
    mapboxView.setDistrict(null)
    indexView.resetHome();
  });
  document.querySelector('.mapboxgl-ctrl-group').appendChild(usaButton);
};

mapboxView.districtSelect = function (feature) {
  if (feature.state) {
    var locationData = {
      federal: {
        state: feature.state,
        districts: [feature.district],
        selections: [feature.geoID],
      }
    };
    mapboxView.setDistrict(locationData);
    eventHandler.renderResults(locationData);
    var firstArg = feature.district ? feature.state : 'state';
    var secondArg = feature.district ? feature.district : feature.state;
    // TODO: Figure out emailHandler function called now 
    // that it is inside react component

    // emailHandler.clearDistricts();
    // emailHandler.addDistrict(feature.state + '-' + feature.district);
    urlParamsHandler.setUrlParameter('zipcode', false);
    urlParamsHandler.setUrlParameter('district', feature.state + '-' + feature.district + '-' + feature.geoID);
  } else {
    var visibility = map.getLayoutProperty('selected-fill', 'visibility');
    if (visibility === 'visible') {
      map.setLayoutProperty('selected-fill', 'visibility', 'none');
      map.setLayoutProperty('selected-border', 'visibility', 'none');
    }
    mapboxView.setDistrict(null);
  }
};

mapboxView.hightlightStateDistrictOutlines = function (feature) {
  // set district highlight
  var filterHouse = ['all', ['==', 'GEOID', feature.house_geoId]];
  var filterSenate = ['all', ['==', 'GEOID', feature.senate_geoId]];

  // set filters
  toggleFilters('states-house-districts-selected', filterHouse);
  toggleFilters('states-senate-districts-selected', filterSenate);
};

mapboxView.getResultsFromSelectingStateDistrict = function (feature) {
  // clear district highlight
  mapboxView.removeHighlights();

  mapboxView.hightlightStateDistrictOutlines(feature);

  if (feature.state) {
    var locationData = {
      federal: {
        state: feature.state,
        districts: [feature.senate_district, feature.house_district],
        selections: [],
      },
      upper: {
        districts: [feature.senate_district],
        upperEvents: []
      },
      lower: {
        districts: [feature.house_district],
        lowerEvents: []
      }
    };
    eventHandler.renderResults(locationData);
  }
};

mapboxView.getResultsFromSelectingPoint = function (feature) {
  var locationData = {
    federal: {
      state: feature.state,
      districts: [],
      selections: []
    },
    upper: {
      districts: [],
      upperEvents: []
    },
    lower: {
      districts: [],
      lowerEvents: []
    }
  };
  // clear district highlight
  mapboxView.removeHighlights();

  if (feature.house_geoId) {
    var filterHouse = ['all', ['==', 'GEOID', feature.house_geoId]];
    map.setFilter('states-house-districts-selected', filterHouse);
    map.setLayoutProperty('states-house-districts-selected', 'visibility', 'visible');
    locationData.federal.districts.push(feature.house_district);
    locationData.lower.districts.push(feature.house_district);

  } else if (feature.senate_geoId) {

    var filterSenate = ['all', ['==', 'GEOID', feature.senate_geoId]];
    map.setFilter('states-senate-districts-selected', filterSenate);
    map.setLayoutProperty('states-senate-districts-selected', 'visibility', 'visible');
    locationData.federal.districts.push(feature.senate_district);
    locationData.upper.districts.push(feature.senate_district);

  }
  eventHandler.renderResults(locationData);
};

// Offset points slightly to see events happening at same location.
function jitterPoint(lng, lat) {
  var jitter = Math.random() * .001;
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  var plusOrMinus1 = Math.random() < 0.5 ? -1 : 1;
  return [lng + jitter * plusOrMinus, lat + jitter * plusOrMinus1];
}

mapboxView.featuresHome = {
  type: 'FeatureCollection',
  features: []
};

mapboxView.addLayer = function () {
  map.addLayer({
    'id': 'townhall-points',
    'type': 'symbol',
    'source': {
      'type': 'geojson',
      'data': mapboxView.featuresHome
    },
    'layout': {
      'icon-image': '{icon}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
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
};

mapboxView.addStateLayer = function () {
  map.addLayer({
    'id': 'townhall-points-state',
    'type': 'symbol',
    'source': {
      'type': 'geojson',
      'data': mapboxView.featuresHome
    },
    'layout': {
      'icon-image': '{icon}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
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
};

// Adds a Popup listener to the point layer.
mapboxView.addPopups = function (state) {
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['townhall-points'] });
    if (state) {
      var featuresState = map.queryRenderedFeatures(e.point, { layers: ['townhall-points-state'] });
      features = features.concat(featuresState);
    }
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    if (!features.length) {
      popup.remove();
      return;
    }
    var feature = features[0];
    var townhall = new TownHall(feature.properties);
    townhall.makeFormattedMember();
    popup.setLngLat(feature.geometry.coordinates)
      .setHTML(mapPopoverTemplate(townhall))
      .addTo(map);
  });
};

mapboxView.backSpaceHack = function () {
  var rx = /INPUT|SELECT|TEXTAREA/i;

  $(document).bind('keydown keypress', function (e) {
    if (e.which === 8) {
      if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
        mapView.killSidebar();
        urlParamsHandler.setUrlParameter('zipcode', false);
        urlParamsHandler.setUrlParameter('district', false);
        var bounds = mapboxView.getBounds();
        map.fitBounds(bounds);
        var visibility = map.getLayoutProperty('selected-fill', 'visibility');
        if (visibility === 'visible') {
          map.setLayoutProperty('selected-fill', 'visibility', 'none');
          map.setLayoutProperty('selected-border', 'visibility', 'none');
        }
      }
    }
  });
};

function stateDistristListener(e) {
  // when selecting a point
  var pointFeature = {};

  var points = map.queryRenderedFeatures(e.point, { layers: ['townhall-points-state'] });
  if (points && points.length > 0) {
    var clickedPoint = points[0];
    pointFeature.state = clickedPoint.properties.stateAbbr;
    var district = clickedPoint.properties.district;
    var pointDistrict = district.substring(district.lastIndexOf('-') + 1, district.length);

    if (clickedPoint.properties.chamber === 'lower') {
      pointFeature.house_district = mapHelperFunctions.zeroPad(pointDistrict);
      pointFeature.house_geoId = clickedPoint.properties.stateCode + '0' + pointFeature.house_district;

    } else if (clickedPoint.properties.chamber === 'upper') {
      pointFeature.senate_district = mapHelperFunctions.zeroPad(pointDistrict);
      pointFeature.senate_geoId = clickedPoint.properties.stateCode + '0' + pointFeature.senate_district;
    }

    return mapboxView.getResultsFromSelectingPoint(pointFeature);
  }

  // when selecting a location on map
  var districtFeature = {};
  var checkIfValidState = map.queryRenderedFeatures(e.point, { layers: ['state-mask'] });
  if (checkIfValidState.length > 0 && checkIfValidState[0].layer.id === 'state-mask') {
    return;
  }
  var features = map.queryRenderedFeatures(
    e.point,
    {
      layers: ['states-house-districts-interactive', 'states-senate-districts-interactive']
    });
  if (features.length > 0) {
    districtFeature.state = Object.keys(fips).filter(function (key) { return fips[key] === features[0].properties.STATEFP; })[0];
    for (var i = 0; i < features.length; i++) {
      if (features[i].layer.id.includes('house')) {
        districtFeature.house_district = mapHelperFunctions.zeroPad(features[i].properties.SLDLST);
        districtFeature.house_geoId = features[i].properties.GEOID;
      } else if (features[i].layer.id.includes('senate')) {
        districtFeature.senate_district = mapHelperFunctions.zeroPad(features[i].properties.SLDUST);
        districtFeature.senate_geoId = features[i].properties.GEOID;
      }
    }
    mapboxView.getResultsFromSelectingStateDistrict(districtFeature);
  }
}

function districtListener(e) {
  var feature = {};
  var points = map.queryRenderedFeatures(e.point, { layers: ['townhall-points'] });
  // selected a marker
  if (points.length > 0) {
    feature.state = points[0].properties.stateAbbr;
    feature.district = points[0].properties.districtId;
    feature.geoID = points[0].properties.stateCode + feature.district;
    mapboxView.districtSelect(feature);
    return;
  }
  var features = map.queryRenderedFeatures(
    e.point,
    {
      layers: ['district_interactive']
    });
  if (features.length > 0) {
    feature.state = features[0].properties.ABR;
    feature.district = features[0].properties.GEOID.substring(2, 4);
    feature.geoID = features[0].properties.GEOID;
    mapboxView.districtSelect(feature);
  }

}

// Add click listener to each district. Used for creating the sidebar, drawing a 'selected' state to the district, & zooming in.
mapboxView.addDistrictListener = function () {
  map.on('click', districtListener);
};

mapboxView.addStateDistrictListener = function () {
  map.on('click', stateDistristListener);
};

mapboxView.removeListeners = function () {
  map.off('click', districtListener);
  map.off('click', stateDistristListener);
};

var filterDistrict = ['any'];
var includedStates = ['in', 'ABR'];

mapboxView.filterMap = function (townHall) {
  // Fetch states with senators in em'
  if (townHall.meetingType === 'DC Event' || townHall.chamber === 'nationwide') {
    return;
  }

  var district = townHall.district;

  if (!district) {
    if (!townHall.state) {
      return;
    }
    if (!includedStates.includes(townHall.state)) {
      includedStates.push(townHall.state);
    }
  }

  var filterSenate = ['all', includedStates];
  // Fetch districts w/ town halls occuring
  if (district) {
    var districtId = district;
    var fipsId = fips[townHall.state];
    var geoid = fipsId + mapHelperFunctions.zeroPad(districtId);
    filterDistrict.push(['==', 'GEOID', geoid]);
  }
  // Apply the filters to each of these layers
  toggleFilters('senate_fill', filterSenate);
  toggleFilters('district_fill', filterDistrict);
};

function toggleFilters(layer, filter) {
  try {
    map.setFilter(layer, filter);
    map.setLayoutProperty(layer, 'visibility', 'visible');
    
  } catch (error) {
    
  }
}

// Handles the highlight for districts when clicked on.
mapboxView.highlightDistrict = function highlightDistrict(geoid) {
  var filter;
  // Filter for which district has been selected.
  if (typeof geoid === 'object') {
    filter = ['any'];

    geoid.forEach(function (i) {
      filter.push(['==', 'GEOID', i]);
    });
  } else {
    filter = ['all', ['==', 'GEOID', geoid]];
  }
  // Set that layer filter to the selected
  toggleFilters('selected-fill', filter);
  toggleFilters('selected-border', filter);
};

// cleares all selections and district visibility - used in toggle
mapboxView.removeHighlights = function () {
  map.setLayoutProperty('states-house-districts-selected', 'visibility', 'none');
  map.setLayoutProperty('states-senate-districts-selected', 'visibility', 'none');

  map.setLayoutProperty('selected-fill', 'visibility', 'none');
  map.setLayoutProperty('selected-border', 'visibility', 'none');
};

// Creates the point layer.
mapboxView.makePoint = function (townhall, stateIcon) {
  if (townhall.meetingType === 'DC Event' || !townhall.iconFlag) {
    return;
  }
  var iconKey = townhall.iconFlag;
  var stateAbbr = townhall.state;
  var stateCode = fips[stateAbbr];
  var districtId = townhall.district ? townhall.district : '';
  var array = mapboxView.featuresHome;

  if (iconKey === 'tele') {
    iconKey = 'phone-in';
    townhall = mapHelperFunctions.teleTownHallMarker(townhall, stateAbbr);
    if (!townhall.lat) {
      return;
    }
  }
  // makes staff icon smaller
  iconKey = iconKey === 'staff' ? 'staff-small' : iconKey;
  if (townhall.level ==='state' && townhall.district) {
    townhall.chamber = townhall.district.split('-')[0] === 'HD' ? 'lower' : 'upper';
  }
  array.features.push({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: jitterPoint(townhall.lng, townhall.lat)
    },
    properties: {
      //TODO: normalize this.
      repeatingEvent: townhall.repeatingEvent,
      date: townhall.dateString,
      Time: townhall.Time,
      chamber: townhall.chamber || null,
      district: townhall.district,
      displayDistrict: townhall.displayDistrict.split(' (')[0],
      districtId: districtId,
      stateCode: stateCode,
      stateAbbr: stateAbbr,
      displayName: townhall.displayName,
      Member: townhall.Member,
      address: townhall.address,
      meetingType: townhall.meetingType,
      icon: iconKey,
      level: townhall.level,
      stateIcon: stateIcon || undefined
    },
  });
};

mapboxView.setStateData = function () {
  map.setLayoutProperty('townhall-points', 'visibility', 'none');
  map.getSource('townhall-points-state').setData(mapboxView.featuresHome);
};

mapboxView.setData = function () {
  map.getSource('townhall-points').setData(mapboxView.featuresHome);
};

mapboxView.showStateLegend = function () {
  $('.state-lines').removeClass('hidden').show();
};

mapboxView.hideStateLegend = function () {
  $('.state-lines').hide();
};

mapboxView.toggleBorders = function () {
  $('.border-toggle').removeClass('active');
  $(this).addClass('active');
  mapboxView.removeHighlights();
  mapboxView.removeListeners();
  if (this.id === 'show-federal-borders') {
    map.setLayoutProperty('states-house-districts', 'visibility', 'none');
    map.setLayoutProperty('states-senate-districts', 'visibility', 'none');
    map.setLayoutProperty('district_border', 'visibility', 'visible');
    mapboxView.addDistrictListener();
  } else if (this.id === 'show-state-borders') {
    map.setLayoutProperty('district_border', 'visibility', 'none');
    map.setLayoutProperty('states-house-districts', 'visibility', 'visible');
    map.setLayoutProperty('states-senate-districts', 'visibility', 'visible');
    mapboxView.addStateDistrictListener();
  }
};

mapboxView.setborderListeners = function () {
  $('.border-toggle').on('click', mapboxView.toggleBorders);
};

export default mapboxView;
