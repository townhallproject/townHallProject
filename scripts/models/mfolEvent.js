(function (module) {
  function MfolEvent(opts) {
    this.organizer_name = opts.ogranizerName;
    this.organizer_phone= opts.orgainzerPhone || false;
    this.organizer_email= opts.orgainzerEmail;
    this.location = opts.location || false;
    this.address = opts.address || false;
    this.state = opts.state;
    this.district = opts.district || false;
    this.chamber = opts.chamber || 'lower';
    this.level = 'federal';
    this.eventType = 'Town Hall';
    this.members = opts.members || 'none';
    this.yearMonthDay = opts.yearMonthDay;
    this.time = opts.Time;
    this.organization = opts.organization || false;
    this.connect_with_others = opts.connectWithOthers || false;
    this.lat = opts.lat || false;
    this.lng = opts.lng || false;
  }

  MfolEvent.getMocByStateAndDistrict = function(){
    return firebasedb.ref('mocByStateDistrict/').once('value').then(function(snapshot){
      var mocsByStateAndDistrict = {};
      snapshot.forEach(function(endpoint){
        var key = endpoint.key;
        var data = endpoint.val();
        var state = key.split('-')[0];
        if (!mocsByStateAndDistrict[state]) {
          mocsByStateAndDistrict[state] = {
            senators: [],
            districts: {}
          };
        }
        if (key.split('-').length === 1) {
          mocsByStateAndDistrict[key].senators =[data.senior.displayName, data.junior.displayName];
        } else if (key.split('-')[1] === '00'){
          mocsByStateAndDistrict[state].districts.atLarge = data.displayName;
        } else {
          var district = Number(key.split('-')[1]);
          mocsByStateAndDistrict[state]['districts'][district] = data;
        }
      });
      return mocsByStateAndDistrict;
    });
  };
  // writes to townhall, can take a key for update
  MfolEvent.prototype.submit = function () {
    var newEvent = this;
    return firebasedb.ref('/mofl_townhall_submissions/').push(newEvent);
  };

  // DATA PROCESSING BEFORE WRITE
  // gets time zone with location and date
  MfolEvent.validateZone = function (newEvent) {

    var time = Date.parse(newEvent.yearMonthDay + ' ' + newEvent.time) / 1000;
    var loc = newEvent.lat + ',' + newEvent.lng;
    return new Promise(function (resolve, reject) {
      var url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + time + '&key=AIzaSyB868a1cMyPOQyzKoUrzbw894xeoUhx9MM';
      $.get(url, function (response) {
        if (!response.timeZoneName) {
          reject('no timezone results');
        } else {
          newEvent.zoneString = response.timeZoneId;
          var timezoneAb = response.timeZoneName.split(' ');
          newEvent.timeZone = timezoneAb.reduce(function (acc, cur) {
            acc = acc + cur[0];
            return acc;
          }, '');
          resolve(newEvent);
        }
      }).fail(function(){
      });
    });
  };

  MfolEvent.prototype.isInFuture = function () {
    this.dateObj = new Date(this.Date);
    var now = Date.now();
    if (now - this.dateObj < 0) {
      return true;
    }
  };

  MfolEvent.getLatandLog = function (address) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB868a1cMyPOQyzKoUrzbw894xeoUhx9MM',
        data: {
          'address': address
        },
        dataType: 'json',
        success: function (r) {
          if (r.results[0]) {
            var currentEvent = {};
            currentEvent.lat = r.results[0].geometry.location.lat;
            currentEvent.lng = r.results[0].geometry.location.lng;
            currentEvent.address = r.results[0].formatted_address.split(', USA')[0];
            var addresskey = address.replace(/\W/g, '');
            addresskey.trim();
            resolve(currentEvent);
          } else {
            reject('error geocoding');
          }
        },
        error: function () {
        }
      });
    });
  };

  module.MfolEvent = MfolEvent;
})(window);
