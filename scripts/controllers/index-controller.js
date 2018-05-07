(function(module){
  var indexController = {};

  indexController.renderMainIndex = function(ctx, next) {
    indexView.renderAwards();
    indexView.resetHome();
    indexView.renderHeader();
    indexView.setStateDropdown();
    tableHandler.initialFilters();
    next();
  };

  indexController.renderStateIndex = function(ctx, next) {
    indexView.hideAwards();
    indexView.resetHome();
    stateView.renderHeader(ctx.stateUPSP);
    stateView.setStateDropdown(ctx.stateUPSP);
    tableHandler.resetFilters();
    next();
  };

  module.indexController = indexController;
})(window);
