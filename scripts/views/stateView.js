(function(module){
  var stateView = {};

  stateView.maskCountry = function(map, state) {
    map.setFilter('state-mask', ['!=', 'ref', state]);
    map.setLayoutProperty('state-mask', 'visibility', 'visible');
    map.setLayoutProperty('place-city-lg-n', 'visibility', 'none');
    map.setLayoutProperty('place-city-lg-s', 'visibility', 'none');

    map.setLayoutProperty('place-city-md-n', 'visibility', 'none');
    map.setLayoutProperty('place-city-md-s', 'visibility', 'none');
    map.setLayoutProperty('place-city-sm', 'visibility', 'none');

  };

  stateView.renderHeader = function(state){
    $('#header-image').attr('src', location.origin + '/Images/' + state + '/THP_logo_inverse.png');
  };

  module.stateView = stateView;
})(window);
