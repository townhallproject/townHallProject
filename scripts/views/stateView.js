'use strict';

(function(module){
  let stateView = {};
  stateView.stateCoords = [];

  stateView.getState = function(ctx, next){
    console.log(ctx.params.state);
    alert('in getState: ' + ctx.params.state);
    ///convert state name to necessary coordinates for mapbox url
    stateView.stateCoords = [-116.049153, 44.357915, -104.039694, 49.0011];
  };

  module.stateView = stateView;
})(window);
