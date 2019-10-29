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