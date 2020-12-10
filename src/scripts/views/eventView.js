/*globals setTimeout addtocalendar Promise*/
import $ from 'jquery';
import page from 'page';
import {
  uniqBy
} from 'lodash';
import { firebasedb } from '../lib/firebasedb';

import eventCardTemplate from '../../templates/eventCards';
import eventModalTemplate from '../../templates/eventModal';

import stateData from '../../data/states';
import urlParamsHandler from '../lib/urlParams';
import mapHelperFunctions from '../lib/map-helper-functions';

import TownHall from '../models/TownHall';

import indexView from './indexView';
import mapView from './mapView';
import newEventView from './mfolSubmitForm';
import tableHandler from './tableView';
import videoUploadHandler from './videoView';
import emailHandler from './emailSignUpView';
import missingMemberView from './missingMembersView';
import resultsView from './resultsView';
import stateView from './stateView';
import mapboxView from './mapboxView';
import zipLookUpHandler from './zipLookUpView';

const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
// object to hold the front end view functions
const eventHandler = {};

eventHandler.whereToZoomMap = function (justSenate, state, districts, additionalDistricts) {
  var bb;
  if (justSenate && !additionalDistricts) {
    bb = mapHelperFunctions.getBoundingBox(state);
  } else if (!additionalDistricts) {
    bb = mapHelperFunctions.getBoundingBox(state, districts);
  } else {
    bb = mapHelperFunctions.getBoundingBox(state, districts, additionalDistricts)
  }
  mapView.zoomLocation = bb;
  mapView.focusMap(bb);
};

