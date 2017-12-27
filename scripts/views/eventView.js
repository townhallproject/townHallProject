(function(module) {
  var provider = new firebase.auth.GoogleAuthProvider();
  var zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;

  // object to hold the front end view functions
  var eventHandler = {};

  eventHandler.whereToZoomMap = function(justSenate, thisState, validDistricts){
    if (justSenate) {
      bb = mapView.getBoundingBox(thisState);
    } else {
      bb = mapView.getBoundingBox(thisState, validDistricts);
    }
    mapView.zoomLocation = bb;
    if (mapView.webGL) {
      mapView.focusMap(bb);
    } else {
      noWebGlMapView.focusMap(bb);
    }
  };

  eventHandler.checkIfOnlySenate = function(selectedData){
    var justSenate = true;
    var numOfDistrictEvents = 0;
    if (selectedData.length === 0) {
      justSenate = false;
    }
    selectedData.forEach(function(ele){
      if(ele.district) {
        numOfDistrictEvents ++;
        justSenate = false;
      }
    });
    return [justSenate, numOfDistrictEvents];
  };

  eventHandler.renderResults = function(thisState, validDistricts, validSelections) {
    var selectedData = TownHall.matchSelectionToZip(thisState, validDistricts);
    var $zip = $('#look-up input').val();
    var $parent = $('#nearest');
    var $text = $('.selection-results_content');
    $('#missing-member-banner').hide();
    $parent.empty();
    //render table
    var districtText = ' ';
    validDistricts.forEach(function(district){
      if (district) {
        districtText = districtText + thisState + '-' + district + ' ';
      } else {
        districtText = districtText + thisState;
      }
    });
    var justSenate = true;
    if (selectedData.length > 0) {
      $('#no-events').hide();
      // set globals for filtering
      $parent.addClass('nearest-with-results');

      TownHall.isCurrentContext = true;
      TownHall.currentContext = selectedData;
      tableHandler.renderTableWithArray(selectedData);

      var counts = eventHandler.checkIfOnlySenate(selectedData);
      justSenate = counts[0];
      var numOfDistrictEvents = counts[1];

      var numOfSateEvents = selectedData.length - numOfDistrictEvents;
      var message = '<p>Showing ' + numOfDistrictEvents + ' event(s) for the ' + districtText + ' representative</p>';
      var messageState = '<p>and ' + numOfSateEvents + ' event(s) for ' + thisState + ' senators</p>';

      $text.html(message + messageState);
      selectedData.forEach(function(ele){
        eventHandler.renderPanels(ele, $parent);
      });

      mapView.makeSidebar(selectedData);
      eventHandler.whereToZoomMap(justSenate, thisState, validDistricts);

      addtocalendar.load();
    } else {
      $text.html('There are no events for ' + districtText);
      $('#no-events').show();
      $('#no-events')[0].scrollIntoView();
      justSenate = false;
      mapView.killSidebar();
      eventHandler.whereToZoomMap(justSenate, thisState, validDistricts);
      tableHandler.resetTable();
    }
    if (mapView.webGL) {
      mapView.highlightDistrict(validSelections);
    }
  };

  eventHandler.getStateDataFromAbbr = function(abbr) {
    var stateObj = stateData.filter(function(state){
      return state.USPS === abbr;
    });
    return stateObj;
  };

  eventHandler.getStateDataFromName = function(stateName) {
    var stateObj = stateData.filter(function(state){
      return state.Name === stateName;
    });
    return stateObj;
  };

  eventHandler.lookup = function (e) {
    e.preventDefault();
    TownHall.resetData();
    TownHall.zipQuery;
    var zip = $('#look-up input').val().trim();
    var zipCheck = zip.match(zipcodeRegEx);
    if (zipCheck) {
      var zipClean = zip.split('-')[0];
      var validDistricts = [];
      var validSelections = [];
      var callbackTrigger = 0;
      var thisState;
      var stateCode;
      TownHall.lookupZip(zipClean)
        .then(function(zipToDistricts){
          TownHall.zipQuery = zipClean;
          urlParamsHandler.setUrlParameter('district', false);
          urlParamsHandler.setUrlParameter('zipcode', zipClean);
          tableHandler.resetFilters();
          zipToDistricts.forEach(function(district){
            stateObj = eventHandler.getStateDataFromAbbr(district.abr);
            stateCode = stateObj[0].FIPS;
            var geoid = stateCode + district.dis;
            thisState = district.abr;
            validDistricts.push(district.dis);
            validSelections.push(geoid);
          });
          repCardHandler.renderRepresentativeCards(TownHall.lookupReps('zip', zip), $('#representativeCards section'));
          eventHandler.renderResults(thisState, validDistricts, validSelections);
        })
        .catch(function(error){
          zipLookUpHandler.zipErrorResponse('That zip code is not in our database, if you think this is an error please email us.', error);
        });

    } else {
      zipLookUpHandler.zipErrorResponse('Zip codes are 5 or 9 digits long.');
    }
  };

  // reset the home page to originial view
  eventHandler.resetHome = function (event) {
    if (event) {
      event.preventDefault();
    }
    $('.header-small').hide();
    $('.header-large').fadeIn();
    $('#look-up input').val('');
    $('#missing-member-banner').show();
    $('#email-signup-form input[name=zipcode]').val('');
    $('#no-events').hide();
    $('#representativeCards section').empty();
    $('#representativeCards').hide();
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
    TownHall.sortOn = 'Date';
  };

  // Renders one panel, assumes data processing has happened
  eventHandler.renderPanels = function(townhall, $parent) {
    if (townhall.address) {
      townhall.addressLink = 'https://www.google.com/maps/dir/Current+Location/' + escape(townhall.address);
    };
    var compiledTemplate = Handlebars.getTemplate('eventCards');
    var $panel = $(compiledTemplate(townhall));
    $panel.appendTo($parent);
  };

  eventHandler.populateEventModal = function(townhall) {
    var compiledTemplate = Handlebars.getTemplate('eventModal');
    $('.event-modal .modal-content').html(compiledTemplate(townhall));
    urlParamsHandler.setUrlParameter('eventId', townhall.eventId);
    addtocalendar.load();
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

  function checkEventParam() {
    var eventId = urlParamsHandler.getUrlParameter('eventId');
    if (eventId) {
      firebasedb.ref('/townHalls/' + eventId).once('value').then(function(snapshot) {
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
    $('.sort').on('click', 'a', tableHandler.sortTable);
    setupTypeaheads();

    $('.filter').on('click', 'a', tableHandler.filterTable);
    $('#filter-info').on('click', 'button.btn', tableHandler.removeFilter);
    $('button.upload-video-begin').click(videoUploadHandler.uploadVideoStage2);
    $('#upload-another').on('click', videoUploadHandler.resetVideoForm);
    $('#video-file-field').change(function(){
      $('.upload-video-upload').attr('disabled', false);
    });
    $('#scrollBtn').on('click', tableHandler.scrollToTopTable);


    tableHandler.initialFilters();

    // url hash for direct links to subtabs
    // slightly hacky routing
    if (location.hash) {
      var hashLocation = location.hash.split('?')[0];
      $("a[href='" + hashLocation + "']").tab('show');
      if (hashLocation === '#missing-members') {
        if (!missingMemberView.loaded) {
          missingMemberView.init();
        } else {
          setTimeout(function () {
            $('.grid').isotope();
          }, 1500);
        }
      }
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
        page('/');
        if (location.pathname ='/') {
          setTimeout(function () {
            eventHandler.resetHome();
          }, 100);
          TownHall.isMap = true;
        }
      } else if (hashid === '#home' && TownHall.isMap === true) {
        page('/');
        setTimeout(function () {
          eventHandler.resetHome();
        }, 100);
      } else if (hashid === '#missing-members') {
        if (!missingMemberView.loaded) {
          missingMemberView.init();
        } else {
          setTimeout(function () {
            $('.grid').isotope();
          }, 1500);
        }
        location.hash = hashid;
      }
      else {
        location.hash = hashid;
      }

      $('html, body').scrollTop(0);
    });

    // Remove query param when closing modal
    $('.event-modal').on('hide.bs.modal', function (e) {
      urlParamsHandler.setUrlParameter('eventId', false);
    });
    $('#close-email').on('click', function(e){
      localStorage.setItem('signedUp', true);
      $('#email-signup').fadeOut(750);
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
    $('.privacy-policy-button').on('click', function(e){
      $('#privacy-policy-link').click();
      $('html,body').scrollTop(0);
    });
    $('#close-email').on('click', function(e){
      localStorage.setItem('signedUp', true);
      $('#email-signup').fadeOut(750);
    });
    $('#email-signup-form').on('submit', emailHandler.validateSignup);
    if (localStorage.getItem('signedUp') === 'true') {
      $('#email-signup').hide();
    }
    var divTop = $('#all-events-table').offset().top + 380;
    $(window).scroll(function() {
      if($(window).scrollTop() > divTop) {
        $('#scrollBtn').show();
      } else {
        $('#scrollBtn').hide();
      }
    });
  }

  window.onBeforeunload=null;

  module.eventHandler = eventHandler;
})(window);
