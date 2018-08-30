(function(module) {

  var resultsView = {};

  resultsView.render = function() {
    $('#nearest').empty();
    $('#awards-banner').hide();
    $('#email-signup-form input[name=zipcode]').addClass('hidden');
    $('#email-signup-form #district-subscribe').removeClass('hidden');
    $('.bootstrap-tagsinput').addClass('col-sm-8');
    $('#missing-member-banner').hide();
  };

  module.resultsView = resultsView;

})(window);
