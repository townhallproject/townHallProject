import $ from 'jquery';
import eventHandler from './eventView';
const stateView = {};

stateView.maskCountry = function (map, state) {
  map.setFilter('state-mask', ['!=', 'ref', state]);
};

stateView.renderHeader = function (state) {
  $('#header-image').attr('src', location.origin + '/Images/' + state + '/THP_logo_inverse.png');
};

stateView.setStateDropdown = function (state) {
  $('.dropdown--stateSelection button.dropdown-toggle span.button-text').text(eventHandler.getStateDataFromAbbr(state)[0].Name);
  $('.dropdown--stateSelection .stateNav-federal').show();
};

export default stateView;

