(function(module) {
  function TownHall (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
  }
  //Global data state
  TownHall.allTownHalls = [];
  TownHall.allMoCs = [];
  TownHall.allStates = [];
  TownHall.currentContext = [];
  TownHall.filters = {};
  TownHall.sortOn = 'State';
  TownHall.filteredResults = [];
  TownHall.isCurrentContext = false;
  TownHall.isMap = false;
  TownHall.zipQuery;
  TownHall.allStateTownHalls = [];

  // Lookup dictionaries
  TownHall.timeZones = {
    PST : 'America/Los_Angeles',
    MST : 'America/Denver',
    CST : 'America/Chicago',
    EST : 'America/New_York',
    other : 'no time zone'
  };

  TownHall.saveZipLookup = function (zip) {
    firebasedb.ref('/zipZeroResults/' + zip).once('value').then(function(snapshot){
      var newVal;
      if (snapshot.exists()) {
        newVal = snapshot.val() + 1;
      }
      else {
        newVal = 1;
      }
      return firebasedb.ref('/zipZeroResults/' + zip).set(newVal);
    });
  };

  // for state leg: HD-01 (North Caroline House District 1)
  // for federal: NC-6
  TownHall.prototype.makeDisplayDistrict = function (){
    if (this.level === 'state'){
      //state leg or statewide office
      var title;
      if (this.district) {
        //state leg
        //"VA HD-08" (Virginia House District 8)
        var chamber = this.district.split('-')[0];
        var number = this.district.split('-')[1];
        var sentence = [this.district, '(' + this.stateName, constants[chamber], parseInt(number) + ')'];
        this.displayDistrict = sentence.join(' ');
      } else {
        //statewide office, ie Governor
        var office = this.thp_id.split('-')[1];
        title = constants[office];
        this.displayDistrict = title;
      }
    } else {
      var state = this.state ? this.state : this.stateAbbr;
      if (this.district && parseInt(this.district)) {
        //House
        this.displayDistrict = state + '-' + parseInt(this.district);
      } else if (this.chamber === 'upper'){
        //Senator
        this.displayDistrict = state + ', ' + 'Senate';
      } else if (this.chamber === 'statewide' && this.office){
        this.displayDistrict = this.office.toUpperCase() + ' ' + state;
      } else {
        this.displayDistrict = state;
      }
      if (this.meetingType === 'Campaign Town Hall') {
        if (this.chamber === 'nationwide'){
          this.displayDistrict = '';
        } else {
          this.displayDistrict = 'Running for: ' + this.displayDistrict;
        }
      }
    }
  };

  TownHall.prototype.getIsPledger = function () {
    var townhall = this;
    townhall.isPledger = false;
    var townHallMember = this.displayName;
    if (townhall.state && townhall.displayName) {

      return firebasedb.ref('town_hall_pledges/' + townhall.state)
        .once('value')
        .then(function(snapshot) {
          snapshot.forEach(function(personData){
            var person = personData.val();
            if (person.displayName === townHallMember && person.pledged) {
              townhall.isPledger = true;
              return townhall;

            } 
          });
          return Promise.resolve(townhall);

        });
    }
    return Promise.resolve(townhall);
  };

  // 
  TownHall.prototype.makeFormattedMember = function () {
    var sentence;
    var icon = this.iconFlag ? this.iconFlag : this.icon;
    var prefix = '';
    if ((this.chamber) && (icon) && (icon !== 'campaign')) {
      prefix = constants[this.chamber];
    }
    if (this.meetingType === 'Empty Chair Town Hall') {
      sentence = [prefix, this.Member, '(invited)'];
      this.formattedMember = sentence.join(' ');
    } else {
      sentence = [prefix, this.Member];
      this.formattedMember = sentence.join(' ');
    }
  };

  TownHall.prototype.isInFuture = function (){
    this.dateObj = new Date(this.Date);
    var now = new Date();
    if (now - this.dateObj < 0) {
      return true;
    }
  };

  //Handlebars write
  TownHall.prototype.toHtml= function(templateid){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    return renderTemplate(this);
  };

  // Takes an array of TownHalls and sorts by sortOn field
  TownHall.sortFunction = function(a, b) {
    if (a[TownHall.sortOn] && b[TownHall.sortOn]) {
      if (parseInt(b[TownHall.sortOn])) {
        return a[TownHall.sortOn] - b[TownHall.sortOn];
      }
      else {
        return a[TownHall.sortOn].toLowerCase().localeCompare(b[TownHall.sortOn].toLowerCase());
      }
    }
  };

  TownHall.getFilteredResults = function(data) {
    // Itterate through all active filters and pull out any townhalls that match them
    // At least one attribute from within each filter group must match
    return TownHall.filteredResults = Object.keys(TownHall.filters).reduce(function(filteredData, key) {
      return filteredData.filter(function(townhall) {
        // Currently some of the data is inconsistent.  Some parties are listed as "Democrat" and some are listed as "Democratic", etc
        // TODO:  Once data is sanatized use return TownHall.filters[key].indexOf(townhall[key]) !== -1;
        return TownHall.filters[key].some(function(filter) {
          if (key === 'party') {
            filter = filter.slice(0, 1);
          }
          if (!townhall[key]) {
            return;
          }
          return filter.slice(0, 8) === townhall[key].slice(0, 8);
        });
      });
    }, data).sort(TownHall.sortFunction);
  };

  // METHODS IN RESPONSE TO lookup
  // Converts zip to lat lng google obj
  TownHall.lookupZip = function (zip, path) {
    var lookupPath = path || '/zipToDistrict/';
    return new Promise(function (resolve, reject) {
      firebasedb.ref(lookupPath + zip).once('value').then(function(snapshot) {
        if (snapshot.exists()) {
          var districts = [];
          snapshot.forEach(function(ele){
            districts.push(ele.val());
          });

          resolve(districts);
        } else {
          reject ('That zip code is not in our database, if you think this is an error please email us.');
        }
      });
    });
  };

  TownHall.resetData = function() {
    TownHall.isCurrentContext = false;
    TownHall.currentContext = [];
    TownHall.zipQuery = '';
  };

  TownHall.getZipLatLng = function (zip) {
    return new Promise(function (resolve, reject) {
      firebasedb.ref('/zips/' + zip).once('value').then(function(snapshot) {
        if (snapshot.exists()) {
          var zipQueryLoc = {};
          zipQueryLoc.lat = snapshot.val().LAT;
          zipQueryLoc.lng = snapshot.val().LNG;
          resolve(zipQueryLoc);
        } else {
          reject ('That is not a real zip code');
        }
      });
    });
  };

  TownHall.lookupReps = function (key, value) {
    return _lookupRepIds(key, value).then(function(govtrack_ids) {
      return _lookupRepObjs(govtrack_ids);
    });
  };

  function _lookupRepObjs(reps) {
    var MoCPromiseArray = reps.map(function (rep) {
      return firebasedb.ref('mocData/' + rep.govtrackId).once('value').then(function (snapshot) {
        var data = snapshot.val();
        data.dyjd = rep.dyjd;
        return data;
      });
    });
    return Promise.all(MoCPromiseArray).then(function(MoCs) {
      return MoCs;
    });
  }

  function _lookupRepIds(key, value) {
    if (key === 'state') {
      return firebasedb.ref('/mocByStateDistrict/' + value).once('value').then(function(snapshot) {
        return [snapshot.val().junior.govtrack_id, snapshot.val().senior.govtrack_id];
      })
      .then(function (govtrackArray) {
        return firebasedb.ref('do_your_job_districts/' + value + '-junior').once('value')
          .then(function (snapshot) {
            var junior = {
              dyjd: snapshot.exists() ? snapshot.val() : false,
              govtrackId: govtrackArray[0]
            };
            var senior = {
              dyjd: false,
              govtrackId: govtrackArray[1]
            };
            return [junior, senior];
          });
      })
    } else if (key === 'zip') {
      return firebasedb.ref('/zipToDistrict/' + value).once('value').then(function(snapshot) {
        var districts = snapshot.val();

        // Get all the district promises together
        var districtLookups = [];
        Object.keys(districts).forEach(function(key, index) {
          var obj = districts[key];
          if (index === 0) {
            districtLookups.push(
              firebasedb.ref('/mocByStateDistrict/' + obj.abr).once('value')
              .then(function(snapshot) {
                return [snapshot.val().junior.govtrack_id, snapshot.val().senior.govtrack_id];
              })
              .then(function(govtrackArray) {
                return firebasedb.ref('do_your_job_districts/' + obj.abr + '-junior').once('value')
                .then(function(snapshot){
                  var junior =  {
                    dyjd: snapshot.exists() ? snapshot.val() : false,
                    govtrackId: govtrackArray[0]
                  };
                  var senior = {
                    dyjd: false,
                    govtrackId: govtrackArray[1]
                  };
                  return [junior, senior];
                });
              })
            );
          }
          districtLookups.push(
            firebasedb.ref('/mocByStateDistrict/' + obj.abr + '-' + (obj.dis === '0' ? '00' : obj.dis)).once('value').then(function(snapshot) {
              return snapshot.val().govtrack_id;
            })
            .then(function (govtrackId) {
              return firebasedb.ref('do_your_job_districts/' + path).once('value')
                .then(function (snapshot) {
                  return [{
                    dyjd: snapshot.exists() ? snapshot.val() : false,
                    govtrackId: govtrackId,
                  }];
                });
            })
          );
        });

        // Return all ids
        return Promise.all(districtLookups).then(function(values) {
          // Flatten results
          return [].concat.apply([], values);
        });
      });
    } else {
      var path = key + '-' + (value === '0' ? '00' : mapHelperFunctions.zeroPad(value));
      return firebasedb.ref('/mocByStateDistrict/' + path).once('value').then(function(snapshot) {
        return snapshot.val().govtrack_id;
      })
      .then(function(govtrackId){
        return firebasedb.ref('do_your_job_districts/' + path).once('value')
          .then(function(snapshot){
            return [{
              dyjd: snapshot.exists() ? snapshot.val() : false,
              govtrackId: govtrackId,
            }];
          });
      });
    }
  }

  // given a zip, returns sorted array of events
  TownHall.returnNearest = function (zipQueryLoc) {
    var locations = [];
    return firebasedb.ref('/townHalls').once('value').then(function(snapshot) {
      snapshot.forEach(function(ele){
        if (ele.val().meetingType !== 'DC Event' && ele.val().meetingType !== 'Coffee') {
          locations.push(new TownHall(ele.val()));
        }
      });
      var sorted = locations.sort(function (a , b) {
        a.dist = google.maps.geometry.spherical.computeDistanceBetween(zipQueryLoc, new google.maps.LatLng(a.lat,a.lng));
        b.dist = google.maps.geometry.spherical.computeDistanceBetween(zipQueryLoc, new google.maps.LatLng(b.lat,b.lng));
        return a.dist <= b.dist ? -1 : 1;
      });
      return sorted;
    });
  };

  TownHall.getStateEvents = function(state) {
    return firebasedb.ref('/state_townhalls/' + state + '/').once('value');
  };

  TownHall.matchSelectionToZipStateEvents = function(state, districts, chamber) {
    return TownHall.allStateTownHalls.reduce(function (acc, townhall) {
      if (townhall.chamber === 'statewide') {
        acc.push(townhall);
      } else {
        districts.forEach(function(district){
          var checkdistrict;
          if (chamber === 'upper') {
            checkdistrict = 'SD-' + district;
          } else if (chamber === 'lower') {
            checkdistrict = 'HD-' + district;
          }
          if (checkdistrict === townhall.district) {
            acc.push(townhall);
          }
        });
      }
      return acc;
    }, []);
  };

  // Match the looked up zip code to district #
  TownHall.matchSelectionToZip = function (state, districts) {
    var fetchedData = [];

    fetchedData = TownHall.allTownHalls.filter(function(townhall){
      return townhall.state === state && townhall.meetingType !== 'DC Event';
    }).reduce(function(acc, curtownhall){
      if (!curtownhall.district) {
        acc.push(curtownhall);
      } else {
        districts.forEach(function(d) {
          var districtMatcher = parseInt(d);
          var dataMatcher = parseInt(curtownhall.district);

          if (districtMatcher === dataMatcher) {
            acc.push(curtownhall);
          }
        });
      }
      return acc;
    },[]);
    return fetchedData;
  };

  TownHall.addFilter = function(filter, value) {
    if (!TownHall.filters.hasOwnProperty(filter)) {
      TownHall.filters[filter] = [value];
    } else {
      TownHall.filters[filter].push(value);
    }
  };

  TownHall.removeFilter = function(filter, value) {
    var index = TownHall.filters[filter].indexOf(value);
    if (index !== -1) {
      TownHall.filters[filter].splice(index, 1);
    }
    if (TownHall.filters[filter].length === 0) {
      delete TownHall.filters[filter];
    }
  };

  TownHall.removeFilterCategory = function(category) {
    delete TownHall.filters[category];
  };

  TownHall.resetFilters = function() {
    Object.keys(TownHall.filters).forEach(function(key) {
      delete TownHall.filters[key];
    });
  };

  TownHall.addFilterIndexes = function(townhall) {
    if (TownHall.allStates.indexOf(townhall.stateName) === -1) {
      TownHall.allStates.push(townhall.stateName);
    }
    if (TownHall.allMoCs.indexOf(townhall.Member) === -1) {
      TownHall.allMoCs.push(townhall.Member);
    }
  };

  module.TownHall = TownHall;
})(window);
