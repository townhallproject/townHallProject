(function(module) {

  var indexView = {};

  indexView.renderAwards = function() {
    $('#awards-banner').removeClass('hidden');
  };

  indexView.renderHeader = function() {
    $('#header-image').attr('src', location.origin + '/Images' + '/THP_logo_inverse.png');
  };

  indexView.hideAwards = function() {
    $('#awards-banner').addClass('hidden');
  };

  indexView.setStateDropdown = function() {
    $('.dropdown--stateSelection button.dropdown-toggle span.button-text').text('State Legislatures');
    $('.dropdown--stateSelection .stateNav-federal').hide();
  };

  // reset the home page to originial view
  indexView.resetHome = function () {
    $('#awards-banner').show();
    $('.header-small').hide();
    $('.header-large').fadeIn();
    $('#look-up input').val('');
    $('#missing-member-banner').show();
    $('#email-signup-form input[name=zipcode]').val('');
    $('#no-events').hide();
    $('#representativeCards section').empty();
    $('#representativeCards').hide();
    $('.form-text-results').removeClass('text-center');
    $('.header-with-results .results').removeClass('multipleResults');
    $('.left-panels').removeClass('left-panels-border');
    $('#email-title').text('Sign up to get updates about local events.');
    $('#button-to-form').hide();
    $('.spacer').show();
    $('#look-up').appendTo($('.right-panels'));
    tableHandler.resetTable();
    mapView.resetView();
    var $parent = $('#nearest');
    var $results = $('.selection-results_content');
    $parent.removeClass('nearest-with-results');
    $parent.empty();
    $results.empty();
    tableHandler.initialFilters();
    TownHall.sortOn = 'Date';
  };

  module.indexView = indexView;

})(window);
