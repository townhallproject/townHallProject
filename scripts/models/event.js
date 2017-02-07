(function(module) {
  function TownHall (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
  }

  TownHall.allTownHalls = [];
  TownHall.timeZones = {
    PST : 'America/Los_Angeles',
    MST : 'America/Denver',
    CST : 'America/Chicago',
    EST : 'America/New_York',
    other : 'no time zone'
  }

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

  TownHall.prototype.writetoFB = function () {
    console.log('saving to firebase');
    var newTownHall = firebasedb.ref('/townHalls/').push();
    newTownHall.set(this);
  };

  TownHall.prototype.updateFB = function (key) {
    console.log('saving to firebase');
    if (!key) {
      var key = firebasedb.ref('/townHalls/').push();
    }
    firebasedb.ref('/townHalls/' + key).set(this);
  };

  TownHall.prototype.toHtml= function(templateid){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    return renderTemplate(this);
  };

  TownHall.prototype.validateZone = function () {
    var tz = TownHall.timeZones[this.timeZone];
    if (!tz) {
      var time = Date.now();
      var loc = this.lat+','+this.lng
      url = 'https://maps.googleapis.com/maps/api/timezone/json?location='+loc+'&timestamp=1331766000&key=AIzaSyBlmL9awpTV6AQKQJOmOuUlH1APXWmCHLQ'
      $.get(url, function (response){
        this.zoneString = response.timeZoneId;
        return this;
      })
    }
    else {
      this.zoneString = tz
      return this;
    }
  }

  TownHall.toTwentyFour = function (time) {
    var hourmin = time.split(' ')[0];
    var ampm = time.split(' ')[1];
    if (ampm ==='PM') {
      var hour = hourmin.split(':')[0]
      hour = Number(hour) +12;
      hourmin = hour + ':' + hourmin.split(':')[1]
    }
    return hourmin + ':' + '00';
  };

  TownHall.prototype.formatDateTime = function (){
    this.dateObj = new Date(this.Date);
    this.dateString = this.dateObj.toDateString();
    if (this.dateString !== 'Invalid Date') {
      this.dateValid = true;
      var month = this.dateObj.getMonth() + 1;
      var month = month.toString().length === 1 ? (0 + month.toString()) :month.toString();
      var day = this.dateObj.getDay() + 1;
      var day  = day.toString().length === 1 ? (0 + day.toString()) :day.toString();
      var yearMonthDay = this.dateObj.getFullYear() + '-' + month + '-'+day ;
      this.timeStart24 = TownHall.toTwentyFour(this.Time);
      if (!this.TimeEnd) {
        hour = parseInt(this.timeStart24.split(':')[0]) + 2;
        this.timeEnd24 = hour + ':' + this.timeStart24.split(':')[1] + ':' + '00';
      }
      else {
        this.timeEnd24 = TownHall.toTwentyFour(this.TimeEnd);
      }
      this.validateZone();
      this.yearMonthDay = yearMonthDay;
      return this;
    }
    else {
      return this;

    }

  };

  TownHall.lookupZip = function (zip) {
    return firebasedb.ref('/zips/' + zip).once('value').then(function(snapshot) {
      var location = new google.maps.LatLng(snapshot.val().LAT, snapshot.val().LNG);
      TownHall.returnNearest(location);
    }).catch(function(error){
      console.log('That is not a real zip');
    });
  };

  TownHall.returnNearest = function (location) {
    var locations = [];
    firebase.database().ref('/townHalls').once('value').then(function(snapshot) {
      snapshot.forEach(function(ele){
        locations.push(new TownHall(ele.val()));
      });
      var positions = locations.sort(function (a , b) {
        a.dist = google.maps.geometry.spherical.computeDistanceBetween(location, new google.maps.LatLng(a.lat,a.lng));
        b.dist = google.maps.geometry.spherical.computeDistanceBetween(location, new google.maps.LatLng(b.lat,b.lng));
        return a.dist <= b.dist ? -1 : 1;
      });
      eventHandler.render(positions);
    });
  };

  TownHall.viewAll = function (location) {
    var locations = [];
    firebase.database().ref('/townHalls').once('value').then(function(snapshot) {
      snapshot.forEach(function(ele){
        newTownHall = new TownHall(ele.val());
        $newRow = $(newTownHall.toHtml($('#view-firebase-template')));
        $newRow.attr('id' , ele.key);
        $('#all-events').append($newRow);
      });
    });
  };

  TownHall.prototype.getLatandLog = function(address, key) {
    var newTownHall = this;
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
          newTownHall.lat = r.results[0].geometry.location.lat;
          newTownHall.lng = r.results[0].geometry.location.lng;
          newTownHall.address = r.results[0].formatted_address;
          newTownHall.formatDateTime();
          TownHall.allTownHalls.push(newTownHall);
          // newTownHall.updateFB(key)
        },
        error: function(e){
          console(newTownHall);
          console.log('error', e, address);
        }
      });
    }
  };

  //Gets everything from the google doc and does geo coding in batches
  TownHall.fetchAll = function() {
    url = 'https://sheets.googleapis.com/v4/spreadsheets/1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA/values/Upcoming%20Events!C:P?key=AIzaSyBw6HZ7Y4J1dATyC4-_mKmt3u0hLRRqthQ';
    $.ajax({
      url: url,
      success: function (response){
        var range = response.values;
        if (range.length > 0) {
          console.log('data from google');
          setTimeout(function(){
            TownHall.batchCalls(range.splice(11, range.length));
          }, 2000);
        }
        else {
          console.log('No data found.');
        }
      }
    });
  };

  // the geocoding API has a rate limit. This looks up 10 every 2 seconds.
  TownHall.batchCalls = function(response){
    chunck = response.splice(0,10);
    TownHall.encodeFromGoogle(chunck);
    if (response.length > 0) {
      setTimeout(function(){
        TownHall.batchCalls(response);
      }, 2000);
    } else {
      // When done, update firebase
      console.log('got all data', TownHall.allTownHalls);
      firebase.database().ref('/townHalls/').remove();
      TownHall.allTownHalls.forEach(function(event){
        event.writetoFB();
      })
    };
  };

  TownHall.encodeFromGoogle = function(array){
    var googlekeys = ['Member', 	'Party'	, 'State'	, 'District', 	'meetingType', 	'Date', 	'Time'	,'timeZone', 	'Location', 	'streetAddress', 	'City', 	'StateAb'	, 'Zip', 'Notes'];
    for (var j = 0; j < array.length; j++) {
      var row = array[j];
      rowObj = new TownHall;
      for (var k = 0; k < row.length; k++) {
        rowObj[googlekeys[k]] = row[k];
      }
      if (rowObj.streetAddress.length>2) {
        rowObj.getLatandLog(rowObj.streetAddress + ' ' + rowObj.City + ' ' +rowObj.StateAb + ' ' + rowObj.Zip);
      }
      else {
        rowObj.noLoc = true;
        rowObj.getLatandLog(rowObj.State);
      }
    };
  };

  // TownHall.fetchAll();
  module.TownHall = TownHall;
})(window);
