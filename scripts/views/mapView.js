(function closure(module) {
  var map;
  var mapView = {};
  mapView.zoomLocation = false;

  mapView.setMap = function(style, parentBB, ctxbounds){
    map = mapboxView.setMap(style, parentBB, ctxbounds);
    return map;
  };

  mapView.resetView = function resetView() {
    mapView.killSidebar();
    mapView.zoomLocation = false;
    $('#representativeCards').hide();
    if (mapView.webGL && map) {
      mapboxView.resetMap(map);
    } else {
      noWebGlMapView.resetMap();
    }
    urlParamsHandler.setUrlParameter('zipcode', false);
    urlParamsHandler.setUrlParameter('district', false);
  };

  mapView.focusMap = function(bb) {
    if (mapView.webGL) {
      mapboxView.focusMap(bb);
    } else {
      noWebGlMapView.focusMap(bb);
    }
  };

  // Fetch data from Firebase, run map filter & point layers
  // listens for new data.
  mapView.readData = function(webgl) {
    var townHallsFB = firebasedb.ref('/townHalls/');
    townHallsFB.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall (snapshot.val());
        ///If no state filter show all results
      TownHall.allTownHalls.push(ele);
      TownHall.addFilterIndexes(ele);
      tableHandler.initialTable(ele);
      if (webgl) {
        mapboxView.filterMap(ele);
        mapboxView.makePoint(ele);
      } else {
        noWebGlMapView.setData(ele);
      }
    });
    townHallsFB.once('value', function() {
      if (webgl) {
        mapboxView.setData();
      }
      zipLookUpHandler.zipSearchByParam();
    });
  };

  mapView.readStateData = function(webgl, state) {
    ///If in state view filter the results before they get displayed on the map and in the table
    var townHallsFB = firebasedb.ref('/townHalls/');
    townHallsFB.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall (snapshot.val());
      if (ele.state === state) {
        TownHall.allTownHalls.push(ele);
        TownHall.addFilterIndexes(ele);
        tableHandler.initialTable(ele);
        if (webgl) {
          mapboxView.filterMap(ele);
          mapboxView.makePoint(ele);
        } else {
          noWebGlMapView.setData(ele);
        }
      }
    });
    townHallsFB.once('value', function() {
      if (webgl) {
        mapboxView.setData();
      }
      zipLookUpHandler.zipSearchByParam();
    });
  };

  // Create a sidebar and map half view
  mapView.makeSidebar = function makeSidebar () {
    $('.header-with-results').removeClass('hidden');
    $('.map-container-large').addClass('hidden');
    $('.map-container-split').removeClass('hidden');
    $('.map-legend').appendTo('.map-small');
    $('#map').prependTo('.map-fixing');
    if (mapView.webGL) {
      mapboxView.resize();
    } else {
      noWebGlMapView.onResizeMap();
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
      mapboxView.resize();
    }
  };

  module.mapView = mapView;

}(window));
