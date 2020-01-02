import bboxes from '../../data/bboxes';

const mapHelperFunctions = {};

mapHelperFunctions.zeroPad = function zeroPad(districtID) {
  if (districtID.length === 3) {
    if (districtID.substring(0, 1) !== '0') {
      return districtID;
    } else {
      return districtID.substring(1, districtID.length);
    }
  }
  var padding = '00';
  return padding.substring(0, padding.length - districtID.length) + districtID;
};

// puts tele town halls by House members in the district.
mapHelperFunctions.teleTownHallMarker = function (townhall, state) {
  var key = townhall.district ? townhall.state + townhall.district : state;
  var bb = bboxes[key];
  if (!bb) {
    return townhall;
  }
  townhall.lng = (bb[2] - bb[0]) / 2 + bb[0];
  townhall.lat = (bb[3] - bb[1]) / 2 + bb[1];
  return townhall;
};

function addTwoBoundingBoxes(bb1, bb2) {
  if (!bb2) {
    return bb1;
  }
  let newBB = [0, 0, 0, 0];
    newBB[0] = Math.min(bb1[0], bb2[0]);
    newBB[2] = Math.min(bb1[2], bb2[2]);
    newBB[1] = Math.max(bb1[1], bb2[1]);
    newBB[3] = Math.max(bb1[3], bb2[3]);
  return newBB;
}

function masterBoundingBox(stateAbbr, districtCodes) {
  var masterBB = [0, 0, 0, 0];
  districtCodes.forEach(function (district) {
    var newBB = bboxes[stateAbbr + district];
    masterBB[0] = Math.min(masterBB[0], newBB[0]);
    masterBB[2] = Math.min(masterBB[2], newBB[2]);
    masterBB[1] = Math.max(masterBB[1], newBB[1]);
    masterBB[3] = Math.max(masterBB[3], newBB[3]);
  });
  return masterBB;
}

mapHelperFunctions.getBoundingBox = function (stateAbbr, districtCodes, additionalDistricts) {
  var statekey = stateAbbr,
    bb = bboxes[stateAbbr];
  if (additionalDistricts) {
    console.log('has addtional districts')
    const additionalBB = additionalDistricts.map(locationData => {
      if (locationData.district) {
        return masterBoundingBox(locationData.state, [locationData.district])
      }
      return bboxes[locationData.state]
    }).reduce((acc, cur) => {
      
      acc = addTwoBoundingBoxes(acc, cur);
      return acc;
    }, [0,0,0,0])
    console.log(bb, additionalBB, addTwoBoundingBoxes(bb, additionalBB))
    return addTwoBoundingBoxes(bb, additionalBB);
  } else if (districtCodes && districtCodes.length === 1) {
    statekey = statekey + districtCodes[0];
    return bboxes[statekey];
  } else if (districtCodes && districtCodes.length > 1) {
    return masterBoundingBox(stateAbbr, districtCodes);
  }
  return bb;
};

export default mapHelperFunctions;
