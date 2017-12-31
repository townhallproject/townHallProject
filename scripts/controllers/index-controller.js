(function(module){
  var indexController = {};

  indexController.renderMainIndex = function(ctx, next) {
    indexView.renderAwards();
    next();
  };

  indexController.renderStateIndex = function(ctx, next) {
    indexView.hideAwards();
    stateView.renderHeader(ctx.stateUPSP);
    next();
  };

  module.indexController = indexController;
})(window);
