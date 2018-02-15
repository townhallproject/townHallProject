(function(module){
  var indexController = {};

  indexController.renderMainIndex = function(ctx, next) {
    indexView.renderAwards();
    indexView.renderHeader();
    indexView.setStateDropdown();
    tableHandler.initialFilters();
    next();
  };

  indexController.renderStateIndex = function(ctx, next) {
    indexView.hideAwards();
    stateView.renderHeader(ctx.stateUPSP);
    stateView.setStateDropdown(ctx.stateUPSP);
    tableHandler.resetFilters();
    next();
  };

  module.indexController = indexController;
})(window);