eventHandler.checkIfOnlySenate = function (selectedData) {
  var justSenate = true;
  var numOfDistrictEvents = 0;
  if (selectedData.length === 0) {
    justSenate = false;
  }
  selectedData.forEach(function (ele) {
    if (ele.district) {
      numOfDistrictEvents++;
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
  stateDistricts.forEach(function (district) {
    if (district) {
      stateText = stateText + mapping[chamber] + '-' + district + ' ';
    }
  });
  return stateText;
}

eventHandler.renderResults = function (locationData) {
  tableHandler.resetFilters();
  let selectedData = [];
  let federalEvents = [];
  let districtText= '';
  let newDistricts;
  if (locationData.displayName) {
    selectedData = [...selectedData, ...TownHall.matchDisplayName(locationData.displayName)];
    newDistricts = uniqBy(TownHall.matchDisplayName(locationData.displayName).map(townHall => {
      return {
        state: townHall.state,
        district: townHall.district || null,
        chamber: townHall.chamber,
        level: townHall.level
      }
    }), ele => `${ele.state}-${ele.district}`)
  }
  if (locationData.federal) {
    var state = locationData.federal.state;
    var districts = locationData.federal.districts;
    var validSelections = locationData.federal.selections;
    federalEvents = TownHall.matchSelectionToZip(state, districts);
    var numFederal = federalEvents.length;
    selectedData = [...selectedData, ...federalEvents];
    var zoomMap = true;
    //render table
    districtText = ' ';
    emailHandler.clearDistricts();
    districts.forEach(function (district) {
      if (district) {
        districtText = districtText + state + '-' + district + ' ';
        emailHandler.addDistrict(state + '-' + district)
      } else {
        districtText = districtText + state;
      }
    });
  }
  if (locationData.upper) {
    var upperText = makeReporterText(locationData.upper.districts, 'upper');
    var upperDistricts = locationData.upper.districts;
    var upperEvents = TownHall.matchSelectionToZipStateEvents(state, upperDistricts, 'upper');
    var numOfUpper = upperEvents.length;
    selectedData = selectedData.concat(upperEvents);
    zoomMap = false;
  }
  if (locationData.lower) {
    var lowerText = makeReporterText(locationData.lower.districts, 'lower');
    var lowerDistricts = locationData.lower.districts;
    var lowerEvents = TownHall.matchSelectionToZipStateEvents(state, lowerDistricts, 'lower');
    var numOfLower = lowerEvents.length;
    selectedData = selectedData.concat(lowerEvents);
    zoomMap = false;
  }
  if (locationData.displayName) {
    selectedData = [...selectedData, ...TownHall.matchDisplayName(locationData.displayName)];
    newDistricts = uniqBy(TownHall.matchDisplayName(locationData.displayName).map(townHall => {
      return {
        state: townHall.state,
        district: townHall.district || null,
        chamber: townHall.chamber,
        level: townHall.level
      }
    }), ele => `${ele.state}-${ele.district}`)
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
    TownHall.currentContext = selectedData.map(function (ele) { return ele; });
    tableHandler.renderTableWithArray(selectedData);

    var counts = eventHandler.checkIfOnlySenate(federalEvents);
    justSenate = counts[0];
    var numOfDistrictEvents = counts[1];

    var numOfUSSenateEvents = numFederal - numOfDistrictEvents;
    let message = '';
    if (locationData.federal) {
      message = '<p>Showing ' + numOfDistrictEvents + ' event(s) for the ' + districtText + ' representative</p>';
      message = message + '<p>' + numOfUSSenateEvents + ' event(s) for ' + state + ' senators</p>';

    }
    if (numOfLower) {
      message = message + '<p>' + numOfLower + ' event(s) for the ' + lowerText + ' state representative(s)</p>';
    }
    if (numOfUpper >= 0) {
      message = message + '<p>' + numOfUpper + ' event(s) for the ' + upperText + ' state senator(s)</p>';
    }

    $text.html(message);
    selectedData.forEach(function (ele) {
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
    eventHandler.whereToZoomMap(justSenate, state, districts, newDistricts);
  }
  if (mapView.webGL && validSelections) {
    mapboxView.highlightDistrict(validSelections);
  }
};

eventHandler.getStateDataFromAbbr = function (abbr) {
  var stateObj = stateData.filter(function (state) {
    return state.USPS === abbr;
  });
  return stateObj;
};

eventHandler.getStateDataFromName = function (stateName) {
  var stateObj = stateData.filter(function (state) {
    return state.Name === stateName;
  });
  return stateObj;
};

eventHandler.checkStateName = function (state) {
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

function handleZipToDistrict(zipToDistrictArray) {
  var federal = zipToDistrictArray[0].reduce(function (acc, cur) {
    if (!acc.districts) {
      acc.districts = [];
      acc.validSelections = [];
    }
    var stateObj = eventHandler.getStateDataFromAbbr(cur.abr);
    var geoid = stateObj[0].FIPS + cur.dis;
    acc.state = cur.abr;
    acc.districts.push(cur.dis);
    acc.validSelections.push(geoid);
    return acc;
  }, {});

  if (!eventHandler.checkStateName(federal.state)) {
    return zipLookUpHandler.zipErrorResponse('That zipcode is not in ' + stateView.state + '. Go back to <a href="/">Town Hall Project U.S.</a> to search for events.');
  }

  if (zipToDistrictArray.length > 1) {
    var lower = zipToDistrictArray[1].reduce(function (acc, cur) {
      if (!acc.districts) {
        acc.districts = [];
      }
      acc.state = cur.abr;
      acc.districts.push(cur.dis);
      return acc;
    }, {});
    var upper = zipToDistrictArray[2].reduce(function (acc, cur) {
      if (!acc.districts) {
        acc.districts = [];
      }
      acc.state = cur.abr;
      acc.districts.push(cur.dis);
      return acc;
    }, {});
  }
  return {
    federal: federal,
    upper: upper,
    lower: lower,
  };
}

// TODO: delete function
eventHandler.lookup = function (e) {
  e.preventDefault();
  TownHall.resetData();
  TownHall.zipQuery;
  var zip = $('#look-up input').val().trim();

  var zipCheck = zip.match(zipcodeRegEx);
  if (zipCheck) {
    var zipClean = zip.split('-')[0];
    var lookupArray = getLookupArray();
    var promises = lookupArray.map(function (path) {
      return TownHall.lookupZip(zipClean, path);
    });
    Promise.all(promises)
      .then(function (zipToDistrictArray) {
        TownHall.zipQuery = zipClean;
        urlParamsHandler.setUrlParameter('district', false);
        urlParamsHandler.setUrlParameter('zipcode', zipClean);

        var locationData = handleZipToDistrict(zipToDistrictArray);
        eventHandler.renderResults(locationData);
      })
      .catch(function (error) {
        zipLookUpHandler.zipErrorResponse('That zip code is not in our database, if you think this is an error please email us.', error);
      });
  } else {
    zipLookUpHandler.zipErrorResponse('Zip codes are 5 or 9 digits long.');
  }
};

// Renders one panel, assumes data processing has happened
eventHandler.renderPanels = function (townhall, $parent) {
  if (townhall.address) {
    townhall.addressLink = 'https://www.google.com/maps/dir/Current+Location/' + escape(townhall.address);
  }
  townhall.makeFormattedMember();
  var $panel = $(eventCardTemplate(townhall));
  $panel.appendTo($parent);
};

export const populateEventModal = function (townhall) {
  let { level } = townhall;
  $('.event-modal .modal-content').html(eventModalTemplate(townhall));
  if (level === 'state') {
    urlParamsHandler.setUrlParameter('state', townhall.state);
  }
  urlParamsHandler.setUrlParameter('eventId', townhall.eventId);
  addtocalendar.load();
};

function setupTypeaheads() {
  var typeaheadConfig = {
    fitToElement: true,
    delay: 250,
    highlighter: function (item) { return item; }, // Kill ugly highlight
    updater: function (selection) {
      tableHandler.addFilter(this.$element.attr('data-filter'), selection);
      tableHandler.renderTableWithArray(tableHandler.getFilterState());
    }
  };

  $('#stateTypeahead').typeahead($.extend({ source: TownHall.allStates }, typeaheadConfig));
  $('#memberTypeahead').typeahead($.extend({ source: TownHall.allMoCs }, typeaheadConfig));
}

function checkEventParam() {
  let eventId = urlParamsHandler.getUrlParameter('eventId');
  var stateId = urlParamsHandler.getUrlParameter('state');
  let ref;
  if (stateId && eventId) {
    ref = `/state_townhalls/${stateId}/${eventId}`;
  } else if (eventId) {
    ref = `/townHalls/${eventId}`;
  }
  if (ref) {
    firebasedb.ref(ref).once('value').then(function (snapshot) {
      if (snapshot.exists()) {
        var townhall = new TownHall(snapshot.val());
        townhall.makeFormattedMember();
        townhall.makeDisplayDistrict();
        populateEventModal(townhall);
        $('.event-modal').modal('show');
      }
    });
  }
}

export const init = () => {
  checkEventParam();
  $('#button-to-form').hide();
  $('#save-event').on('submit', eventHandler.save);
  // $('#look-up').on('submit', eventHandler.lookup);
  $('#view-all').on('click', TownHall.viewAll);
  $('.sort').on('click', 'a', tableHandler.sortTable);
  setupTypeaheads();

  $('.filter').on('click', 'a', tableHandler.filterTable);
  $('#filter-info').on('click', 'button.btn', tableHandler.removeFilter);
  $('button.upload-video-begin').click(videoUploadHandler.uploadVideoStage2);
  $('#upload-another').on('click', videoUploadHandler.resetVideoForm);
  $('#video-file-field').change(function () {
    $('.upload-video-upload').attr('disabled', false);
  });
  $('#scrollBtn').on('click', tableHandler.scrollToTopTable);


  // url hash for direct links to subtabs
  // slightly hacky routing
  if (location.hash) {
    var hashLocation = location.hash.split('?')[0];
    $("a[href='" + hashLocation + "']").tab('show');
    $('.home-page-only').removeClass('hidden');
  } else {
    TownHall.isMap = true;
  }
  if (localStorage.getItem('signedUp') === 'true') {
    emailHandler.hideEmailForm();
  }

  $('.menu-container .hash-link').on('click', function onClickGethref() {
    var hashid = this.getAttribute('href');
    $('ul .hash-link').parent().removeClass('active');
    $('.home-page-only').removeClass('hidden');

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
    } else {
      location.hash = hashid;
    }
  });

  // Remove query param when closing modal
  $('.event-modal').on('hide.bs.modal', function () {
    urlParamsHandler.setUrlParameter('eventId', false);
    urlParamsHandler.setUrlParameter('state', false);
  });
  $('#close-email').on('click', function () {
    localStorage.setItem('signedUp', true);
    emailHandler.closeEmailForm();
  });
  $('body').on('click', '.popover .popover-title a.close', function () {
    $('[data-toggle="popover"]').popover('hide');
  });
  // $('#missing-member-banner-btn').on('click', function () {
  //   $('#missing-member-tab').click();
  // });
  $('#view-missing-member-report').on('click', function () {
    $('.missing-members-modal').modal('show');
  });
  $('#view-accessibility-report').on('click', function () {
    $('.recess-report-modal').modal('show');
  });
  $('.privacy-policy-button').on('click', function () {
    $('#privacy-policy-link').click();
    $('html,body').scrollTop(0);
  });
  $('#close-email').on('click', function () {
    localStorage.setItem('signedUp', true);
    emailHandler.closeEmailForm();
  });
  $('#email-signup-form').on('submit', emailHandler.validateSignup);
  if (localStorage.getItem('signedUp') === 'true') {
    emailHandler.hideEmailForm();
  }
  $('#open-email-form').on('click', emailHandler.openEmailForm);
  // var divTop = $('#all-events-table').offset().top + 380;
  // $(window).scroll(function () {
  //   if ($(window).scrollTop() > divTop) {
  //     $('#scrollBtn').show();
  //   } else {
  //     $('#scrollBtn').hide();
  //   }
  // });
}

export const embedMapInit = () => {
    checkEventParam();
    $('#button-to-form').hide();
    $('#save-event').on('submit', eventHandler.save);
    $('#look-up').on('submit', eventHandler.lookup);

    $('#view-all').on('click', TownHall.viewAll);

    $('body').on('click', '.popover .popover-title a.close', function () {
      $('[data-toggle="popover"]').popover('hide');
    });

}

function setYearEndImage() {
  if (window.innerWidth < 768) {
    $('#year-one img').attr('src', 'Images/EOY_2017_Report_Mobile.png');
  } else {
    $('#year-one img').attr('src', 'Images/EOY_Report_Layout_noBG-01-01.png');

  }
}

window.addEventListener('resize', setYearEndImage);
window.onBeforeunload = null;

export default eventHandler;
