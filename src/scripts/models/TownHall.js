import { firebasedb } from '../lib/firebasedb';
import constants from '../lib/constants';

class TownHall {
    static allTownHalls = [];
    static allMoCs = [];
    static currentContext = [];
    static allStates = [];
    static filters = {};
    static sortOn = 'State';
    static filteredResults = [];
    static isCurrentContext = false;
    static isMap = false;
    static zipQuery;
    static allStateTownHalls = [];
    static timeZones = {
      PST: 'America/Los_Angeles',
      MST: 'America/Denver',
      CST: 'America/Chicago',
      EST: 'America/New_York',
      other: 'no time zone'
    }

  constructor(opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
  
  }

  isInFuture() {
    this.dateObj = new Date(this.Date);
    var now = new Date();
    if (now - this.dateObj < 0) {
      return true;
    }
  }

  makeFormattedMember() {
    var sentence;
    var icon = this.iconFlag ? this.iconFlag : this.icon;
    var prefix = '';
    if ((this.chamber) && (icon) && (icon !== 'campaign')) {
      prefix = constants[this.chamber];
    }
    if (this.meetingType === 'Empty Chair Town Hall') {
      sentence = [prefix, this.displayName, '(invited)'];
      this.formattedMember = sentence.join(' ');
    } else {
      sentence = [prefix, this.displayName];
      this.formattedMember = sentence.join(' ');
    }
  }

  // for state leg: HD-01 (North Caroline House District 1)
  // for federal: NC-6
  makeDisplayDistrict() {
    if (this.level === 'state') {
      //state leg or statewide office
      let title;
      if (this.district) {
        //state leg
        //"VA HD-08" (Virginia House District 8)
        const chamber = this.district.split('-')[0];
        const number = this.district.split('-')[1];
        const sentence = [this.district, '(' + this.stateName, constants[chamber], parseInt(number) + ')'];
        this.displayDistrict = sentence.join(' ');
      } else {
        //statewide office, ie Governor
        const office = this.thp_id.split('-')[1];
        title = constants[office];
        this.displayDistrict = title;
      }
    } else {
      const state = this.state ? this.state : this.stateAbbr;
      if (this.district && parseInt(this.district)) {
        //House
        this.displayDistrict = state + '-' + parseInt(this.district);
      } else if (this.chamber === 'upper') {
        //Senator
        this.displayDistrict = state + ', ' + 'Senate';
      } else if (this.chamber === 'statewide' && this.office) {
        this.displayDistrict = this.office.toUpperCase() + ' ' + state;
      } else {
        this.displayDistrict = state;
      }
      if (this.meetingType === 'Campaign Town Hall') {
        this.displayDistrict = 'Running for: ' + this.displayDistrict;
      }
    }
  };

  getIsPledger() {
    let townhall = this;
    townhall.isPledger = false;
    const townHallMember = this.displayName;
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
  
}

TownHall.saveZipLookup = (zip) => {
  firebasedb.ref('/zipZeroResults/' + zip).once('value').then(function (snapshot) {
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

// Takes an array of TownHalls and sorts by sortOn field
TownHall.sortFunction = (a, b) => {
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
        return filter === townhall[key].slice(0, filter.length);
      });
    });
  }, data).sort(TownHall.sortFunction);
};

// METHODS IN RESPONSE TO lookup
// Converts zip to lat lng google obj
TownHall.lookupZip = (zip, path) => {
  var lookupPath = path || '/zipToDistrict/';
  return new Promise(function (resolve, reject) {
    firebasedb.ref(lookupPath + zip).once('value').then(function (snapshot) {
      if (snapshot.exists()) {
        var districts = [];
        snapshot.forEach(function (ele) {
          districts.push(ele.val());
        });

        resolve(districts);
      } else {
        reject('That zip code is not in our database, if you think this is an error please email us.');
      }
    });
  });
};

TownHall.resetData = () => {
  TownHall.isCurrentContext = false;
  TownHall.currentContext = [];
  TownHall.zipQuery = '';
};

TownHall.getZipLatLng = (zip) => {
  return new Promise(function (resolve, reject) {
    firebasedb.ref('/zips/' + zip).once('value').then(function (snapshot) {
      if (snapshot.exists()) {
        var zipQueryLoc = {};
        zipQueryLoc.lat = snapshot.val().LAT;
        zipQueryLoc.lng = snapshot.val().LNG;
        resolve(zipQueryLoc);
      } else {
        reject('That is not a real zip code');
      }
    });
  });
};


TownHall.lookupReps = (key, value) => {
  return _lookupRepIds(key, value).then(function (govtrack_ids) {
    return _lookupRepObjs(govtrack_ids);
  });
};

