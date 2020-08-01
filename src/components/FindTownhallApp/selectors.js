
export const getTownhallsThatMatchDisplayName = (displayName, allTownHalls) => {
    return allTownHalls.filter(townHall => {
        return townHall.displayName.toLowerCase() === displayName.toLowerCase();
    })
}

// Match the looked up zip code to district #
export const matchSelectionToZip = (state, districts, allTownHalls) => {
    var fetchedData = [];

    fetchedData = allTownHalls.filter(function (townhall) {
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

export const matchSelectionToZipStateEvents = (state, districts, chamber, townHalls) => {
    return townHalls.reduce(function (acc, townhall) {
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

export const getEventsToDisplay = function (locationData, allTownHalls, stateTownHalls) {
    let selectedData = [];
    let federalEvents = [];
    if (!locationData) {
        return selectedData;
    }
    if (locationData.displayName) {
        const matchingTownHalls = getTownhallsThatMatchDisplayName(locationData.displayName, allTownHalls);
        selectedData = [...selectedData, ...matchingTownHalls];
    }
    if (locationData.federal) {
        const state = locationData.federal.state;
        const districts = locationData.federal.districts;
        federalEvents = matchSelectionToZip(state, districts, allTownHalls);
        selectedData = [...selectedData, ...federalEvents];
    }
    if (locationData.upper) {

        const upperDistricts = locationData.upper.districts;
        const upperEvents = matchSelectionToZipStateEvents(null, upperDistricts, 'upper', stateTownHalls);
        selectedData = selectedData.concat(upperEvents);
    }
    if (locationData.lower) {

        const lowerDistricts = locationData.lower.districts;
        const lowerEvents = matchSelectionToZipStateEvents(null, lowerDistricts, 'lower', stateTownHalls);
        selectedData = selectedData.concat(lowerEvents);
    }

    return selectedData;

};