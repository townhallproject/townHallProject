(function(module) {
  var firebasedb = firebase.database()
  var provider = new firebase.auth.GoogleAuthProvider();

  // object to hold the frontend view functions
  var eventHandler = {};

  // creates new TownHall object from form
  eventHandler.save = function (e) {
    e.preventDefault();
    var newTownHall = new TownHall( $('#save-event input').get().reduce(function(newObj, cur){
      newObj[cur.id] = $(cur).val();
      return newObj;
    }, {})
  );
    newTownHall.getLatandLog(newTownHall.address);
  };

// Given a new event, creates TownHall Object and encodes with lat and lng based on address from google docs
  eventHandler.saveSimple = function (newevent) {
    var newTownHall = new TownHall(newevent);
    newTownHall.getLatandLog(newTownHall.streetNumber + newTownHall.streetName +newTownHall.Zip);
  };

  // given an event and a current key, update that event.
  eventHandler.update = function (newevent , key) {
    var newTownHall = new TownHall(newevent)
    var address = newTownHall.streetNumber +' '+ newTownHall.streetName +' '+ newTownHall.City + ' ' + newTownHall.Zip
    console.log(address);
    newTownHall.getLatandLog(address, key);
  };

  // Renders the page in response to lookup
  eventHandler.lookup = function (e) {
    e.preventDefault();
    TownHall.lookupZip($('#look-up input').val());
    $('.header-small').removeClass('hidden');
    $('.header-small').show()
    $('.header-large').hide();
    $('.form-text-results').addClass('text-center');
    $('.left-panels').addClass('left-panels-border');
    $('#nearest').addClass('nearest-with-results');
  };

  // reset the home page to originial view
  eventHandler.resetHome = function () {
    $('.header-small').hide();
    $('.header-large').show();
    $('#look-up input').val('')
    $('.form-text-results').removeClass('text-center');
    $('.left-panels').removeClass('left-panels-border');
    $('#nearest').removeClass('nearest-with-results');
    TownHall.isCurrentContext = false;
    TownHall.currentContext = [];
    TownHall.zipQuery = '';
    $('#map').appendTo('.map-large');
    onResizeMap()
    var $parent = $('#nearest');
    var $results = $('#textresults')
    $parent.empty();
    $results.empty();
    $table = $('#all-events-table');
    $table.empty()
    TownHall.allTownHalls.forEach(function(ele){
      eventHandler.renderTable(ele, $table);
    })

  };

  // Renders one panel, assumes data processing has happened
  eventHandler.renderPanels = function(event, $parent) {
    var $panel = $(event.toHtml($('#event-template')));
      $panel.children('.panel').addClass(event.Party);
      $panel.appendTo($parent);
  };

  // render table row
  eventHandler.renderTable = function (townhall, $tableid) {
      townhall.formatDateTime();
      townhall.dist = Math.round(townhall.dist/1609.344);
      townhall.addressLink = "https://www.google.com/maps?q=" + escape(townhall.address);
      $($tableid).append(townhall.toHtml($('#table-template')));
  };

  // takes the current set of data in the table and sorts by date
  eventHandler.viewByDate = function (e) {
    e.preventDefault();
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    var filtereddata = TownHall.filteredResults.length > 0 ? TownHall.filteredResults: data;
    TownHall.currentContext = TownHall.sortDate(filtereddata);
    $table = $('#all-events-table');
    $table.empty()
    TownHall.currentContext.forEach(function(ele){
      eventHandler.renderTable(ele, $table);
    })
  }

  // filters the table on click
  eventHandler.filterTable = function (e) {
    e.preventDefault();
    $table = $('#all-events-table');
    var filterID = this.id;
    var filterCol = $(this).attr('data-filter')
    $table.empty();
    var index = TownHall.filterIds.indexOf(filterCol);
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    var filtereddata = TownHall.filteredResults.length > 0 ? TownHall.filteredResults: data;
    if (filterID === 'All') {
      TownHall.filteredResults = [];
      TownHall.filterIds.pop(index);
      data.forEach(function(ele){
        eventHandler.renderTable(ele, $table);
      })
    }
    else {
      // check if filtering by the same column
      if (index < 0 ) {
        var filtered = TownHall.filterByCol(filterCol, filterID, filtereddata);
      }
      else {
        var filtered = TownHall.filterByCol(filterCol, filterID, data);
      }
      TownHall.filteredResults = filtered;
      TownHall.filterIds.push(filterCol);
      filtered.forEach(function(ele){
        eventHandler.renderTable(ele, $table);
      })
    }

  }


  // renders results of search
  eventHandler.render = function (events, zipQuery) {
    var $parent = $('#nearest');
    var $results = $('#textresults')
    $parent.empty();
    $results.empty();
    var $table = $('#all-events-table');
    var $text = $('<h4>')
    $table.empty();
    maxDist = 80467.2;
    var nearest = events.reduce(function(acc, cur){
      if (cur.dist < maxDist) {
        acc.push(cur);
      }
      return acc;
    },[])
    $('#map').appendTo('.map-small');
    if (nearest.length === 0) {
      var townHall = events[0]
      var townHalls = [townHall];
      recenterMap(townHalls, zipQuery);
      events.forEach(function(ele){
        eventHandler.renderTable(ele,  $table);
      })
      $text.text('No events within 50 miles of your zip, the closest one is ' + townHall.dist + ' miles away');
      $results.append($text)
      eventHandler.renderPanels(townHall, $parent);
    } else {
      TownHall.currentContext = nearest;
      TownHall.isCurrentContext = true;
      recenterMap(nearest, zipQuery);
      $text.text('There are ' + nearest.length + ' upcoming events within 50 miles of you')
      $results.append($text)
      nearest.forEach(function(ele){
        eventHandler.renderTable(ele, $table);
        eventHandler.renderPanels(ele, $parent);
      })
    }
    addtocalendar.load();
  };


  // url hash for direct links to subtabs
  // slightly hacky routing
  $(document).ready(function(){
    $('#save-event').on('submit', eventHandler.save);
    $('#look-up').on('submit', eventHandler.lookup);
    $('#view-all').on('click', TownHall.viewAll);
    $('#sort-date').on('click', eventHandler.viewByDate);
    $('.filter').on('click', 'a', eventHandler.filterTable);
    if (location.hash) {
      $("a[href='" + location.hash + "']").tab('show')
    }
    else  {
      TownHall.isMap = true;
    }
    $('.nav').on('click', 'a', function onClickGethref(event) {
      var hashid = this.getAttribute('href')
      if (hashid === '#home' && TownHall.isMap === false) {
        console.log('going home and no map');
        history.replaceState({}, document.title, ".");
        setTimeout( function(){
          onResizeMap()
          if (location.pathname ='/') {
              eventHandler.resetHome()
              TownHall.isMap === true
          }
        }, 50);
       }
       else if (hashid === '#home' && TownHall.isMap === true) {
         console.log('going home and map');
         history.replaceState({}, document.title, ".");
         eventHandler.resetHome()
       }
      else {
        location.hash = this.getAttribute('href')
      }
    })
  })


  module.eventHandler = eventHandler;
})(window);
