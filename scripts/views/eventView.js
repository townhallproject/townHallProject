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
      eventHandler.resetFilters();
    }
  };

  // reset the home page to originial view
  eventHandler.resetHome = function () {
    $('[data-toggle="popover"]').popover('hide');
    $('.header-small').hide();
    $('.header-large').fadeIn();
    $('#look-up input').val('');
    $('#representativeCards section').empty();
    $('.form-text-results').removeClass('text-center');
    $('.header-with-results .results').removeClass('multipleResults');
    $('.left-panels').removeClass('left-panels-border');
    $('#nearest').removeClass('nearest-with-results');
    $('#button-to-form').hide();
    $('.spacer').show();
    $('#look-up').appendTo($('.right-panels'));
    TownHall.isCurrentContext = false;
    TownHall.currentContext = [];
    TownHall.zipQuery = '';
    $('#map').appendTo('.map-large');
    onResizeMap();
    var $parent = $('#nearest');
    var $results = $('#textresults');
    $parent.empty();
    $results.empty();
    eventHandler.resetFilters();
    eventHandler.addFilter('meetingType', 'Town Hall');
    TownHall.sortOn = 'State';
    eventHandler.renderTableWithArray(eventHandler.getFilterState());
  };

  // Renders one panel, assumes data processing has happened
  eventHandler.renderPanels = function(event, $parent) {
    var compiledTemplate = Handlebars.getTemplate('eventCards');
    var $panel = $(compiledTemplate(event));
    $panel.children('.panel').addClass(event.Party.slice(0,3));
    $panel.appendTo($parent);
  };

  eventHandler.renderRepresentativeCards = function(representativePromise, $parent) {
    $parent.empty(); // If they search for a new zipcode clear the old info
    representativePromise.success(function(representatives) {
      var compiledTemplate = Handlebars.getTemplate('representativeCard');
      $parent.append('<h2 class="text-primary text-center">Your Representatives</h2>');
      representatives.results.forEach(function(rep) {
        switch(rep.party) {
        case 'R':
          rep.party = 'Republican';
          break;
        case 'D':
          rep.party = 'Democrat';
          break;
        case 'I':
          rep.party = 'Independent';
          break;
        }
        var termEnd = new Date(rep.term_end);
        // If term expires in janurary then assume the election is in the prior year
        rep.electionYear = termEnd.getMonth() === 0 ? termEnd.getFullYear() - 1 : termEnd.getFullYear();
        $parent.append(compiledTemplate(rep));
      });
      if (representatives.results.length > 3) {
        $parent.append('<h4 class="col-md-12 text-center">Your zip code encompasses more than one district.<br><small><a href="http://www.house.gov/representatives/find/">Learn More</a></small></h4>');
      }
    });
  };

  eventHandler.renderTableWithArray = function (array) {
    $('.event-row').remove();
    $table = $('#all-events-table');
    $currentState = $('#current-state');
    var total = parseInt($currentState.attr('data-total'));
    var cur = array.length;
    array.forEach(function(ele){
      eventHandler.renderTable(ele, $table);
    });
    $('[data-toggle="popover"]').popover({
      container: 'body',
      html:true
    });
    /*eslint-env es6*/
    /*eslint quotes: ["error", "single", { "allowTemplateLiterals": true }]*/
    $currentState.text(`Viewing ${cur} of ${total} total events`);
  };

  // render table row
  eventHandler.renderTable = function (townhall, $tableid) {
    if (townhall.dist) {
      townhall.dist = Math.round(townhall.dist/1609.344);
    }
    townhall.addressLink = 'https://www.google.com/maps?q=' + escape(townhall.address);
    var compiledTemplate = Handlebars.getTemplate('eventTableRow');
    $($tableid).append(compiledTemplate(townhall));
  };

  eventHandler.getFilterState = function () {
    var data = TownHall.isCurrentContext ? TownHall.currentContext : TownHall.allTownHalls;
    return TownHall.getFilteredResults(data);
  };

  eventHandler.sortTable = function (e) {
    e.preventDefault();
    TownHall.sortOn = $(this).attr('data-filter');
    eventHandler.renderTableWithArray(eventHandler.getFilterState());
  };

  eventHandler.addFilter = function(filter, value) {
    // Avoid duplicates
    if (TownHall.filters.hasOwnProperty(filter) && TownHall.filters[filter].indexOf(value) !== -1) {
      return;
    }

    TownHall.addFilter(filter, value);

    var button = '<li><button class="btn btn-secondary btn-xs" ' +
                 'data-filter="' + filter + '" data-value="' + value + '" >' +
                    value + '<i class="fa fa-times" aria-hidden="true"></i>' +
                  '</button></li>';
    $('#filter-info').append(button);
  };

  eventHandler.removeFilter = function() {
    var $button = $(this);
    TownHall.removeFilter($button.attr('data-filter'), $button.attr('data-value'));
    eventHandler.renderTableWithArray(eventHandler.getFilterState());
    $button.parent().remove();
  };

  eventHandler.resetFilters = function() {
    TownHall.resetFilters();
    $('#filter-info li button').parent().remove();
  };
  // filters the table on click
  eventHandler.filterTable = function (e) {
    e.preventDefault();
    var filter = this.getAttribute('data-filter');
    eventHandler.addFilter(filter, this.id);

    var filterID = this.id.slice(0,5);
    var inputs = $('input[data-filter]');
    eventHandler.renderTableWithArray(eventHandler.getFilterState());
  };

  // initial state of table
  eventHandler.initialTable = function (townhall) {
    $currentState = $('#current-state');
    var total = parseInt($currentState.attr('data-total')) + 1;
    var cur = parseInt($currentState.attr('data-current'));
    $currentState.attr('data-total', total);
    $table = $('#all-events-table');
    if (townhall.meetingType === 'Town Hall') {
      cur ++;
      eventHandler.renderTable(townhall, $table);
      $currentState.attr('data-current', cur);
    }
    $currentState.text(`Viewing ${cur} of ${total} total events`);
  };

  // renders results of search
  eventHandler.render = function (events, zipQuery, representativePromise) {
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
    eventHandler.resultsRouting(maxDist, events, zipQuery, representativePromise);
    addtocalendar.load();
  };

  eventHandler.resultsRouting = function (maxDist, events, zipQuery, representativePromise){
    var $zip = $('#look-up input').val();
    var $parent = $('#nearest');
    var $results = $('#textresults');
    $parent.empty();
    $results.empty();
    $('.event-row').remove();
    var $text = $('<h4>');
    var nearest = events.reduce(function(acc, cur){
      if (cur.dist < maxDist) {
        acc.push(cur);
      }
      return acc;
    },[]);
    $('#map').appendTo('.map-small');
    var info = '<small class="text-white">Event results by proximity, not by district.</small> ';
    // Display a list of reps with contact info
    eventHandler.renderRepresentativeCards(representativePromise, $('#representativeCards section'));

    if (nearest.length === 0) {
      $('.header-with-results .results').removeClass('multipleResults');
      var townHall = events[0];
      var townHalls = [townHall];
      recenterMap(townHalls, zipQuery);
      eventHandler.renderTableWithArray(events);
      $text.html('There are no events within 75 miles of your zip, the closest one is ' + townHall.dist + ' miles away. <br>' + info);
      $results.append($text);
      eventHandler.renderPanels(townHall, $parent);
    }
    else{
      TownHall.currentContext = nearest;
      TownHall.isCurrentContext = true;
      recenterMap(nearest, zipQuery);
      if (nearest.length === 1) {
        $('.header-with-results .results').removeClass('multipleResults');
        $text.html('There is ' + nearest.length + ' upcoming events within 75 miles of you. <br>' + info);
      } else {
        $('.header-with-results .results').addClass('multipleResults');
        $text.html('There are ' + nearest.length + ' upcoming events within 75 miles of you. <br>' +info);
      }
      $results.append($text);
      eventHandler.renderTableWithArray(nearest);
      nearest.forEach(function(ele){
        eventHandler.renderPanels(ele, $parent);
      });
    }
  };

  function setupTypeaheads() {
    var typeaheadConfig = {
      fitToElement: true,
      delay: 250,
      highlighter: function(item) { return item; }, // Kill ugly highlight
      updater: function(selection) {
        eventHandler.addFilter(this.$element.attr('data-filter'), selection);
        eventHandler.renderTableWithArray(eventHandler.getFilterState());
      }
    };

    $("#stateTypeahead").typeahead($.extend({source: TownHall.allStates}, typeaheadConfig));
    $("#memberTypeahead").typeahead($.extend({source: TownHall.allMoCs}, typeaheadConfig));
  }

  $(document).ready(function(){
    init();
  });

  function init() {
    $('[data-toggle="popover"]').popover({html:true});
    $('#button-to-form').hide();
    $('#save-event').on('submit', eventHandler.save);
    $('#look-up').on('submit', eventHandler.lookup);
    $('#view-all').on('click', TownHall.viewAll);
    $('.sort').on('click', 'a', eventHandler.sortTable);
    setupTypeaheads();
    $('.filter').on('click', 'a', eventHandler.filterTable);
    $('#filter-info').on('click', 'button.btn', eventHandler.removeFilter);
    eventHandler.resetFilters();
    eventHandler.addFilter('meetingType', 'Town Hall');

    // url hash for direct links to subtabs
    // slightly hacky routing
    if (location.hash) {
      $("a[href='" + location.hash + "']").tab('show');
    }
    else{
      TownHall.isMap = true;
    }

    $('.navbar-main').on('click', '.hash-link', function onClickGethref(event) {
      var hashid = this.getAttribute('href');
      if (hashid === '#home' && TownHall.isMap === false) {
        history.replaceState({}, document.title, '.');
        setTimeout( function(){
          if (location.pathname ='/') {
            eventHandler.resetHome();
            TownHall.isMap = true;
          }
        }, 50);
      }
      else if (hashid === '#home' && TownHall.isMap === true) {
        console.log('going home and map');
        history.replaceState({}, document.title, '.');
        $('ul .hash-link').parent().removeClass('active');
        setTimeout( function(){
          eventHandler.resetHome();
        }, 0);
      }
      else {
        location.hash = hashid;
      }
      $('[data-toggle="popover"]').popover('hide');
    });

    // Only show one popover at a time
    $('#all-events-table').on('click', 'li[data-toggle="popover"]', function(e) {
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

  window.onBeforeunload=null;

  module.eventHandler = eventHandler;
})(window);
