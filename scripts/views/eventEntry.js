(function(module) {
  var firebasedb = firebase.database()
  var provider = new firebase.auth.GoogleAuthProvider();

  // object to hold the front end view functions
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

  //Sign in fuction for firebase
  eventHandler.signIn = function (){
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  };

  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //   // User is signed in.
  //     console.log(user.displayName, ' is signed in');
  //   } else {
  //     eventHandler.signIn()
  //     // No user is signed in.
  //   }
  // });

  eventHandler.lookup = function (e) {
    e.preventDefault();
    TownHall.lookupZip($('#look-up input').val());
    $('.header-small').removeClass('hidden');
    $('.header-large').hide();
    $('.form-text-results').addClass('text-center')
  };

  eventHandler.renderPanels = function(event, $parent) {
    var $panel = $(event.toHtml($('#event-template')));
      $panel.children('.panel').addClass(event.Party);
      $panel.appendTo($parent);
  };

  eventHandler.renderTable = function (townhall, $tableid) {
      townhall.formatDateTime();
      townhall.dist = Math.round(townhall.dist/1609.344);
      townhall.addressLink = "https://www.google.com/maps?q=" + escape(townhall.address);
      $($tableid).append(townhall.toHtml($('#table-template')));
  };

  // takes the current set of data in the table and sorts by date
  eventHandler.viewByDate = function (e) {
    e.preventDefault();
    $table = $('#all-events-table');
    $table.empty();
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    var filtereddata = TownHall.filteredResults.length > 0 ? TownHall.filteredResults: data;
    TownHall.currentContext = TownHall.sortDate(filtereddata);
    TownHall.currentContext.forEach(function(ele){
      eventHandler.renderTable(ele, $table);
    })
  }

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


  $('#all-events').on('focusout', '.event-row', function(){
    id = this.id;
    console.log(id);
    newTownHall = $(this).children('td').get().reduce(function(newObj, cur){
      newObj[cur.id] = $(cur).html();
      return newObj;
    }, {});
    console.log(newTownHall);
    eventHandler.update(newTownHall , id);
  });

  // url hash for direct links to subtabs on inauguration.html
  $(document).ready(function(){
    if (location.hash) {
      $("a[href='" + location.hash + "']").tab('show')
    }
    $('.nav').on('click', 'a[data-toggle]', function onClickGethref(event) {
      var hashid = this.getAttribute('href')
      if (hashid === '#home') {
        history.replaceState({}, document.title, ".");        }
      else {
        location.hash = this.getAttribute('href')
      }
    })
  })

  $('#save-event').on('submit', eventHandler.save);
  $('#look-up').on('submit', eventHandler.lookup);
  $('#view-all').on('click', TownHall.viewAll);
  $('#sort-date').on('click', eventHandler.viewByDate);
  $('.filter').on('click', 'a', eventHandler.filterTable);

  module.eventHandler = eventHandler;
})(window);
