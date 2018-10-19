(function closure(module) {
  var map;
  var mapView = {};
  mapView.zoomLocation = false;

  mapView.setMap = function(style, parentBB, ctxbounds){
    map = mapboxView.setMap(style, parentBB, ctxbounds);
    return map;
  };

  mapView.initialView = function resetView() {
    mapView.killSidebar();
    mapView.zoomLocation = false;
    $('#representativeCards').hide();
    if (mapView.webGL && map) {
      mapboxView.resetMap(map);
    } else if (window.google) {
      noWebGlMapView.resetMap();
    }
  };


  mapView.resetView = function resetView() {
    mapView.killSidebar();
    mapView.zoomLocation = false;
    $('#representativeCards').hide();
    if (mapView.webGL && map) {
      mapboxView.resetMap(map);
    } else if (window.google) {
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
    mapboxView.featuresHome.features = [];
    var townHallsFB = firebasedb.ref('/townHalls/');
    tableHandler.clearTableData();
    townHallsFB.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall(snapshot.val());
      ///If no state filter show all results
      ele.level = 'federal';
      ele.makeDisplayDistrict();
      var index = TownHall.allTownHalls.length;
      TownHall.allTownHalls.push(ele);
      ele.getIsPledger().then(function(updated){
        TownHall.allTownHalls[index] = updated;
      });
      TownHall.addFilterIndexes(ele);
      tableHandler.initialMainTable(ele);
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
    mapboxView.featuresHome.features = [];
    TownHall.allTownHalls = [];
    TownHall.allStateTownHalls = [];

    var numberDone = 0;
    ///If in state view filter the results before they get displayed on the map and in the table
    var townHallsFB = firebasedb.ref('/state_townhalls/' + state + '/');
    ///clear previous table if it exists
    tableHandler.clearTableData();
    townHallsFB.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall(snapshot.val());
      
      ele.chamber = ele.district.split('-')[0] === 'HD' ? 'lower' : 'upper';
      ele.level = 'state';
      ele.makeDisplayDistrict();
      TownHall.allStateTownHalls.push(ele);
      TownHall.addFilterIndexes(ele);
      tableHandler.initialStateTable(ele);
      if (webgl) {
        mapboxView.filterMap(ele);
        mapboxView.makePoint(ele, true);
      } else {
        noWebGlMapView.setData(ele);
      }
    });
    var townHallsFBFederal = firebasedb.ref('/townHalls/');
    townHallsFBFederal.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall (snapshot.val());
      ele.level = 'federal';
      ele.makeDisplayDistrict();
      if (ele.state === state) {
        TownHall.allTownHalls.push(ele);
        TownHall.addFilterIndexes(ele);
        tableHandler.initialStateTable(ele);
        if (webgl) {
          mapboxView.filterMap(ele);
          mapboxView.makePoint(ele);
        } else {
          noWebGlMapView.setData(ele);
        }
      }

    });
    townHallsFBFederal.once('value', function() {
      numberDone++;
      if (numberDone === 2){
        if (webgl) {
          mapboxView.setStateData();
        }
        zipLookUpHandler.zipSearchByParam();
      }
    });
    townHallsFB.once('value', function () {
      numberDone++;
      if (numberDone === 2) {
        if (webgl) {
          mapboxView.setStateData();
        }
        zipLookUpHandler.zipSearchByParam();
      }
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

