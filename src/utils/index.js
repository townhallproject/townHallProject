import { find } from 'lodash';

import states from '../data/states';

export function makeStateDistrictText(stateDistricts, chamber) {
    var stateText = ' ';
    var mapping = {
        lower: 'HD',
        upper: 'SD',
    };
    stateDistricts.forEach(function (district) {
        if (district) {
            stateText = stateText + mapping[chamber] + '-' + district + ' ';
        }
    });
    return stateText;
}

export function isZipCode(query) {
    const zipCodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
    return query.match(zipCodeRegEx);
}

export function isState(query) {
    return find(states, (stateData) => stateData.USPS.toLowerCase().trim() === query.toLowerCase().trim() || stateData.Name.toLowerCase().trim() === query.toLowerCase().trim()
    )
}

export function isDistrict(query) {
    const districtRegEx = /([A-Z]){2}-(\d{2})/g;
    return query.match(districtRegEx);
}

export function isFederalDistrict(query) {
    const prefix = query.split('-')[0];
    return isState(prefix)
}

export function capitalizeName(name) {
      name = name.split(" ");

      for (let i = 0, x = name.length; i < x; i++) {
          name[i] = name[i][0].toUpperCase() + name[i].substr(1);
      }

      return name.join(" ");
}