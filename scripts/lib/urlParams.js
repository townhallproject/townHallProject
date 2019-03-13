(function(module) {
  urlParamsHandler = {};

  urlParamsHandler.getUrlParamFromQuery = function (queryString, param) {
    var query = queryString.match(new RegExp('([?&])' + param + '[^&]*'));
    if (query) {
      return query[0].split('=')[1];
    }
    return false;
  };

  urlParamsHandler.getUrlParameter = function(param) {
    var query = document.location.search.match(new RegExp('([?&])' + param + '[^&]*'));
    if (query) {
      return query[0].split('=')[1];
    }
    return false;
  };

  urlParamsHandler.setUrlParameter = function(param, value) {
    // Get query params, and remove the matching param if it exists
    var search = document.location.search.replace(new RegExp('([?&])' + param + '[^&]*'),'');
    // If there are no query params then we need to add the ? back
    if (search.indexOf('?') === -1) {
      search += '?';
    } else {
      search += '&';
    }

    // Add the query param if we have a value
    if (value !== false) {
      search += param + '=' + value;
    } else {
      // Remove trailing ? or &
      search = search.slice(0, -1);
    }

    window.history.replaceState('', '', document.location.origin + document.location.pathname + search);
  };

  module.urlParamsHandler = urlParamsHandler;
})(window);
