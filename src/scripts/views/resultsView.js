const resultsView = {};

resultsView.render = function () {
  $('#nearest').empty();
  $('#awards-banner').hide();
  // TODO:
  // Figure out how to update so that email-signup changes (now in component)
  // $('#email-signup-form input[name=zipcode]').addClass('hidden');
  // $('#email-signup-form #district-subscribe').removeClass('hidden');

  $('.bootstrap-tagsinput').addClass('col-sm-8');
  $('#missing-member-banner').hide();
};

export default resultsView;

