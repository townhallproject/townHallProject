'use strict';

(function(module){
  let stateView = {};

  stateView.getState = function(ctx, next){
    ///convert state name to necessary coordinates for mapbox url
    switch(ctx.params.state.toLowerCase()){
      case 'arizona':
        alert('in getState: ' + ctx.params.state);
        stateView.stateCoords = [-128.8, 23.6,-65.4, 50.2]
        break;
      default:
        stateView.stateCoords = [-128.8, 23.6,-65.4, 50.2]; ///USA
        break;
    }
  };

  module.stateView = stateView;
})(window);
