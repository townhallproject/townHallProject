(function(module) {

  var resultsView = {};

  resultsView.render = function() {
    $('#nearest').empty();
    $('#awards-banner').hide();
    $('#email-signup').hide();
    $('#missing-member-banner').hide();
  };

  module.resultsView = resultsView;

})(window);
