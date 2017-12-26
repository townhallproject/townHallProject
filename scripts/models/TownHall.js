(function(module) {
  function TownHall (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
    this.makeDisplayDistrict();
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
      if (snapshot.exists()) {
        newVal = snapshot.val() + 1;
      }
      else {
        newVal = 1;
      }
      return firebasedb.ref('/zipZeroResults/' + zip).set(newVal);
    });
  };

  TownHall.prototype.makeDisplayDistrict = function (){
    if (this.thp_id){
      //state leg or statewide office
      if (this.district) {
        //state leg
        var districtType = this.district.split('-')[0];
        var districtNo = this.district.split('-')[1];

        var title = constants[districtType];
        this.displayDistrict = title + ' ' + districtNo;
      } else {
        //statewide office, ie Governor
        var office = this.thp_id.split('-')[1];
        var title = constants[office];
        this.displayDistrict = title;
      }
    } else {
      if (this.district) {
        //House
        this.displayDistrict = this.state + '-' + parseInt(this.district);
      } else {
        //Senator
        this.displayDistrict = 'Senate';
      }
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
  TownHall.lookupZip = function (zip) {
    return new Promise(function (resolve, reject) {
      firebasedb.ref('/zipToDistrict/' + zip).once('value').then(function(snapshot) {
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

  function _lookupRepObjs(govtrack_ids) {
    var MoCPromiseArray = govtrack_ids.map(function(govtrack_id) {
      return firebasedb.ref('mocData/' + govtrack_id).once('value').then(function(snapshot) {
        return snapshot.val();
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
      });
    } else if (key === 'zip') {
      return firebasedb.ref('/zipToDistrict/' + value).once('value').then(function(snapshot) {
        var districts = snapshot.val();

        // Get all the district promises together
        var districtLookups = [];
        Object.keys(districts).forEach(function(key, index, array) {
          var obj = districts[key];
          if (index === 0) {
            districtLookups.push(
              firebasedb.ref('/mocByStateDistrict/' + obj.abr).once('value').then(function(snapshot) {
                return [snapshot.val().junior.govtrack_id, snapshot.val().senior.govtrack_id];
              })
            );
          }
          districtLookups.push(
            firebasedb.ref('/mocByStateDistrict/' + obj.abr + '-' + (obj.dis === '0' ? '00' : obj.dis)).once('value').then(function(snapshot) {
              return [snapshot.val().govtrack_id];
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
      var path = key + '-' + (value === '0' ? '00' : value);
      return firebasedb.ref('/mocByStateDistrict/' + path).once('value').then(function(snapshot) {
        return [snapshot.val().govtrack_id];
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
    if (TownHall.allStates.indexOf(townhall.State) === -1) {
      TownHall.allStates.push(townhall.State);
    }
    if (TownHall.allMoCs.indexOf(townhall.Member) === -1) {
      TownHall.allMoCs.push(townhall.Member);
    }
  };

  module.TownHall = TownHall;
})(window);
