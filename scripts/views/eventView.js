/*globals newEventView*/
(function(module) {
  var zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
  // object to hold the front end view functions
  var eventHandler = {};

  eventHandler.whereToZoomMap = function(justSenate, thisState, validDistricts){
    var bb;
    if (justSenate) {
      bb = mapHelperFunctions.getBoundingBox(thisState);
    } else {
      bb = mapHelperFunctions.getBoundingBox(thisState, validDistricts);
    }
    mapView.zoomLocation = bb;
    mapView.focusMap(bb);
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

  function makeReporterText(stateDistricts, chamber) {
    var stateText = ' ';
    var mapping = {
      lower: 'HD',
      upper: 'SD',
    };
    stateDistricts.forEach(function(district){
      if (district) {
        stateText = stateText + mapping[chamber] + '-' + district + ' ';
      }
    });
    return stateText;
  }

  eventHandler.renderResults = function(locationData) {
    var thisState = locationData.federal.thisState;
    var validDistricts = locationData.federal.validDistricts;
    var validSelections = locationData.federal.validSelections;
    var federalEvents = TownHall.matchSelectionToZip(thisState, validDistricts);
    var numFederal = federalEvents.length;
    var zoomMap = true;
    //render table
    var districtText = ' ';
    validDistricts.forEach(function(district){
      if (district) {
        districtText = districtText + thisState + '-' + district + ' ';
      } else {
        districtText = districtText + thisState;
      }
    });
    var selectedData = federalEvents;
    if (locationData.upper ) {
      var upperText = makeReporterText(locationData.upper.validDistricts, 'upper');
      var upperDistricts = locationData.upper.validDistricts;
      var upperEvents = TownHall.matchSelectionToZipStateEvents(thisState, upperDistricts, 'upper');
      var numOfUpper = upperEvents.length;
      selectedData = selectedData.concat(upperEvents);
      zoomMap = false;
    }
    if (locationData.lower) {
      var lowerText = makeReporterText(locationData.upper.validDistricts, 'lower');
      var lowerDistricts = locationData.lower.validDistricts;
      var lowerEvents = TownHall.matchSelectionToZipStateEvents(thisState, lowerDistricts, 'lower');
      var numOfLower = lowerEvents.length;
      selectedData = selectedData.concat(lowerEvents);
      zoomMap = false;
    }

    var $text = $('.selection-results_content');
    var $parent = $('#nearest');
    resultsView.render();

    var justSenate = true;
    if (selectedData.length > 0) {
      $('#no-events').hide();
      // set globals for filtering
      $parent.addClass('nearest-with-results');

      TownHall.isCurrentContext = true;
      TownHall.currentContext = selectedData;
      tableHandler.renderTableWithArray(selectedData);

      var counts = eventHandler.checkIfOnlySenate(federalEvents);
      justSenate = counts[0];
      var numOfDistrictEvents = counts[1];

      var numOfUSSenateEvents = numFederal - numOfDistrictEvents;
      var message = '<p>Showing ' + numOfDistrictEvents + ' event(s) for the ' + districtText + ' representative</p>';
      message = message + '<p>' + numOfUSSenateEvents + ' event(s) for ' + thisState + ' senators</p>';
      if (numOfLower) {
        message = message + '<p>' + numOfLower + ' event(s) for the ' + lowerText + ' state representative(s)</p>';
      }
      if (numOfUpper >= 0 ) {
        message = message + '<p>' + numOfUpper + ' event(s) for the ' + upperText + ' state senator(s)</p>';
      }

      $text.html(message);
      selectedData.forEach(function(ele){
        eventHandler.renderPanels(ele, $parent);
      });

      mapView.makeSidebar(selectedData);
      addtocalendar.load();

    } else {
      $text.html('There are no events for ' + districtText);
      $('#no-events').show();
      justSenate = false;
      mapView.killSidebar();
      tableHandler.resetTable();
    }
    if (zoomMap) {
      eventHandler.whereToZoomMap(justSenate, thisState, validDistricts);
    }
    if (mapView.webGL && validSelections) {
      mapboxView.highlightDistrict(validSelections);
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

  eventHandler.checkStateName = function(state) {
    if (stateView.state) {
      if (stateView.state === state) {
        return true;
      }
      return false;
    }
    return true;
  };

  function getLookupArray() {
    if (stateView.state) {
      return ['/zipToDistrict/', '/state_zip_to_district_lower/' + stateView.state + '/', '/state_zip_to_district_upper/' + stateView.state + '/'];
    }
    return ['/zipToDistrict/'];
  }

  function handleZipToDistrict(zipToDistrictArray){
    var federal = zipToDistrictArray[0].reduce(function(acc, cur){
      if (!acc.validDistricts) {
        acc.validDistricts = [];
        acc.validSelections = [];
      }
      var stateObj = eventHandler.getStateDataFromAbbr(cur.abr);
      var geoid = stateObj[0].FIPS + cur.dis;
      acc.thisState = cur.abr;
      acc.validDistricts.push(cur.dis);
      acc.validSelections.push(geoid);
      return acc;
    }, {});

    if (!eventHandler.checkStateName(federal.thisState)) {
      return zipLookUpHandler.zipErrorResponse('That zipcode is not in ' + stateView.state + '. Go back to <a href="/">Town Hall Project U.S.</a> to search for events.');
    }

    if (zipToDistrictArray.length > 1) {
      var lower = zipToDistrictArray[1].reduce(function(acc, cur){
        if (!acc.validDistricts) {
          acc.validDistricts = [];
        }
        acc.thisState = cur.abr;
        acc.validDistricts.push(cur.dis);
        return acc;
      }, {});
      var upper = zipToDistrictArray[2].reduce(function(acc, cur){
        if (!acc.validDistricts) {
          acc.validDistricts = [];
        }
        acc.thisState = cur.abr;
        acc.validDistricts.push(cur.dis);
        return acc;
      }, {});
    }
    return {
      federal: federal,
      upper: upper,
      lower: lower,
    };
  }

  eventHandler.lookup = function (e) {
    e.preventDefault();
    TownHall.resetData();
    TownHall.zipQuery;
    var zip = $('#look-up input').val().trim();
    var zipCheck = zip.match(zipcodeRegEx);
    if (zipCheck) {
      var zipClean = zip.split('-')[0];

      repCardHandler.renderRepresentativeCards(TownHall.lookupReps('zip', zipClean), $('#representativeCards section'));
      var lookupArray = getLookupArray();
      var promises = lookupArray.map(function(path){
        return TownHall.lookupZip(zipClean, path);
      });
      Promise.all(promises)
        .then(function(zipToDistrictArray){
          TownHall.zipQuery = zipClean;
          urlParamsHandler.setUrlParameter('district', false);
          urlParamsHandler.setUrlParameter('zipcode', zipClean);
          tableHandler.resetFilters();

          var locationData = handleZipToDistrict(zipToDistrictArray);
          eventHandler.renderResults(locationData);
        })
        .catch(function(error){
          zipLookUpHandler.zipErrorResponse('That zip code is not in our database, if you think this is an error please email us.', error);
        });
    } else {
      zipLookUpHandler.zipErrorResponse('Zip codes are 5 or 9 digits long.');
    }
  };

  // Renders one panel, assumes data processing has happened
  eventHandler.renderPanels = function(townhall, $parent) {
    if (townhall.address) {
      townhall.addressLink = 'https://www.google.com/maps/dir/Current+Location/' + escape(townhall.address);
    }
    townhall.makeFormattedMember();
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
          var townhall = new TownHall(snapshot.val())
          townhall.makeFormattedMember();
          eventHandler.populateEventModal(townhall);
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
      } else if (hashLocation === '#mfol-submit-event') {
        newEventView.render();
      }
    } else {
      TownHall.isMap = true;
    }
    if (localStorage.getItem('signedUp') === 'true') {
      $('#email-signup').hide();
    }

    $('.hash-link').on('click', function onClickGethref() {
      var hashid = this.getAttribute('href');
      $('ul .hash-link').parent().removeClass('active');

      if (hashid === '#home' && TownHall.isMap === false) {
        page('/');
        if (location.pathname === '/') {
          setTimeout(function () {
            indexView.resetHome();
          }, 100);
          TownHall.isMap = true;
        }
      } else if (hashid === '#home' && TownHall.isMap === true) {
        page('/');
        setTimeout(function () {
          indexView.resetHome();
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
      } else if (hashid === '#mfol-submit-event') {
        newEventView.render();
        location.hash = hashid;
      }
      else {
        location.hash = hashid;
      }

      $('html, body').scrollTop(0);
    });

    // Remove query param when closing modal
    $('.event-modal').on('hide.bs.modal', function () {
      urlParamsHandler.setUrlParameter('eventId', false);
    });
    $('#close-email').on('click', function(){
      localStorage.setItem('signedUp', true);
      $('#email-signup').fadeOut(750);
    });
    $('body').on('click', '.popover .popover-title a.close', function() {
      $('[data-toggle="popover"]').popover('hide');
    });
    $('#missing-member-banner-btn').on('click', function(){
      $('#missing-member-tab').click();
    });
    $('#view-missing-member-report').on('click', function() {
      $('.missing-members-modal').modal('show');
    });
    $('.privacy-policy-button').on('click', function(){
      $('#privacy-policy-link').click();
      $('html,body').scrollTop(0);
    });
    $('#close-email').on('click', function(){
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

  function setYearEndImage(){
    if (window.innerWidth < 768) {
      $('#year-one img').attr('src', 'Images/EOY_2017_Report_Mobile.png');
    } else {
      $('#year-one img').attr('src', 'Images/EOY_Report_Layout_noBG-01-01.png');

    }
  }

  window.addEventListener('resize', setYearEndImage);
  window.onBeforeunload=null;

  module.eventHandler = eventHandler;
})(window);
