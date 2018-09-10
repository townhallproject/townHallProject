(function(module){
  var indexController = {};

  indexController.renderMainIndex = function(ctx, next) {
    indexView.initialHome();
    indexView.renderHeader();
    indexView.setStateDropdown();
    tableHandler.initialFilters();
    next();
  };

  indexController.renderStateIndex = function(ctx, next) {
    indexView.initialHome();
    stateView.renderHeader(ctx.stateUPSP);
    stateView.setStateDropdown(ctx.stateUPSP);
    tableHandler.resetFilters();
    next();
  };

  module.indexController = indexController;
})(window);
