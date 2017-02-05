(function(module) {
  function Event (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
  }
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyBw6HZ7Y4J1dATyC4-_mKmt3u0hLRRqthQ',
    authDomain: 'staywokesignups.firebaseapp.com',
    databaseURL: 'https://staywokesignups.firebaseio.com',
    storageBucket: 'staywokesignups.appspot.com',
    messagingSenderId: '47559178634',
  }

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
    return firebasedb.ref('/publicInfo/zips/' + zip).once('value').then(function(snapshot) {
      var location = new google.maps.LatLng(snapshot.val().LAT,  snapshot.val().LNG)
      Event.returnNearest(location)
    }).catch(function(error){
      console.log('That is not a real zip');
    })
  }

  Event.returnNearest = function (location) {
    var locations = []
    firebase.database().ref('/townHalls').once('value').then(function(snapshot) {
      snapshot.forEach(function(ele){
        locations.push(new Event(ele.val()))
      })
      var positions = locations.sort(function (a , b) {
        var apos = google.maps.geometry.spherical.computeDistanceBetween(location, new google.maps.LatLng(a.lat,a.long));
        var bpos = google.maps.geometry.spherical.computeDistanceBetween(location,  new google.maps.LatLng(b.lat,b.long));
        return apos <= bpos ? -1 : 1;
      })
      eventHandler.render(positions);
    });
  };

  Event.viewAll = function (location) {
    var locations = []
    firebase.database().ref('/townHalls').once('value').then(function(snapshot) {
      snapshot.forEach(function(ele){
        console.log(ele.key);
        newEvent = new Event(ele.val())
        $newRow = $(newEvent.toHtml($('#view-firebase-template')))
        $newRow.attr('id' , ele.key)
        $('#all-events').append($newRow)
      })
    })
  }

  Event.prototype.getLatandLog = function(address, key) {
    var newEvent = this
    $.ajax({
      url : 'https://maps.googleapis.com/maps/api/geocode/json',
      data : {
        'address' : address
      },
      dataType : 'json',
      success: function(r){
        console.log('success', r);
        newEvent.lat = r.results[0].geometry.location.lat
        newEvent.long = r.results[0].geometry.location.lng
        newEvent.address = r.results[0].formatted_address
        console.log(newEvent);
        newEvent.updateFB(key)
      },
      error: function(e){
        console.log('error', e);
      }
    })
  }

  module.Event = Event;
})(window);
