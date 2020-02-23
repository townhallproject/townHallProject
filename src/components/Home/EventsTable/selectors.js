


// Takes an array of TownHalls and sorts by sortOn field
const sortFunction = (a, b) => {
    if (a[TownHall.sortOn] && b[TownHall.sortOn]) {
        if (parseInt(b[TownHall.sortOn])) {
            return a[TownHall.sortOn] - b[TownHall.sortOn];
        } else {
            return a[TownHall.sortOn].toLowerCase().localeCompare(b[TownHall.sortOn].toLowerCase());
        }
    }
};

const makeSortFunction = (sortOn) => {
    return (a, b) => {
        if (a[sortOn] && b[sortOn]) {
            if (parseInt(b[sortOn])) {
                return a[sortOn] - b[sortOn];
            } else {
                return a[sortOn].toLowerCase().localeCompare(b[sortOn].toLowerCase());
            }
        }
    };
}
export const getFilteredEvents = (allEvents, filters, sortOn) => {
        // Itterate through all active filters and pull out any townhalls that match them
        // At least one attribute from within each filter group must match
        return Object.keys(filters).reduce(function (acc, key) {
            return acc.filter(function (townhall) {
                // Currently some of the data is inconsistent.  Some parties are listed as "Democrat" and some are listed as "Democratic", etc
                // TODO:  Once data is sanatized use return TownHall.filters[key].indexOf(townhall[key]) !== -1;
                return filters[key].some(function (filter) {
                    if (key === 'party') {
                        filter = filter.slice(0, 1);
                    }
                    if (!townhall[key]) {
                        return;
                    }
                    return filter === townhall[key].slice(0, filter.length);
                });
            });
        }, allEvents).sort(makeSortFunction(sortOn));

}