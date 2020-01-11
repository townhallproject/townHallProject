import $ from 'jquery';
import Isotope from 'isotope-layout';
import statePopulation from '../../data/statePop';
import MoC from '../models/MemberOfCongress';
import missingMemberButtonTemplate from '../../templates/missingMemberButton';
import missingMemberCardTemplate from '../../templates/missingMemberCard';

const missingMemberView = {};
missingMemberView.loaded = false;
missingMemberView.statePopulation = statePopulation;

missingMemberView.addFilter = function (filterObj, filterValue) {
  let $currentState = $('#mm-current-state');
  let total = parseInt($currentState.attr('data-total'));
  let nofilters = true;
  Object.keys(filterObj).forEach(function (filter) {
    if (filterObj[filter].length > 0) {
      nofilters = false;
      $('.' + filter).remove();
      let removeFilterbutton = '<li class="mm-turn-off-filter button-group ' + filter + '" data-filter-group=' + filter + '><button class=" btn-filter btn btn-secondary btn-xs" ' +
        'data-filter="" >' +
        filterObj[filter].split('.')[1] + '<i class="fa fa-times" aria-hidden="true"></i>' +
        '</button></li>';
      $('#mm-filter-info').append(removeFilterbutton);
    } else if (filterObj[filter].length === 0) {
      $('.' + filter).remove();
    }
  });
  let cur = nofilters ? total : $(filterValue).length;
  $currentState.text('Viewing ' + cur + ' of ' + total + ' total missing members');
};

missingMemberView.renderAll = function (template, parent, array) {
  array.forEach(function (ele) {
    $(parent).append($(template(ele)));
  });
};

// flatten object by concatting values
function concatValues(obj) {
  let value = '.element-item';
  for (let prop in obj) {
    value += obj[prop];
  }
  return value;
}

function getAllCategories(returnedData) {
  return returnedData.map(function (ele) {
    return {
      categoryID: ele.state.trim(),
      Category: ele.state,
      perCapita: 1
    };
  }).reduce(function (acc, cur) {
    if (acc.map(function (mapItem) { return mapItem['categoryID']; }).indexOf(cur['categoryID']) > -1) {
      acc[acc.map(function (mapItem) { return mapItem['categoryID']; }).indexOf(cur['categoryID'])].count++;
      cur.perCapita = parseInt(missingMemberView.statePopulation[cur.categoryID]) / cur.count;
    } else {
      cur.count = 1;
      cur.perCapita = parseInt(missingMemberView.statePopulation[cur.categoryID]) / cur.count;
      acc.push(cur);
    }
    return acc;
  }, []).sort(function (a, b) {
    let statea = a.categoryID;
    let stateb = b.categoryID;
    if (statea > stateb) {
      return 1;
    } else if (stateb > statea) {
      return -1;
    }
    return 0;
  });
}

missingMemberView.startIsotope = function startIsotope() {
  let $grid = new Isotope('.grid', {
    itemSelector: '.element-item',
    getSortData: {
      townhall: '.townHallNumber parseInt' // text from querySelector
    },
    sortBy: 'townhall',
    sortAscending: false
  });
  // // layout Isotope after each image loads
  // will probably need diff library with npm - imagesLoaded
  // $grid.imagesLoaded().progress(function () {
  //   $grid.isotope('layout');
  // });
  let filters = {};
  $('.filter-button-group').on('click', '.btn-filter', function () {
    let $this = $(this);
    // get group key
    let $buttonGroup = $this.parents('.button-group');
    let filterGroup = $buttonGroup.attr('data-filter-group');
    // set filter for group
    filters[filterGroup] = $this.attr('data-filter');
    // combine filters
    let filterValue = concatValues(filters);
    console.log(filters, filterValue)
    missingMemberView.addFilter(filters, filterValue);
    $grid.arrange({
      filter: filterValue
    });
  });
}

missingMemberView.init = function () {
  console.log('initing')
  return MoC.all().then(function (MoCs) {
    let missingMembers = MoCs.filter(function (member) {
      member.format();
      return member.missing_member && member.missing_member[116];
    });

    missingMemberView.loaded = true;
    let $currentState = $('#mm-current-state');
    let $copy = $('#mm-total-copy');
    $('#mm-current-state').attr('data-current', missingMembers.length);
    $('#mm-current-state').attr('data-total', missingMembers.length);
    // inital report of data
    $currentState.text('Viewing ' + missingMembers.length + ' of ' + missingMembers.length + ' total missing members');
    $currentState.removeClass('transparent');
    $copy.text($currentState.attr('data-total'));
    // make cards
    missingMemberView.renderAll(missingMemberCardTemplate, '.grid', missingMembers);
    // add state buttons
    let allCategories = getAllCategories(missingMembers);
    missingMemberView.renderAll(missingMemberButtonTemplate, '#state-buttons', allCategories);
    // initalize isotope
  });
};

export default missingMemberView;
