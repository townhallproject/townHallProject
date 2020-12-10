import $ from 'jquery';

import TownHall from '../models/TownHall';
import stateView from './stateView';
// import eventTableRowTemplate from '../../templates/eventTableRow';

const tableHandler = {};

tableHandler.resetTable = function () {
  TownHall.resetData();
  if (stateView.state) {
    tableHandler.resetFilters();
    tableHandler.configureDropdowns();
  } else {
    tableHandler.initialFilters();
    tableHandler.configureDropdowns();
  }
  tableHandler.renderTableWithArray(tableHandler.getFilterState());
};

tableHandler.clearTableData = function () {
  // $('#all-events-table').children().slice(1).remove();
  // $('#current-state').attr('data-total', 0);
  // $('#current-state').attr('data-current', 0);
};

tableHandler.initialFilters = function () {
  tableHandler.resetFilters();

  tableHandler.addFilter('meetingType', 'Town Hall');
  tableHandler.addFilter('meetingType', 'Empty Chair Town Hall');
  tableHandler.addFilter('meetingType', 'Campaign Town Hall');
  tableHandler.addFilter('meetingType', 'Youth Vote');
  tableHandler.addFilter('meetingType', 'Voting Rights');
};

tableHandler.configureDropdowns = function() {
  // Handle dropdowns per view
  if (stateView.state) {
    $('.hide-on-state-view').hide();
  } else {
    $('.hide-on-state-view').show();
  }
};

tableHandler.renderTableWithArray = function (array) {
  // $('.event-row').remove();
  // var $table = $('#all-events-table');
  // var $currentState = $('#current-state');
  // var total = parseInt($currentState.attr('data-total'));
  // var cur = array.length;
  // array.forEach(function (ele) {
  //   tableHandler.renderTable(ele, $table);
  // });
  // $currentState.text('Viewing ' + cur + ' of ' + total + ' total events');
};

// render table row
tableHandler.renderTable = function (townhall, $tableid) {
  if (townhall.dist) {
    townhall.dist = Math.round(townhall.dist / 1609.344);
  }
  townhall.addressLink = 'https://www.google.com/maps?q=' + escape(townhall.address);
  townhall.makeFormattedMember();
  $($tableid).append(eventTableRowTemplate(townhall));
};

tableHandler.getFilterState = function () {
  var data = TownHall.isCurrentContext ? TownHall.currentContext : TownHall.allTownHalls.concat(TownHall.allStateTownHalls);
  return TownHall.getFilteredResults(data);
};

tableHandler.sortTable = function (e) {
  e.preventDefault();
  TownHall.sortOn = $(this).attr('data-filter');
  tableHandler.renderTableWithArray(tableHandler.getFilterState());
};

tableHandler.addFilter = function (filter, value) {
  // Avoid duplicates
  if (TownHall.filters.hasOwnProperty(filter) && TownHall.filters[filter].indexOf(value) !== -1) {
    return;
  } else if (value === 'All') {
    tableHandler.removeFilterCategory(filter);
  } else {
    TownHall.addFilter(filter, value);

    var button = '<li><button class="btn btn-secondary btn-xs" ' +
      'data-filter="' + filter + '" data-value="' + value + '" >' +
      value + '<i class="fa fa-times" aria-hidden="true"></i>' +
      '</button></li>';
    $('#filter-info').append(button);
  }
};

//gets rid of whole filter category and removes the associated buttons
tableHandler.removeFilterCategory = function (category) {
  TownHall.removeFilterCategory(category);
  $('button[data-filter="' + category + '"]').remove();
  tableHandler.renderTableWithArray(tableHandler.getFilterState());
};

tableHandler.removeFilter = function () {
  var $button = $(this);
  TownHall.removeFilter($button.attr('data-filter'), $button.attr('data-value'));
  tableHandler.renderTableWithArray(tableHandler.getFilterState());
  $button.parent().remove();
};

tableHandler.resetFilters = function () {
  TownHall.resetFilters();
  $('#filter-info li button').parent().remove();
};

// filters the table on click
tableHandler.filterTable = function (e) {
  e.preventDefault();
  var filter = this.getAttribute('data-filter');
  tableHandler.addFilter(filter, this.id);
  tableHandler.renderTableWithArray(tableHandler.getFilterState());
};

// When the user clicks on the button, scroll to the top of the events table
tableHandler.scrollToTopTable = function () {
  $('html, body').animate({ scrollTop: $('#events-table').offset().top }, 'fast');
};

// initial state of table
tableHandler.initialMainTable = function (townhall) {
  // var $currentState = $('#current-state');
  // var total = parseInt($currentState.attr('data-total')) + 1;
  // var cur = parseInt($currentState.attr('data-current'));
  // $currentState.attr('data-total', total);
  // var $table = $('#all-events-table');
  // var meetingTypesToShow = TownHall.filters.meetingType;
  // if (meetingTypesToShow.indexOf(townhall.meetingType) > -1) {
  //   cur++;
  //   tableHandler.renderTable(townhall, $table);
  //   $currentState.attr('data-current', cur);
  // }
  // $currentState.text('Viewing ' + cur + ' of ' + total + ' total events');
};

// initial state of table
tableHandler.initialStateTable = function (townhall) {
  // var $currentState = $('#current-state');
  // var total = parseInt($currentState.attr('data-total')) + 1;
  // var cur = parseInt($currentState.attr('data-current'));
  // $currentState.attr('data-total', total);
  // var $table = $('#all-events-table');
  // cur++;
  // tableHandler.renderTable(townhall, $table);
  // $currentState.attr('data-current', cur);
  // $currentState.text('Viewing ' + cur + ' of ' + total + ' total events');
};

export default tableHandler;
