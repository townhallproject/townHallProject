import $ from 'jquery';
import eventHandler from './eventView';
const stateView = {};

stateView.maskCountry = function (map, state) {
  const layer = 'state-mask'
  map.setFilter(layer, ['!=', 'ref', state]);
  // map.setLayoutProperty(layer, 'visibility', 'visible');
};

stateView.setStateDropdown = function (state) {
  $('.dropdown--stateSelection button.dropdown-toggle span.button-text').text(eventHandler.getStateDataFromAbbr(state)[0].Name);
  $('.dropdown--stateSelection .stateNav-federal').show();
};

export default stateView;

