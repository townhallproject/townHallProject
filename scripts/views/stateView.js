'use strict';

(function(module){
  let stateView = {};

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

///Turns state variable with dashes into the state name
  function parseState(string){
    let nameArray = string.split('-').map(function(name){
      return capitalizeFirstLetter(name);
    });
    return nameArray.join(' ');
  }

  stateView.getState = function(ctx, next){
    ///convert state name to necessary coordinates for mapbox url
    let state = $.grep(stateData, function(e){
      return e.Name === parseState(ctx.params.state);
    });
    if(state.length > 0){
      let stateUsps = state[0]['USPS'];
      stateView.stateCoords = bboxes[stateUsps];
    }else {
      stateView.stateCoords = [-128.8, 23.6,-65.4, 50.2]; ///USA
    }
  };

  module.stateView = stateView;
})(window);
