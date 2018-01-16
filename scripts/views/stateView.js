(function(module){
  var stateView = {};

  stateView.maskCountry = function(map, state) {
    map.setFilter('state-mask', ['!=', 'ref', state]);
  };

  stateView.renderHeader = function(state){
    $('#header-image').attr('src', location.origin + '/Images/' + state + '/THP_logo_inverse.png');
  };

  module.stateView = stateView;
})(window);
