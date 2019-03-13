/*globals Rsvp */
(function(module) {

  var rsvpHandler = {};

  var zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
  var emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  // submit email signup
  function submitSignup(opts) {
    var newRsvp = new Rsvp(opts);
    if (newRsvp) {
      newRsvp.writeToFirebase();
    }
  }
  
  rsvpHandler.clearDistricts = function(){
    $('#rsvp-form input[name=districts]').tagsinput('removeAll');
  };
  rsvpHandler.addDistrict = function(district) {
    $('#rsvp-form input[name=districts]').tagsinput('add', district);
  };

  rsvpHandler.setDistricts = function (districts) {
    districts.forEach(function(district){
      rsvpHandler.addDistrict(district);
    });
  };
  // validate email signup
  rsvpHandler.validateSignup = function(e) {
    e.preventDefault();
    var eventId = $('#rsvp-form input[name=eventId]');
    var given_name = $('#rsvp-form input[name=first]');
    var family_name = $('#rsvp-form input[name=last]');
    var email_address = $('#rsvp-form input[name=email]');
    var postal_code = $('#rsvp-form input[name=zipcode]');
    var phone_number = $('#rsvp-form input[name=phone]');
    var can_contact = {
      can_email: $('#rsvp-form input[name=can_email]').prop('checked') || false,
      partner: $('#rsvp-form input[name=partner]').prop('checked') || false,
      can_text: $('#rsvp-form input[name=can_text]').prop('checked') || false,
    }
    var errors = 0;

    [given_name, email_address, postal_code].forEach(function (field) {
      var name = field[0].name;
      if (field[0].value.length === 0 && !$(field[0]).hasClass('hidden')) {
        field.addClass('has-error');
        errors++;
      } else if ((name === 'email' && !emailRegEx.test(field[0].value))) {
        field.addClass('has-error');
        errors++;
      } else if (name === 'zipcode' && field[0].value.length > 0 && !zipcodeRegEx.test(field[0].value)) {
        field.addClass('has-error');
        errors++;
      } else {
        field.removeClass('has-error');
      }
    });
    if (errors !== 0) {
      return;
    }
    var opts = {
      eventId: eventId.val(),
      given_name: given_name.val(),
      family_name: family_name.val(),
      email_address: email_address.val(),
      postal_code: postal_code.val(),
      phone_number: phone_number.val(),
      can_contact: can_contact,
    }
    
    submitSignup(opts);
    
  };


  module.rsvpHandler = rsvpHandler;

})(window);
