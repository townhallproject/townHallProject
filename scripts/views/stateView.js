'use strict';

(function(module){
  let stateView = {};

  stateView.getState = function(ctx, next){
    console.log(ctx.params.state);
    alert('in getState: ' + ctx.params.state);
  };

  module.stateView = stateView;
})(window);
