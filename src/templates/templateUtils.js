import moment from 'moment';

export const json = function(context) {
  return JSON.stringify(context).replace(/"/g, '&quot;');
};

export const addressQuery = function(address) {
  return escape(address);
};

export const addressFormat = function(address) {
  var out = '';
  var items = address.split(',');
  out = out + items.splice(0, 1)[0] + '<br>';
  return out + items.join(', ');
};

export const dateFormat = function(lastUpdated) {
  return moment(lastUpdated).fromNow();
};

export const shortDateTime = function(townhall) {
  var localString = new Date(townhall.Date + ' ' + townhall.Time).toLocaleString();
  var shortDateTime = localString.slice(0, -6) + localString.slice(-2);
  return townhall.timeZone ? townhall.timeZone : null;
};

