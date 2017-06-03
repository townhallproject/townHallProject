function Moc(opts) {
  for (keys in opts) {
    this[keys] = opts[keys];
  }
  this.TownHall = 0
  if (this.type === 'sen') {
    this.repOf = 'Sen. ' + this.state
    this.displayType = 'Senate'
  } else {
    this.repOf = this.state + '-' + this.zeroPadding()
    this.displayType = 'House'
  }
  if (this.currentEvents) {
    for (const key of Object.keys(this.currentEvents)){
      if (Object.keys(this.currentEvents[key]).length !== 20) {
        townhallId = key.replace(/\s/g, '')
        this[townhallId] = Object.keys(this.currentEvents[key]).length
        }
      }
  }
}

Moc.prototype.zeroPadding = function() {
  var zeros = '00';
  district = this.district.toString()
  return zeros.substring(0, zeros.length - district.length) + district
}

Moc.allMocsObjs = [];

Moc.addFilter = function(filterObj, filterValue) {
  $currentState = $('#mm-current-state');
  var total = parseInt($currentState.attr('data-total'));

  var nofilters = true
    Object.keys(filterObj).forEach(function(filter){
      if (filterObj[filter].length > 0) {
        nofilters = false
        $('.' + filter).remove()
        var removeFilterbutton = '<li class="mm-turn-off-filter button-group ' + filter + '" data-filter-group=' + filter + '><button class=" btn-filter btn btn-secondary btn-xs" ' +
                     'data-filter="" >' +
                        filterObj[filter] + '<i class="fa fa-times" aria-hidden="true"></i>' +
                      '</button></li>';
        $('#mm-filter-info').append(removeFilterbutton);
      } else if (filterObj[filter].length === 0) {
        $('.' + filter).remove()
      }
    })
    var cur =   nofilters ? total : $(filterValue).length;
    $currentState.text('Viewing ' + cur + ' of ' + total + ' total missing members');
};

Moc.loadAll = function(){
  $currentState = $('#mm-current-state');
  var total = 0
  return new Promise(function (resolve, reject) {
    firebase.database().ref('mocData/').once('value').then(function(snapshot){
      snapshot.forEach(function(member){
        total ++;
        var memberobj = new Moc(member.val());
        memberobj.partyClass = memberobj.party.substring(0,3)
        if (memberobj.missingMember) {

          Moc.allMocsObjs.push(memberobj);
        }

        });
      $currentState.attr('data-current', total)
      $currentState.attr('data-total', total)
      resolve(Moc.allMocsObjs);
    });
  });
};



// init Isotope


Moc.renderAll = function(template, parent, array) {
  var compiledTemplate = Handlebars.getTemplate(template);
  array.forEach(function(ele) {
    if (ele.type && ele.type === 'sen') {
      ele.subtitle = 'Senator'
    } else if (ele.type && ele.type === 'rep') {
      ele.subtitle = ele.state + '-' + ele.district
    }
    $(parent).append($(compiledTemplate(ele)))
  })
}


Moc.loadAll().then(function(returnedData){
  $currentState = $('#mm-current-state');
  var total = parseInt($currentState.attr('data-total'));
  var cur = parseInt($currentState.attr('data-current'));
  $currentState.text('Viewing ' + cur + ' of ' + total + ' total missing members');

  Moc.renderAll('missingMemberCard', '.grid', returnedData)

  allCategories = returnedData.map(function(ele){

    return {
      categoryID : ele.state.trim(),
      Category : ele.state,
      perCapita : 1
    }

  }).reduce(function(acc, cur){
    if (acc.map(function(mapItem){return mapItem['categoryID']; }).indexOf(cur['categoryID']) > -1) {
      acc[acc.map(function(mapItem){return mapItem['categoryID']; }).indexOf(cur['categoryID'])].count ++
      cur.perCapita = parseInt(statePopulation[cur.categoryID])/cur.count
    } else {
      cur.count = 1
      cur.perCapita = parseInt(statePopulation[cur.categoryID])/cur.count
      acc.push(cur)
    }
    return acc;
},[]).sort(function(a, b){
  statea = a.categoryID
  stateb = b.categoryID
  if (statea > stateb) {
    return 1
  } else if (stateb > statea) {
    return -1
  }
  return 0
})

Moc.renderAll('missingMemberButton', '#state-buttons', allCategories)

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


    console.log($(filterValue).length);
    console.log(filters, filterValue);
    Moc.addFilter(filters, filterValue)
    $grid.isotope({ filter: filterValue });
  });
})

// flatten object by concatting values
function concatValues( obj ) {
  var value = '';
  for ( var prop in obj ) {
    value += obj[ prop ];
  }
  return value;
}
