(function(module) {
  function Event (opts) {
    for (var key in opts) {
      this[key] = opts[key];
      this['Date'] = new Date(opts.Date);
    }
  }

  Event.allEvents = [];


  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyDwZ41RWIytGELNBnVpDr7Y_k1ox2F2Heg',
    authDomain: 'townhallproject-86312.firebaseapp.com',
    databaseURL: 'https://townhallproject-86312.firebaseio.com',
    storageBucket: 'townhallproject-86312.appspot.com',
    messagingSenderId: '208752196071'
  };

  firebase.initializeApp(config);
  var firebasedb = firebase.database();
  var provider = new firebase.auth.GoogleAuthProvider();

  Event.prototype.writetoFB = function () {
    console.log('saving to firebase');
    var newEvent = firebasedb.ref('/townHalls/').push();
    newEvent.set(this);
  };

  Event.prototype.updateFB = function (key) {
    console.log('saving to firebase');
    if (!key) {
      var key = firebasedb.ref('/townHalls/').push();
    }
    firebasedb.ref('/townHalls/' + key).set(this);
  };

  Event.prototype.toHtml= function(templateid){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    return renderTemplate(this);
  };

  Event.lookupZip = function (zip) {
    return firebasedb.ref('/zips/' + zip).once('value').then(function(snapshot) {
      var location = new google.maps.LatLng(snapshot.val().LAT, snapshot.val().LNG);
      Event.returnNearest(location);
    }).catch(function(error){
      console.log('That is not a real zip');
    });
  };

  Event.returnNearest = function (location) {
    var locations = [];
    firebase.database().ref('/townHalls').once('value').then(function(snapshot) {
      snapshot.forEach(function(ele){
        locations.push(new Event(ele.val()));
      });
      var positions = locations.sort(function (a , b) {
        a.dist = google.maps.geometry.spherical.computeDistanceBetween(location, new google.maps.LatLng(a.lat,a.lng));
        b.dist = google.maps.geometry.spherical.computeDistanceBetween(location, new google.maps.LatLng(b.lat,b.lng));
        return a.dist <= b.dist ? -1 : 1;
      });
      eventHandler.render(positions);
    });
  };

  Event.viewAll = function (location) {
    var locations = [];
    firebase.database().ref('/townHalls').once('value').then(function(snapshot) {
      snapshot.forEach(function(ele){
        newEvent = new Event(ele.val());
        $newRow = $(newEvent.toHtml($('#view-firebase-template')));
        $newRow.attr('id' , ele.key);
        $('#all-events').append($newRow);
      });
    });
  };

  Event.prototype.getLatandLog = function(address, key) {
    var newEvent = this;
    if (address === 'undefined undefined undefined undefined') {
      console.log('address', address, this);
    } else {
      $.ajax({
        url : 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBmEKpZ6cePaTMPRERaoMj9Gx-dyQ5Lxkk',
        data : {
          'address' : address
        },
        dataType : 'json',
        success: function(r){
          newEvent.lat = r.results[0].geometry.location.lat;
          newEvent.lng = r.results[0].geometry.location.lng;
          newEvent.address = r.results[0].formatted_address;
          Event.allEvents.push(newEvent);
          // newEvent.updateFB(key)
        },
        error: function(e){
          console.log('error', e, address);
        }
      });
    }
  };

  //Gets everything from the google doc and does geo coding in batches
  Event.fetchAll = function() {
    url = 'https://sheets.googleapis.com/v4/spreadsheets/1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA/values/Upcoming%20Events!C:P?key=AIzaSyBw6HZ7Y4J1dATyC4-_mKmt3u0hLRRqthQ';
    $.ajax({
      url: url,
      success: function (response){
        var range = response.values;
        if (range.length > 0) {
          console.log('data from google');
          setTimeout(function(){
            Event.batchCalls(range.splice(11, range.length));
          }, 2000);
        }
        else {
          console.log('No data found.');
        }
      }
    });
  };

  // the geocoding API has a rate limit. This looks up 10 every 2 seconds.
  Event.batchCalls = function(response){
    chunck = response.splice(0,10);
    Event.encodeFromGoogle(chunck);
    if (response.length > 0) {
      setTimeout(function(){
        Event.batchCalls(response);
      }, 2000);
    } else {
      // When done, update firebase
      // firebase.database().ref('/townHalls/').remove();
      // Event.allEvents.forEach(function(event){
      // })
    };
  };

  Event.encodeFromGoogle = function(array){
    var googlekeys = ['Member', 	'Party'	, 'State'	, 'District', 	'meetingType', 	'Date', 	'Time'	,'timeZone', 	'Location', 	'streetAddress', 	'City', 	'State-ab'	, 'Zip', 'Notes'];
    for (var j = 0; j < array.length; j++) {
      var row = array[j];
      rowObj = new Event;
      for (var k = 0; k < row.length; k++) {
        rowObj[googlekeys[k]] = row[k];
      }
      rowObj.getLatandLog(rowObj.streetAddress + ' ' + rowObj.City + ' ' +rowObj.State + ' ' + rowObj.Zip);
    };
  };

//   Event.fetchAll();
  module.Event = Event;
})(window);
