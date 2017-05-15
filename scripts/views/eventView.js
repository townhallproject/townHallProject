(function(module) {
  var firebasedb = firebase.database();
  var provider = new firebase.auth.GoogleAuthProvider();

  // object to hold the front end view functions
  var eventHandler = {};

  eventHandler.zipErrorResponse = function(errorMessage) {
    var $results = $('#textresults');
    $results.empty();
    var $text = $('<h4>');
    $text.text(errorMessage);
    $results.append($text);
  };

  eventHandler.renderResults = function(thisState, validDistricts, validSelections) {
    var districtMatcher = thisState + '-' + validDistricts;
    var selectedData = TownHall.matchSelectionToZip(thisState, validDistricts);
    var $zip = $('#look-up input').val();
    var $parent = $('#nearest');
    var $results = $('#textresults');
    $parent.empty();
    $results.empty();
    var $text = $('<h4>');
    //render table
    var districtText = ' ';
    validDistricts.forEach(function(district){
      districtText = districtText + thisState + '-' + district + ' ';
    });
    if (selectedData.length > 0) {
      // set globals for filtering
      $('#nearest').addClass('nearest-with-results');
      TownHall.isCurrentContext = true;
      TownHall.currentContext = selectedData;
      eventHandler.renderTableWithArray(selectedData);
      mapView.makeSidebar(selectedData);
      var message = 'Showing ' + selectedData.length + ' event(s) for ' + districtText;
      $text.html(message);
      $results.append($text);

      selectedData.forEach(function(ele){
        eventHandler.renderPanels(ele, $parent);
      });
      addtocalendar.load();
    } else {
      $text.html('There are no events for ' + districtText);
      $results.append($text);
    }
    mapView.highlightDistrict(validSelections);
  };

  eventHandler.lookup = function (e) {
    e.preventDefault();
    var zip = $('#look-up input').val().trim();
    regEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
    var zipCheck = zip.match(regEx);
    if (zipCheck) {
      var zipClean = zip.split('-')[0];
      var validDistricts = [];
      var validSelections = [];
      var callbackTrigger = 0;
      var thisState;
      var stateCode;
      TownHall.lookupZip(zipClean)
        .then(function(zipToDistricts){
          eventHandler.setUrlParameter('district', false);
          eventHandler.setUrlParameter('zipcode', zipClean);
          eventHandler.resetFilters();
          zipToDistricts.forEach(function(district){
            var stateDate = stateData.filter(function(state){
              return state.USPS === district.abr;
            });
            stateCode = stateDate[0].FIPS;
            var geoid = stateCode + district.dis;
            thisState = district.abr;
            validDistricts.push(district.dis);
            validSelections.push(geoid);
          });
          mapView.focusMap(thisState, validDistricts);
          eventHandler.renderRepresentativeCards(TownHall.lookupReps('zip', zip), $('#representativeCards section'));
          eventHandler.renderResults(thisState, validDistricts, validSelections);
        })
        .catch(function(error){
          eventHandler.zipErrorResponse(error, 'That zip code is not in our database, if you think this is an error please email us.');
        });
    } else {
      eventHandler.zipErrorResponse('Zip codes are 5 or 9 digits long.');
    }
  };

  // reset the home page to originial view
  eventHandler.resetHome = function () {
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
    mapView.resetView();
    var $parent = $('#nearest');
    var $results = $('#textresults');
    $parent.empty();
    $results.empty();
    eventHandler.resetFilters();
    eventHandler.addFilter('meetingType', 'Town Hall');
    eventHandler.addFilter('meetingType', 'Empty Chair Town Hall');
    TownHall.sortOn = 'Date';
    eventHandler.renderTableWithArray(eventHandler.getFilterState());
  };

  // Renders one panel, assumes data processing has happened
  eventHandler.renderPanels = function(event, $parent) {
    var compiledTemplate = Handlebars.getTemplate('eventCards');
    var $panel = $(compiledTemplate(event));
    $panel.children('.panel').addClass(event.Party.slice(0,3));
    $panel.appendTo($parent);
  };

  // Display a list of reps with contact info
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
    $currentState.text('Viewing ' + cur + ' of ' + total + ' total events');
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
    } else if (value === 'All') {
      eventHandler.removeFilterCategory(filter);
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
  eventHandler.removeFilterCategory = function(category) {
    TownHall.removeFilterCategory(category);
    $('button[data-filter="' + category + '"]').remove();
    eventHandler.renderTableWithArray(eventHandler.getFilterState());
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

    if (townhall.meetingType === 'Town Hall' || townhall.meetingType === 'Empty Chair Town Hall') {
      cur ++;
      eventHandler.renderTable(townhall, $table);
      $currentState.attr('data-current', cur);
    }
    $currentState.text('Viewing ' + cur + ' of ' + total + ' total events');
  };

  // renders results of search
  eventHandler.render = function (events, zipQuery) {
    $('.header-small').removeClass('hidden');
    $('.header-small').fadeIn();
    $('.header-large').hide();
    $('.form-text-results').addClass('text-center');
    $('.left-panels').addClass('left-panels-border');
    $('#look-up').appendTo($('.left-panels'));
    $('#button-to-form').removeClass('hidden');
    $('#button-to-form').fadeIn();
    $('.spacer').hide();
    maxDist = 120701;
    eventHandler.resultsRouting(maxDist, events, zipQuery);
  };

  eventHandler.resultsRouting = function (maxDist, events, zipQuery){
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

  eventHandler.populateEventModal = function(townhall) {
    var compiledTemplate = Handlebars.getTemplate('eventModal');
    $('.event-modal .modal-content').html(compiledTemplate(townhall));
    eventHandler.setUrlParameter('eventId', townhall.eventId);
    addtocalendar.load();
  };

 // Perform zip search on load
  eventHandler.zipSearchByParam = function(){
    var zipcode = getUrlParameter('zipcode');
    var district = getUrlParameter('district');
    if (zipcode) {
      $('#look-up input').val(zipcode);
      eventHandler.lookup(document.createEvent('Event'));
    } else if (district) {
      if (district.split('-').length === 3) {
        //TODO: possible more checks to make sure this is a real district
        var feature = {
          state: district.split('-')[0],
          district:district.split('-')[1],
          geoID:district.split('-')[2],
        };
        mapView.districtSelect(feature);
      } else {
        eventHandler.setUrlParameter('district', false);
      }
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

    $('#stateTypeahead').typeahead($.extend({source: TownHall.allStates}, typeaheadConfig));
    $('#memberTypeahead').typeahead($.extend({source: TownHall.allMoCs}, typeaheadConfig));
  }

  function getUrlParameter(param) {
    var query = document.location.search.match(new RegExp('([?&])' + param + '[^&]*'));
    if (query) {
      return query[0].split('=')[1];
    }
    return false;
  }

  eventHandler.setUrlParameter = function(param, value) {
    // Get query params, and remove the matching param if it exists
    var search = document.location.search.replace(new RegExp('([?&])' + param + '[^&]*'),'');
    // If there are no query params then we need to add the ? back
    if (search.indexOf('?') === -1) {
      search += '?';
    } else {
      search += '&';
    }

    // Add the query param if we have a value
    if (value !== false) {
      search += param + '=' + value;
    } else {
      // Remove trailing ? or &
      search = search.slice(0, -1);
    }

    window.history.replaceState('', '', document.location.origin + '/' + search);
  };

  function checkEventParam() {
    var eventId = getUrlParameter('eventId');
    if (eventId) {
      firebase.database().ref('/townHalls/' + eventId).once('value').then(function(snapshot) {
        if (snapshot.val()) {
          eventHandler.populateEventModal(snapshot.val());
          $('.event-modal').modal('show');
        }
      });
    }
  }

  $(document).ready(function(){
    init();
  });

  function init() {
    checkEventParam();
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
    eventHandler.addFilter('meetingType', 'Empty Chair Town Hall');

    // url hash for direct links to subtabs
    // slightly hacky routing
    if (location.hash) {
      $("a[href='" + location.hash + "']").tab('show');
    } else {
      TownHall.isMap = true;
    }

    $('.hash-link').on('click', function onClickGethref(event) {
      var hashid = this.getAttribute('href');
      $('ul .hash-link').parent().removeClass('active');

      if (hashid === '#home' && TownHall.isMap === false) {
        history.replaceState({}, document.title, '.');
        setTimeout( function(){
          if (location.pathname ='/') {
            eventHandler.resetHome();
            TownHall.isMap = true;
          }
        }, 50);
      } else if (hashid === '#home' && TownHall.isMap === true) {
        history.replaceState({}, document.title, '.');
        setTimeout( function(){
          eventHandler.resetHome();
        }, 0);
      } else {
        location.hash = hashid;
      }

      $('html, body').scrollTop(0);
    });

    // Remove query param when closing modal
    $('.event-modal').on('hide.bs.modal', function (e) {
      eventHandler.setUrlParameter('eventId', false);
    });

    $('.privacy-policy-button').on('click', function(e){
      $('#privacy-policy-link').click();
      $('html,body').scrollTop(0);
    });
  }

  window.onBeforeunload=null;

  module.eventHandler = eventHandler;
})(window);
