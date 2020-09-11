import indexView from '../views/indexView';
import stateView from '../views/stateView';
import { renderApp } from '../../components/App';

const indexController = {};

indexController.renderMainIndex = function (ctx, next) {
  indexView.initialHome();
  indexView.setStateDropdown();
  next();
};

indexController.renderStateIndex = function (ctx, next) {
  indexView.initialHome();
  stateView.setStateDropdown(ctx.stateUPSP);
  next();
};

indexController.renderDom = function(ctx, next) {
  renderApp(ctx);
  next();
}

export default indexController;
