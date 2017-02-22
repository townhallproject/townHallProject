(function(module) {
  var firebasedb = firebase.database();
  var provider = new firebase.auth.GoogleAuthProvider();

  // object to hold the front end view functions
  var eventHandler = {};

  // Renders the page in response to lookup
  eventHandler.lookup = function (e) {
    e.preventDefault();
    var zip = $('#look-up input').val();
    if (zip) {
      TownHall.lookupZip($('#look-up input').val());
    }
  };

  // reset the home page to originial view
  eventHandler.resetHome = function () {
    $('[data-toggle="popover"]').popover('hide');
    $('.header-small').hide();
    $('.header-large').fadeIn();
    $('#look-up input').val('');
    $('.form-text-results').removeClass('text-center');
    $('.left-panels').removeClass('left-panels-border');
    $('#nearest').removeClass('nearest-with-results');
    $('#button-to-form').hide();
    $('.spacer').show();
    $('#look-up').appendTo($('.right-panels'));
    $('#resetTable').hide();
    TownHall.isCurrentContext = false;
    TownHall.currentContext = [];
    TownHall.zipQuery = '';
    $('#map').appendTo('.map-large');
    onResizeMap();
    var $parent = $('#nearest');
    var $results = $('#textresults');
    $parent.empty();
    $results.empty();
    $table = $('#all-events-table');
    $table.empty();
    eventHandler.renderTableWithArray(TownHall.allTownHalls, $table);
  };

  // Renders one panel, assumes data processing has happened
  eventHandler.renderPanels = function(event, $parent) {
    var $panel = $(event.toHtml($('#event-template')));
    $panel.children('.panel').addClass(event.Party.slice(0,3));
    $panel.appendTo($parent);
  };

  eventHandler.renderTableWithArray = function (array, $table) {
    array.forEach(function(ele){
      eventHandler.renderTable(ele, $table);
    });
    $('[data-toggle="popover"]').popover({
      container: 'body',
      html:true
    });
  };

  // render table row
  eventHandler.renderTable = function (townhall, $tableid) {
    townhall.dist = Math.round(townhall.dist/1609.344);
    townhall.addressLink = 'https://www.google.com/maps?q=' + escape(townhall.address);
    $($tableid).append(townhall.toHtml($('#table-template')));
  };

  // takes the current set of data in the table and sorts by date
  eventHandler.viewByDate = function (e) {
    e.preventDefault();
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    var filtereddata = TownHall.filteredResults.length > 0 ? TownHall.filteredResults: data;
    TownHall.currentContext = TownHall.sortDate(filtereddata);
    $table = $('#all-events-table');
    $table.empty();
    eventHandler.renderTableWithArray(TownHall.currentContext, $table );
  };

  // filters the table on click
  eventHandler.filterTable = function (e) {
    e.preventDefault();
    $table = $('#all-events-table');
    $('#resetTable').show();
    var filterID = this.id;
    var filterCol = $(this).attr('data-filter');
    var inputs = $('input[data-filter]');
    $table.empty();
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    var data = TownHall.filteredResults.length>0 ? TownHall.filteredResults:data;
    if (filterID === 'All') {
      TownHall.filterIds[filterCol] = '';
      eventHandler.renderTableWithArray(data, $table );
    }
    else {
      TownHall.filterIds[filterCol] = filterID;
      Object.keys(TownHall.filterIds).forEach(function(key) {
        if (TownHall.filterIds[key]) {
          data = TownHall.filterByCol(key, TownHall.filterIds[key], data);
        }
      });
      eventHandler.renderTableWithArray(data, $table );
    }
  };

  eventHandler.filterTableByInput = function(e) {
    e.preventDefault();
    $('#resetTable').show();
    $table = $('#all-events-table');
    var query = $(this).val();
    var filterCol = $(this).attr('data-filter');
    $table.empty();
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    var data = TownHall.filteredResults.length>0 ? TownHall.filteredResults:data;
    Object.keys(TownHall.filterIds).forEach(function(key) {
      if (TownHall.filterIds[key]) {
        data = TownHall.filterByCol(key, TownHall.filterIds[key], data);
      }
    });
    TownHall.filteredResults = TownHall.filterColumnByQuery(filterCol, query, data);
    eventHandler.renderTableWithArray(TownHall.filteredResults, $table);
  };

  eventHandler.resetTable = function (e) {
    e.preventDefault();
    $table = $('#all-events-table');
    $table.empty();
    $('#resetTable').hide();
    TownHall.filterIds = {};
    TownHall.filteredResults = [];
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    eventHandler.renderTableWithArray(data, $table);
  };

  // renders results of search
  eventHandler.render = function (events, zipQuery) {
    $('[data-toggle="popover"]').popover('hide');
    $('.header-small').removeClass('hidden');
    $('.header-small').fadeIn();
    $('.header-large').hide();
    $('.form-text-results').addClass('text-center');
    $('.left-panels').addClass('left-panels-border');
    $('#nearest').addClass('nearest-with-results');
    $('#look-up').appendTo($('.left-panels'));
    $('#button-to-form').removeClass('hidden');
    $('#button-to-form').fadeIn();
    $('.spacer').hide();
    maxDist = 120701;
    eventHandler.resultsRouting(maxDist, events,zipQuery);
    addtocalendar.load();
  };

  eventHandler.resultsRouting = function (maxDist, events, zipQuery){
    var $zip = $('#look-up input').val();
    var $parent = $('#nearest');
    var $results = $('#textresults');
    $parent.empty();
    $results.empty();
    var $table = $('#all-events-table');
    $table.empty();
    var $text = $('<h4>');
    var nearest = events.reduce(function(acc, cur){
      if (cur.dist < maxDist) {
        acc.push(cur);
      }
      return acc;
    },[]);
    $('#map').appendTo('.map-small');
    var info = '<small class="text-white">This search is by proximity, not congressional district. To find your representatives, go to <a class="text-white" href="http://whoismyrepresentative.com">whoismyrepresentative.com</a>.<br></small> ';
    // TODO: return rep's info
    if (nearest.length === 0) {
      var townHall = events[0];
      var townHalls = [townHall];
      recenterMap(townHalls, zipQuery);
      eventHandler.renderTableWithArray(events, $table);
      $text.html('There are no events within 75 miles of your zip, the closest one is ' + townHall.dist + ' miles away. <br>' + info);
      $results.append($text);
      TownHall.saveZipLookup($zip);
      eventHandler.renderPanels(townHall, $parent);
    }
    else{
      TownHall.currentContext = nearest;
      TownHall.isCurrentContext = true;
      recenterMap(nearest, zipQuery);
      if (nearest.length ===1) {
        $text.html('There is ' + nearest.length + ' upcoming events within 75 miles of you. <br>' + info);
      }
      else {
        $text.html('There are ' + nearest.length + ' upcoming events within 75 miles of you. <br>' +info);
      }
      $results.append($text);
      eventHandler.renderTableWithArray(nearest, $table);
      nearest.forEach(function(ele){
        eventHandler.renderPanels(ele, $parent);
      });
    }
  };

  $(document).ready(function(){
    init();
  });

  function init() {
    var filterSelector = $('.filter');
    $('[data-toggle="popover"]').popover({html:true});
    $('#button-to-form').hide();
    $('#save-event').on('submit', eventHandler.save);
    $('#look-up').on('submit', eventHandler.lookup);
    $('#view-all').on('click', TownHall.viewAll);
    $('#sort-date').on('click', eventHandler.viewByDate);
    $('#resetTable').on('click', eventHandler.resetTable);
    $('#resetTable').hide();
    filterSelector.on('click', 'a', eventHandler.filterTable);
    filterSelector.change(eventHandler.filterTableByInput);
    // url hash for direct links to subtabs
    // slightly hacky routing
    if (location.hash) {
      $("a[href='" + location.hash + "']").tab('show');
    }
    else{
      TownHall.isMap = true;
    }
    $('nav').on('click', '.hash-link', function onClickGethref(event) {
      var hashid = this.getAttribute('href');
      if (hashid === '#home' && TownHall.isMap === false) {
        history.replaceState({}, document.title, '.');
        setTimeout( function(){
          onResizeMap();
          if (location.pathname ='/') {
            eventHandler.resetHome();
            TownHall.isMap = true;
          }
        }, 50);
      }
      else if (hashid === '#home' && TownHall.isMap === true) {
        console.log('going home and map');
        history.replaceState({}, document.title, '.');
        eventHandler.resetHome();
      }
      else {
        location.hash = this.getAttribute('href');
      }
      $('[data-toggle="popover"]').popover('hide');
    });

    // Only show one popover at a time
    $('#all-events-table').on('click', 'tr[data-toggle="popover"]', function(e) {
      $('#all-events-table [data-toggle="popover"]').not(this).popover('hide');
    });

    $('body').on('click', '.popover .popover-title a.close', function(e) {
      $('[data-toggle="popover"]').popover('hide');
    });

    // Fix popover bug in bootstrap 3 https://github.com/twbs/bootstrap/issues/16732
    $('body').on('hidden.bs.popover', function (e) {
      $(e.target).data('bs.popover').inState.click = false;
    });
  }

  module.eventHandler = eventHandler;
})(window);
