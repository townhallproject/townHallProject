(function(module){
  var stateView = {};

  stateView.maskCountry = function(map, state) {
    console.log(fips);
    map.setFilter('state-mask', ['!=', 'ref', state]);
    map.setLayoutProperty('state-mask', 'visibility', 'visible');
    map.setLayoutProperty('place-city-lg-n', 'visibility', 'none');
    map.setLayoutProperty('place-city-lg-s', 'visibility', 'none');

    map.setLayoutProperty('place-city-md-n', 'visibility', 'none');
    map.setLayoutProperty('place-city-md-s', 'visibility', 'none');
    map.setLayoutProperty('place-city-sm', 'visibility', 'none');

    map.setLayoutProperty('Water', 'visibility', 'none');
    map.setLayoutProperty('bathymetry', 'visibility', 'none');
    map.setLayoutProperty('10m-reduced-bathymetry', 'visibility', 'none');
    map.setLayoutProperty('Coastline', 'visibility', 'none');
    map.setLayoutProperty('Waterline', 'visibility', 'none');
    map.setLayoutProperty('Waterline Extra', 'visibility', 'none');

  };

  module.stateView = stateView;
})(window);