function _lookupRepObjs(govtrack_ids) {
  let MoCPromiseArray = govtrack_ids.map(function (govtrack_id) {
    return firebasedb.ref('mocData/' + govtrack_id).once('value').then(function (snapshot) {
      return snapshot.val();
    });
  });
  return Promise.all(MoCPromiseArray).then(function (MoCs) {
    return MoCs;
  });
}

function _lookupRepIds(key, value) {
  if (key === 'state') {
    return firebasedb.ref('/mocByStateDistrict/' + value).once('value').then(function (snapshot) {
      return [snapshot.val().junior.govtrack_id, snapshot.val().senior.govtrack_id];
    });
  } else if (key === 'zip') {
    return firebasedb.ref('/zipToDistrict/' + value).once('value').then(function (snapshot) {
      let districts = snapshot.val();

      // Get all the district promises together
      let districtLookups = [];
      Object.keys(districts).forEach(function (key, index) {
        let obj = districts[key];
        if (index === 0) {
          districtLookups.push(
            firebasedb.ref('/mocByStateDistrict/' + obj.abr).once('value').then(function (snapshot) {
              return [snapshot.val().junior.govtrack_id, snapshot.val().senior.govtrack_id];
            })
          );
        }
        districtLookups.push(
          firebasedb.ref('/mocByStateDistrict/' + obj.abr + '-' + (obj.dis === '0' ? '00' : obj.dis)).once('value').then(function (snapshot) {
            return [snapshot.val().govtrack_id];
          })
        );
      });

      // Return all ids
      return Promise.all(districtLookups).then(function (values) {
        // Flatten results
        return [].concat.apply([], values);
      });
    });
  } else {
    var path = key + '-' + (value === '0' ? '00' : value);
    return firebasedb.ref('/mocByStateDistrict/' + path).once('value').then(function (snapshot) {
      return [snapshot.val().govtrack_id];
    });
  }
}

// given a zip, returns sorted array of events
TownHall.returnNearest = (zipQueryLoc) => {
  var locations = [];
  return firebasedb.ref('/townHalls').once('value').then(function (snapshot) {
    snapshot.forEach(function (ele) {
      if (ele.val().meetingType !== 'DC Event' && ele.val().meetingType !== 'Coffee') {
        locations.push(new TownHall(ele.val()));
      }
    });
    var sorted = locations.sort(function (a, b) {
      a.dist = google.maps.geometry.spherical.computeDistanceBetween(zipQueryLoc, new google.maps.LatLng(a.lat, a.lng));
      b.dist = google.maps.geometry.spherical.computeDistanceBetween(zipQueryLoc, new google.maps.LatLng(b.lat, b.lng));
      return a.dist <= b.dist ? -1 : 1;
    });
    return sorted;
  });
};

TownHall.getStateEvents = (state) => {
  return firebasedb.ref('/state_townhalls/' + state + '/').once('value');
};

TownHall.matchSelectionToZipStateEvents = (state, districts, chamber) => {
  return TownHall.allStateTownHalls.reduce(function (acc, townhall) {
    if (townhall.chamber === 'statewide') {
      acc.push(townhall);
    } else {
      districts.forEach(function (district) {
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
TownHall.matchSelectionToZip = (state, districts) => {
  var fetchedData = [];

  fetchedData = TownHall.allTownHalls.filter(function (townhall) {
    return townhall.state === state && townhall.meetingType !== 'DC Event';
  }).reduce(function (acc, curtownhall) {
    if (!districts) {
      acc.push(curtownhall);
    }
    if (!curtownhall.district) {
      acc.push(curtownhall);
    } else {
      districts.forEach(function (d) {
        var districtMatcher = parseInt(d);
        var dataMatcher = parseInt(curtownhall.district);

        if (districtMatcher === dataMatcher) {
          acc.push(curtownhall);
        }
      });
    }
    return acc;
  }, []);
  return fetchedData;
};

TownHall.addFilter = (filter, value) => {
  if (!TownHall.filters.hasOwnProperty(filter)) {
    TownHall.filters[filter] = [value];
  } else {
    TownHall.filters[filter].push(value);
  }
};

TownHall.removeFilter = (filter, value) => {
  var index = TownHall.filters[filter].indexOf(value);
  if (index !== -1) {
    TownHall.filters[filter].splice(index, 1);
  }
  if (TownHall.filters[filter].length === 0) {
    delete TownHall.filters[filter];
  }
};

TownHall.removeFilterCategory = (category) => {
  delete TownHall.filters[category];
};

TownHall.resetFilters = () => {

  Object.keys(TownHall.filters).forEach(key => {
    delete TownHall.filters[key];
  });
};

TownHall.addFilterIndexes = (townhall) => {
  if (TownHall.allStates.indexOf(townhall.stateName) === -1) {
    TownHall.allStates.push(townhall.stateName);
  }
  if (TownHall.allMoCs.indexOf(townhall.displayName) === -1) {
    TownHall.allMoCs.push(townhall.displayName);
  }
};

export default TownHall;
