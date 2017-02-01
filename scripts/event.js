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

  firebase.initializeApp(config)

  var firebasedb = firebase.database()

  var provider = new firebase.auth.GoogleAuthProvider();

  Event.signIn = function (){
    firebase.auth().signInWithPopup(provider).then(function(result) {
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
  }


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    // User is signed in.
      console.log(user.displayName, ' is signed in');
    } else {
      Event.signIn()
      // No user is signed in.
    }
  });

  Event.prototype.writetoFB = function () {
    console.log('saving to firebase');
    var newEvent = firebasedb.ref('events').push()
    newEvent.set(this)
  };

  Event.lookupZip = function (zip) {
    return firebasedb.ref('/publicInfo/zips/' + zip).once('value').then(function(snapshot) {
      var location = new google.maps.LatLng(snapshot.val().LAT,  snapshot.val().LNG)
      Event.returnNearest(location)
    })
  }

  Event.returnNearest = function (location) {
    firebase.database().ref('/events/').once('value').then(function(snapshot) {
      var locations = [];
      snapshot.forEach(function(ele){
        locations.push(ele.val())
      })
      var position = locations.reduce(function (prev, curr) {
        var cpos = google.maps.geometry.spherical.computeDistanceBetween(location, new google.maps.LatLng(curr.lat,curr.long));
        var ppos = google.maps.geometry.spherical.computeDistanceBetween(location,  new google.maps.LatLng(prev.lat,prev.long));
        return cpos < ppos ? curr : prev;
      })
      console.log(position);
      eventHandler.render(position.name+''+ position.address)
    })
  }

  Event.prototype.getLatandLog = function(address) {
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
        newEvent.writetoFB()
      },
      error: function(e){
        console.log('error', e);
      }
    })
  }

  module.Event = Event;
})(window);
