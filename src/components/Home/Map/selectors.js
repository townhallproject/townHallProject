import {
    uniqBy
} from 'lodash';
import mapHelperFunctions from '../../../scripts/lib/map-helper-functions';
import mapView from '../../../scripts/views/mapView';


export const checkIfOnlySenate = function (selectedData) {
    var justSenate = true;
    var numOfDistrictEvents = 0;
    if (selectedData.length === 0) {
        justSenate = false;
    }
    selectedData.forEach(function (ele) {
        if (ele.district) {
            numOfDistrictEvents++;
            justSenate = false;
        }
    });
    return [justSenate, numOfDistrictEvents];
};

export const whereToZoomMap = function (selectedData, state, districts, additionalDistricts) {
    const justSenate = checkIfOnlySenate(selectedData);
    var bb;
    if (justSenate && !additionalDistricts) {
        bb = mapHelperFunctions.getBoundingBox(state);
    } else if (!additionalDistricts) {
        bb = mapHelperFunctions.getBoundingBox(state, districts);
    } else {
        bb = mapHelperFunctions.getBoundingBox(state, districts, additionalDistricts)
    }
    mapView.zoomLocation = bb;
    mapView.focusMap(bb);
};


export const getZoomLocationForMap = (locationData, selectedData) => {
  let newDistricts;
  let state;
  let districts
  if (locationData.displayName) {
    newDistricts = uniqBy(selectedData.map(townHall => {
      return {
        state: townHall.state,
        district: townHall.district || null,
        chamber: townHall.chamber,
        level: townHall.level
      }
    }), ele => `${ele.state}-${ele.district}`)
  }
  if (locationData.federal) {
    state = locationData.federal.state;
    districts = locationData.federal.districts;
    whereToZoomMap(selectedData, state, districts, newDistricts);
  }
};