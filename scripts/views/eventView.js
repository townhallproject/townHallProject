(function(module) {
  var firebasedb = firebase.database();
  var provider = new firebase.auth.GoogleAuthProvider();
  var zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
  var emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  // object to hold the front end view functions
  var eventHandler = {};

  eventHandler.zipErrorResponse = function(errorMessage) {
    var $results = $('#textresults');
    $results.empty();
    var $text = $('<h4>');
    $text.text(errorMessage);
    $results.append($text);
  };

  // Renders the page in response to lookup
  eventHandler.lookup = function (e) {
    e.preventDefault();
    var zip = $('#look-up input').val().trim();
    var zipCheck = zip.match(zipcodeRegEx);
    if (zipCheck) {
      var zipLookup = zip.split('-')[0];
      TownHall.lookupZip(zipLookup)
      .then(function(sorted){
        setUrlParameter('zipcode', zip);
        eventHandler.resetFilters();
        eventHandler.render(sorted, TownHall.zipQuery);
        eventHandler.renderRepresentativeCards(TownHall.lookupReps(zipLookup), $('#representativeCards section'));
        $('#email-title').text('Sign up to get updates about events in ' + zipLookup + '.');
        $('.email-signup--inline form input[name=zipcode]').val(zipLookup);
      })
      .catch(function(error){
        eventHandler.zipErrorResponse('That zip code is not in our database, if you think this is an error please email us.');
      });
    } else {
      eventHandler.zipErrorResponse('Zip codes are 5 or 9 digits long.');
    }
  };

  // reset the home page to originial view
  eventHandler.resetHome = function () {
    $('[data-toggle="popover"]').popover('hide');
    $('.header-small').hide();
    $('.header-large').fadeIn();
    $('#look-up input').val('');
    $('#missing-member-banner').show();
    $('#email-signup-form input[name=zipcode]').val('');
    $('#representativeCards section').empty();
    $('#representativeCards').hide();
    $('.form-text-results').removeClass('text-center');
    $('.header-with-results .results').removeClass('multipleResults');
    $('.left-panels').removeClass('left-panels-border');
    $('#nearest').removeClass('nearest-with-results');
    $('#email-title').text('Sign up to get updates about local events.');
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
    eventHandler.addFilter('meetingType', 'Empty Chair Town Hall');
    TownHall.sortOn = 'Date';
    eventHandler.renderTableWithArray(eventHandler.getFilterState());
  };

  // Renders one panel, assumes data processing has happened
  eventHandler.renderPanels = function(townhall, $parent) {
    var compiledTemplate = Handlebars.getTemplate('eventCards');
    var $panel = $(compiledTemplate(townhall));
    $panel.children('.panel').addClass(townhall.Party.slice(0,3));
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
      $parent.parent().show();
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
    $('[data-toggle="popover"]').popover('hide');
    $('.header-small').removeClass('hidden');
    $('.header-small').fadeIn();
    $('.header-large').hide();
    $('#missing-member-banner').hide();
    $('.form-text-results').addClass('text-center');
    $('.left-panels').addClass('left-panels-border');
    $('#nearest').addClass('nearest-with-results');
    $('#look-up').appendTo($('.left-panels'));
    $('#button-to-form').removeClass('hidden');
    $('#button-to-form').fadeIn();
    $('.spacer').hide();
    maxDist = 120701;
    eventHandler.resultsRouting(maxDist, events, zipQuery);
    addtocalendar.load();
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
    setUrlParameter('eventId', townhall.eventId);
    addtocalendar.load();
  };

  eventHandler.validateSignup = function(e) {
    e.preventDefault();
    var first = $('#email-signup-form input[name=first]');
    var last = $('#email-signup-form input[name=last]');
    var email = $('#email-signup-form input[name=email]');
    var zipcode = $('#email-signup-form input[name=zipcode]');
    var partner = $('#email-signup-form input[name=partner]');
    var districts = $('#email-signup-form input[name=districts]');
    var errors = 0;

    [first, email, zipcode].forEach(function(field) {
      var name = field[0].name;
      if (field[0].value.length === 0) {
        field.addClass('has-error');
        errors++;
      } else if ((name === 'email' && !emailRegEx.test(field[0].value)) ||
        (name === 'zipcode' && !zipcodeRegEx.test(field[0].value))) {
        field.addClass('has-error');
        errors++;
      } else {
        field.removeClass('has-error');
      }
    });

    if (errors !== 0) {
      return;
    }

    var zipClean = zipcode.val().split('-')[0];
    var districtArray;
    if (districts[0].value.length === 0) {
      TownHall.zipToDistrict(zipClean)
        .then(function(zipToDistricts){
          submitSignup(first, last, zipClean, email, zipToDistricts, partner);
        });
    } else {
      districtArray = JSON.parse($('#email-signup-form input[name=districts]').val());
      submitSignup(first, last, zipClean, email, districtArray, partner);
    }
  };

  eventHandler.uploadVideoStage2 = function(e) {
    $('.upload-video-stage-1').addClass('hidden');
    $('.upload-video-stage-2').removeClass('hidden');
    authWithYoutube();
  };

  eventHandler.uploadVideoStage3 = function(e) {
    $('.upload-video-upload').unbind('click');
    $('.upload-video-upload').click(eventHandler.uploadVideoStage4);
    $('.upload-video-stage-2').addClass('hidden');
    $('.upload-video-stage-3').removeClass('hidden');
    $('.upload-video-stage-5').addClass('hidden');
  };

  eventHandler.resetVideoForm = function(e) {
    $('#upload-video-form input[type=text]').val('');
    $('#upload-video-form textarea').val('');
  };

  eventHandler.uploadVideoStage4 = function(e) {
    $('.upload-video-upload').attr('disabled', true);
    uploadVideo.handleUploadClicked();
    $('.upload-video-stage-3').addClass('hidden');
    $('.upload-video-stage-4').removeClass('hidden');
  };

  eventHandler.uploadVideoStage5 = function(e) {
    $('.upload-video-stage-4').addClass('hidden');
    $('.upload-video-stage-5').removeClass('hidden');
  };

  function submitSignup(first, last, zipcode, email, districts, partner) {
    var person = {
      'person' : {
        'family_name': last.val(),
        'given_name': first.val(),
        'postal_addresses': [{ 'postal_code' : zipcode}],
        'email_addresses' : [{ 'address' : email.val() }],
        'custom_fields': {
          'districts': districts,
          'partner': partner.prop('checked')
        }
      }
    };
    var userID = email.val().split('').reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    $.ajax({
      url: 'https://actionnetwork.org/api/v2/forms/eafd3b2a-8c6b-42da-bec8-962da91b128c/submissions',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(person),
      success: function() {
        localStorage.setItem('signedUp', true);
        $('#email-signup').fadeOut(750);
      },
      error: function(error) {
        console.log('error', error);
        $('#email-signup-form button').before('<span class="error">An error has occured, please try again later.</span>');
      }
    });
    return false;
  }


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

  function setUrlParameter(param, value) {
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
  }

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
    $('[data-toggle="popover"]').popover({html:true});
    $('#button-to-form').hide();
    $('#save-event').on('submit', eventHandler.save);
    $('#look-up').on('submit', eventHandler.lookup);
    $('#email-signup-form').on('submit', eventHandler.validateSignup);
    $('#view-all').on('click', TownHall.viewAll);
    $('.sort').on('click', 'a', eventHandler.sortTable);
    setupTypeaheads();

    $('.filter').on('click', 'a', eventHandler.filterTable);
    $('#filter-info').on('click', 'button.btn', eventHandler.removeFilter);
    $('button.upload-video-begin').click(eventHandler.uploadVideoStage2);
    $('#upload-another').on('click', eventHandler.resetVideoForm);
    $('#video-file-field').change(function(){
      $('.upload-video-upload').attr('disabled', false);
    });
    eventHandler.resetFilters();
    eventHandler.addFilter('meetingType', 'Town Hall');
    eventHandler.addFilter('meetingType', 'Empty Chair Town Hall');
    eventHandler.addFilter('meetingType', 'Tele-Town Hall');

    dataviz.initalProgressBar(100, $('.dem-senate'));
    dataviz.initalProgressBar(100, $('.rep-senate'));
    dataviz.initalProgressBar(434, $('.dem-house'));
    dataviz.initalProgressBar(434, $('.rep-house'));
    // Perform zip search on load
    var zipcode = getUrlParameter('zipcode');
    if (zipcode) {
      $('#look-up input').val(zipcode);
      eventHandler.lookup(document.createEvent('Event'));
    }

    // url hash for direct links to subtabs
    // slightly hacky routing
    if (location.hash) {
      var hashLocation = location.hash.split('?')[0];
      $("a[href='" + hashLocation + "']").tab('show');
    } else {
      TownHall.isMap = true;
    }
    if (localStorage.getItem('signedUp') === 'true') {
      $('#email-signup').hide();
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
        eventHandler.resetHome();

        setTimeout( function(){
          onResizeMap();

        }, 500);

      } else if (hashid === '#missing-members') {
        setTimeout(function () {
          $('.grid').isotope();
        }, 1500);
        location.hash = hashid;
      }
      else {
        location.hash = hashid;
      }

      $('html, body').scrollTop(0);
      $('[data-toggle="popover"]').popover('hide');
    });

    // Remove query param when closing modal
    $('.event-modal').on('hide.bs.modal', function (e) {
      setUrlParameter('eventId', false);
    });
    $('#close-email').on('click', function(e){
      localStorage.setItem('signedUp', true);
      $('#email-signup').fadeOut(750);
    });
    // Only show one popover at a time
    $('#all-events-table').on('click', 'li[data-toggle="popover"]', function(e) {
      $('#all-events-table [data-toggle="popover"]').not(this).popover('hide');
    });

    $('body').on('click', '.popover .popover-title a.close', function(e) {
      $('[data-toggle="popover"]').popover('hide');
    });
    $('#missing-member-banner-btn').on('click', function(e){
      $('#missing-member-tab').click();
    });

    $('#view-missing-member-report').on('click', function(e) {
      $('.missing-members-modal').modal('show');
    });

    // Fix popover bug in bootstrap 3 https://github.com/twbs/bootstrap/issues/16732
    $('body').on('hidden.bs.popover', function (e) {
      $(e.target).data('bs.popover').inState.click = false;
    });
    $('.privacy-policy-button').on('click', function(e){
      $('#privacy-policy-link').click();
      $('html,body').scrollTop(0);
    });
  }

  window.onBeforeunload=null;

  module.eventHandler = eventHandler;
})(window);
