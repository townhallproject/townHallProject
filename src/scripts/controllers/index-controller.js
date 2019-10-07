import indexView from '../views/indexView';
import tableHandler from '../views/tableView';
import stateView from '../views/stateView';

const indexController = {};

indexController.renderMainIndex = function (ctx, next) {
  indexView.initialHome();
  indexView.renderHeader();
  indexView.setStateDropdown();
  tableHandler.initialFilters();
  tableHandler.configureDropdowns();
  next();
};

indexController.renderStateIndex = function (ctx, next) {
  indexView.initialHome();
  stateView.renderHeader(ctx.stateUPSP);
  stateView.setStateDropdown(ctx.stateUPSP);
  tableHandler.resetFilters();
  tableHandler.configureDropdowns();
  next();
};

export default indexController;
