var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyD_1gaWM06y2_P1kbH4jTMi3zy6vJUYp1E',
  libraries : ['geometries']
});


function Event (opts) {
  for (var key in opts) {
    this[key] = opts[key];
  }
}

var Distance = require('geo-distance');

  // Initialize Firebase
var config = {
  apiKey: 'AIzaSyBw6HZ7Y4J1dATyC4-_mKmt3u0hLRRqthQ',
  authDomain: 'staywokesignups.firebaseapp.com',
  databaseURL: 'https://staywokesignups.firebaseio.com',
  storageBucket: 'staywokesignups.appspot.com',
  messagingSenderId: '47559178634',
};

var firebase = require('firebase');
firebase.initializeApp(config);

var firebasedb = firebase.database();


Event.lookupZip = function (zip) {
  return firebasedb.ref('/publicInfo/zips/' + zip).once('value')
  .then(function(snapshot) {
    return Event.getEvents({lat:parseInt(snapshot.val().LAT), lon: parseInt(snapshot.val().LNG)});
  });
};

Event.getEvents = function (location) {
  return firebase.database().ref('/events/').once('value')
  .then(function(snapshot) {
    var locations = [];
    snapshot.forEach(function(ele){
      locations.push(ele.val());
    });
    return Event.findNearest(location, locations);
  });
};

Event.findNearest = function (location, locations) {
  var position = locations.reduce(function (prev, curr) {
    var cpos = Distance.between(location, {lat:curr.lat, lon:curr.long});
    var ppos = Distance.between(location, {lat:prev.lat, lon:prev.long});
    return cpos < ppos ? curr : prev;
  });
  console.log(position);
  console.log('resolving ', position.name);
  return position.name;
};

Event.prototype.getLatandLog = function(address) {
  var newEvent = this;
  $.ajax({
    url : 'https://maps.googleapis.com/maps/api/geocode/json',
    data : {
      'address' : address
    },
    dataType : 'json',
    success: function(r){
      console.log('success', r);
      newEvent.lat = r.results[0].geometry.location.lat;
      newEvent.long = r.results[0].geometry.location.lng;
      newEvent.address = r.results[0].formatted_address;
      console.log(newEvent);
      newEvent.writetoFB();
    },
    error: function(e){
      console.log('error', e);
    }
  });
};

module.exports = Event;
