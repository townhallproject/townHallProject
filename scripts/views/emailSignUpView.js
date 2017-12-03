(function(module) {

  var emailHandler = {};

  var zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
  var emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  // submit email signup
  function submitSignup(first, last, zipcode, email, districts, partner) {
    var person = {
      'person' : {
        'family_name': last.val(),
        'given_name': first.val(),
        'postal_addresses': [{ 'postal_code' : zipcode}],
        'email_addresses' : [{ 'address' : email.val() }],
        'custom_fields': {
          'districts': districts,
          'partner': partner.prop('checked')
        }
      }
    };
    var userID = email.val().split('').reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    $.ajax({
      url: 'https://actionnetwork.org/api/v2/forms/eafd3b2a-8c6b-42da-bec8-962da91b128c/submissions',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(person),
      success: function() {
        localStorage.setItem('signedUp', true);
        $('#email-signup').fadeOut(750);
      },
      error: function(error) {
        console.log('error', error);
        $('#email-signup-form button').before('<span class="error">An error has occured, please try again later.</span>');
      }
    });
    return false;
  }

  // validate email signup
  emailHandler.validateSignup = function(e) {
    e.preventDefault();
    var first = $('#email-signup-form input[name=first]');
    var last = $('#email-signup-form input[name=last]');
    var email = $('#email-signup-form input[name=email]');
    var zipcode = $('#email-signup-form input[name=zipcode]');
    var partner = $('#email-signup-form input[name=partner]');
    var districts = $('#email-signup-form input[name=districts]');
    var errors = 0;

    [first, email, zipcode].forEach(function(field) {
      var name = field[0].name;
      if (field[0].value.length === 0) {
        field.addClass('has-error');
        errors++;
      } else if ((name === 'email' && !emailRegEx.test(field[0].value)) ||
        (name === 'zipcode' && !zipcodeRegEx.test(field[0].value))) {
        field.addClass('has-error');
        errors++;
      } else {
        field.removeClass('has-error');
      }
    });

    if (errors !== 0) {
      return;
    }

    var zipClean = zipcode.val().split('-')[0];
    var districtArray;
    if (districts[0].value.length === 0) {
      TownHall.lookupZip(zipClean)
        .then(function(zipToDistricts){
          submitSignup(first, last, zipClean, email, zipToDistricts, partner);
        });
    } else {
      districtArray = JSON.parse($('#email-signup-form input[name=districts]').val());
      districtArray =[];
      submitSignup(first, last, zipClean, email, districtArray, partner);
    }
  };

  module.emailHandler = emailHandler;

})(window);
