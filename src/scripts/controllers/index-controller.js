import indexView from '../views/indexView';
import tableHandler from '../views/tableView';
import stateView from '../views/stateView';
import { renderApp } from '../../components/App';

const indexController = {};

indexController.renderMainIndex = function (ctx, next) {
  indexView.initialHome();
  indexView.setStateDropdown();
  tableHandler.configureDropdowns();
  next();
};

indexController.renderStateIndex = function (ctx, next) {
  indexView.initialHome();
  stateView.setStateDropdown(ctx.stateUPSP);
  tableHandler.resetFilters();
  tableHandler.configureDropdowns();
  next();
};

indexController.renderDom = function(ctx, next) {
  renderApp(ctx);
  next();
}

export default indexController;
