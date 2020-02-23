import $ from 'jquery';

import TownHall from '../models/TownHall';

import mapView from './mapView';
import tableHandler from './tableView';
import emailHandler from './emailSignUpView';

const indexView = {};

indexView.renderAwards = function () {
  $('#awards-banner').removeClass('hidden');
};

indexView.hideAwards = function () {
  $('#awards-banner').addClass('hidden');
};

indexView.setStateDropdown = function () {
  $('.dropdown--stateSelection button.dropdown-toggle span.button-text').text('State Legislatures');
  $('.dropdown--stateSelection .stateNav-federal').hide();
};

// original view
indexView.initialHome = function () {
  tableHandler.resetTable();
  mapView.initialView();
  var $parent = $('#nearest');
  var $results = $('.selection-results_content');
  $('#look-up input').val('');
  $parent.removeClass('nearest-with-results');
  $parent.empty();
  $results.empty();
  tableHandler.initialFilters();
  TownHall.sortOn = 'Date';
};

// reset the home page to originial view
indexView.resetHome = function () {
  $('.header-small').hide();
  $('.header-large').fadeIn();
  $('#look-up input').val('');
  $('#missing-member-banner').show();
  $('#email-signup-form input[name=zipcode]').val('');
  $('#email-signup-form input[name=zipcode]').removeClass('hidden');
  $('#email-signup-form #district-subscribe').addClass('hidden');
  $('#no-events').hide();
  $('.form-text-results').removeClass('text-center');
  $('.header-with-results .results').removeClass('multipleResults');
  $('.left-panels').removeClass('left-panels-border');
  $('#email-title').text('Sign up to get updates about local events.');
  $('#button-to-form').hide();
  $('.spacer').show();
  $('#look-up').appendTo($('.right-panels'));
  tableHandler.resetTable();
  mapView.resetView();
  var $parent = $('#nearest');
  var $results = $('.selection-results_content');
  $parent.removeClass('nearest-with-results');
  $parent.empty();
  $results.empty();
  tableHandler.initialFilters();
  // TODO: update
  // emailHandler.clearDistricts();
  TownHall.sortOn = 'Date';
};

export default indexView;

