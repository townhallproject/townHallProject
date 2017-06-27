(function(module) {
  var missingMemberView = {};

  missingMemberView.addFilter = function(filterObj, filterValue) {
    $currentState = $('#mm-current-state');
    var total = parseInt($currentState.attr('data-total'));
    var nofilters = true;
    Object.keys(filterObj).forEach(function(filter){
      if (filterObj[filter].length > 0) {
        nofilters = false;
        $('.' + filter).remove();
        var removeFilterbutton = '<li class="mm-turn-off-filter button-group ' + filter + '" data-filter-group=' + filter + '><button class=" btn-filter btn btn-secondary btn-xs" ' +
                       'data-filter="" >' +
                          filterObj[filter].split('.')[1] + '<i class="fa fa-times" aria-hidden="true"></i>' +
                        '</button></li>';
        $('#mm-filter-info').append(removeFilterbutton);
      } else if (filterObj[filter].length === 0) {
        $('.' + filter).remove();
      }
    });
    var cur =   nofilters ? total : $(filterValue).length;
    $currentState.text('Viewing ' + cur + ' of ' + total + ' total missing members');
  };

  missingMemberView.renderAll = function(template, parent, array) {
    var compiledTemplate = Handlebars.getTemplate(template);
    array.forEach(function(ele) {
      $(parent).append($(compiledTemplate(ele)));
    });
  };

  // flatten object by concatting values
  function concatValues( obj ) {
    var value = '.element-item';
    for ( var prop in obj ) {
      value += obj[ prop ];
    }
    return value;
  }

  function getAllCategories(returnedData) {
    return returnedData.map(function(ele){
      return {
        categoryID : ele.state.trim(),
        Category : ele.state,
        perCapita : 1
      };
    }).reduce(function(acc, cur){
      if (acc.map(function(mapItem){return mapItem['categoryID']; }).indexOf(cur['categoryID']) > -1) {
        acc[acc.map(function(mapItem){return mapItem['categoryID']; }).indexOf(cur['categoryID'])].count ++;
        cur.perCapita = parseInt(statePopulation[cur.categoryID])/cur.count;
      } else {
        cur.count = 1;
        cur.perCapita = parseInt(statePopulation[cur.categoryID])/cur.count;
        acc.push(cur);
      }
      return acc;
    },[]).sort(function(a, b){
      statea = a.categoryID;
      stateb = b.categoryID;
      if (statea > stateb) {
        return 1;
      } else if (stateb > statea) {
        return -1;
      }
      return 0;
    });
  }

  function startIsotope() {
    var $grid = $('.grid').isotope({
      itemSelector: '.element-item',
      getSortData: {
        townhall: '.townHallNumber parseInt' // text from querySelector
      },
      sortBy: 'townhall',
      sortAscending: false
    });
    // layout Isotope after each image loads
    $grid.imagesLoaded().progress( function() {
      $grid.isotope('layout');
    });
    var filters = {};
    $('.filter-button-group').on( 'click', '.btn-filter', function() {
      var $this = $(this);
      // get group key
      var $buttonGroup = $this.parents('.button-group');
      var filterGroup = $buttonGroup.attr('data-filter-group');
      // set filter for group
      filters[ filterGroup ] = $this.attr('data-filter');
      // combine filters
      var filterValue = concatValues( filters );
      missingMemberView.addFilter(filters, filterValue);
      $grid.isotope({ filter: filterValue });
    });
  }

  Moc.loadAll().then(function(returnedData){
    $currentState = $('#mm-current-state');
    var total = parseInt($currentState.attr('data-total'));
    var cur = parseInt($currentState.attr('data-current'));
    // inital report of data
    $currentState.text('Viewing ' + cur + ' of ' + total + ' total missing members');
    // make cards
    missingMemberView.renderAll('missingMemberCard', '.grid', returnedData);
    // add state buttons
    allCategories = getAllCategories(returnedData);
    missingMemberView.renderAll('missingMemberButton', '#state-buttons', allCategories);
    // initalize isotope
    startIsotope();
  });



  module.missingMemberView = missingMemberView;
})(window);
