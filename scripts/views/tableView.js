(function(module) {
  tableHandler = {};

  tableHandler.resetTable = function(){
    TownHall.resetData();
    tableHandler.initialFilters();
    tableHandler.renderTableWithArray(tableHandler.getFilterState());
  };

  tableHandler.initialFilters = function() {
    tableHandler.resetFilters();
    tableHandler.addFilter('meetingType', 'Town Hall');
    tableHandler.addFilter('meetingType', 'Empty Chair Town Hall');
    tableHandler.addFilter('meetingType', 'Tele-Town Hall');
  };

  tableHandler.renderTableWithArray = function (array) {
    $('.event-row').remove();
    $table = $('#all-events-table');
    $currentState = $('#current-state');
    var total = parseInt($currentState.attr('data-total'));
    var cur = array.length;
    array.forEach(function(ele){
      tableHandler.renderTable(ele, $table);
    });
    $currentState.text('Viewing ' + cur + ' of ' + total + ' total events');
  };

  // render table row
  tableHandler.renderTable = function (townhall, $tableid) {
    if (townhall.dist) {
      townhall.dist = Math.round(townhall.dist/1609.344);
    }
    townhall.addressLink = 'https://www.google.com/maps?q=' + escape(townhall.address);
    var compiledTemplate = Handlebars.getTemplate('eventTableRow');
    $($tableid).append(compiledTemplate(townhall));
  };

  tableHandler.getFilterState = function () {
    var data = TownHall.isCurrentContext ? TownHall.currentContext : TownHall.allTownHalls;
    return TownHall.getFilteredResults(data);
  };

  tableHandler.sortTable = function (e) {
    e.preventDefault();
    TownHall.sortOn = $(this).attr('data-filter');
    tableHandler.renderTableWithArray(tableHandler.getFilterState());
  };

  tableHandler.addFilter = function(filter, value) {
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
  tableHandler.removeFilterCategory = function(category) {
    TownHall.removeFilterCategory(category);
    $('button[data-filter="' + category + '"]').remove();
    tableHandler.renderTableWithArray(tableHandler.getFilterState());
  };

  tableHandler.removeFilter = function() {
    var $button = $(this);
    TownHall.removeFilter($button.attr('data-filter'), $button.attr('data-value'));
    tableHandler.renderTableWithArray(tableHandler.getFilterState());
    $button.parent().remove();
  };

  tableHandler.resetFilters = function() {
    TownHall.resetFilters();
    $('#filter-info li button').parent().remove();
  };

  // filters the table on click
  tableHandler.filterTable = function (e) {
    e.preventDefault();
    var filter = this.getAttribute('data-filter');
    tableHandler.addFilter(filter, this.id);

    var filterID = this.id.slice(0,5);
    var inputs = $('input[data-filter]');
    tableHandler.renderTableWithArray(tableHandler.getFilterState());
  };

  // When the user clicks on the button, scroll to the top of the events table
  tableHandler.scrollToTopTable = function() {
    $('html, body').animate({scrollTop:$('#events-table').offset().top}, 'fast');
  };

  // initial state of table
  tableHandler.initialTable = function (townhall) {
    $currentState = $('#current-state');
    var total = parseInt($currentState.attr('data-total')) + 1;
    var cur = parseInt($currentState.attr('data-current'));
    $currentState.attr('data-total', total);
    $table = $('#all-events-table');
    var meetingTypes = TownHall.filters.meetingType;
    if (meetingTypes.indexOf(townhall.meetingType) > -1) {
      cur ++;
      tableHandler.renderTable(townhall, $table);
      $currentState.attr('data-current', cur);
    }
    $currentState.text('Viewing ' + cur + ' of ' + total + ' total events');
  };

  function setupTypeaheads() {
    var typeaheadConfig = {
      fitToElement: true,
      delay: 250,
      highlighter: function(item) { return item; }, // Kill ugly highlight
      updater: function(selection) {
        tableHandler.addFilter(this.$element.attr('data-filter'), selection);
        tableHandler.renderTableWithArray(tableHandler.getFilterState());
      }
    };

    $('#stateTypeahead').typeahead($.extend({source: TownHall.allStates}, typeaheadConfig));
    $('#memberTypeahead').typeahead($.extend({source: TownHall.allMoCs}, typeaheadConfig));
  }

  $(document).ready(function(){
    init();
  });

  function init() {
    $('.sort').on('click', 'a', tableHandler.sortTable);
    $('.filter').on('click', 'a', tableHandler.filterTable);
    $('#filter-info').on('click', 'button.btn', tableHandler.removeFilter);
    $('#scrollBtn').on('click', tableHandler.scrollToTopTable);
    setupTypeaheads();

    tableHandler.initialFilters();

    $('#all-events-table').on('click', 'li[data-toggle="popover"]', function(e) {
      $('#all-events-table [data-toggle="popover"]').not(this).popover('hide');
    });

    var divTop = $('#all-events-table').offset().top + 380;
    $(window).scroll(function() {
      if($(window).scrollTop() > divTop) { 
        $('#scrollBtn').show(); 
      } else {
        $('#scrollBtn').hide();
      }
    });
  }

  module.tableHandler = tableHandler;
  
})(window);