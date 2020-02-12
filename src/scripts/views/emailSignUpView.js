import $ from 'jquery';

import '../../vendor/scripts/bootstrap-tagsinput.js';

import TownHall from '../models/TownHall';

const emailHandler = {};

const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

// submit email signup
function submitSignup(first, last, zipcode, email, districts, partner) {
  let person = {
    'person': {
      'family_name': last.val(),
      'given_name': first.val(),
      'postal_addresses': [{ 'postal_code': zipcode }],
      'email_addresses': [{ 'address': email.val() }],
      'custom_fields': {
        'districts': districts,
        'partner': partner.prop('checked')
      }
    }
  };
  // var userID = email.val().split('').reduce(function(a, b) {
  //   a = ((a << 5) - a) + b.charCodeAt(0);
  //   return a & a;
  // }, 0);
  $.ajax({
    url: 'https://actionnetwork.org/api/v2/forms/eafd3b2a-8c6b-42da-bec8-962da91b128c/submissions',
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(person),
    success: function () {
      localStorage.setItem('signedUp', true);
      emailHandler.closeEmailForm();
    },
    error: function () {
      $('#email-signup-form button').before('<span class="error">An error has occured, please try again later.</span>');
    }
  });
  return false;
}

emailHandler.clearDistricts = function () {
  $('#email-signup-form input[name=districts]').tagsinput('removeAll');
};
emailHandler.addDistrict = function (district) {
  $('#email-signup-form input[name=districts]').tagsinput('add', district);
};

emailHandler.setDistricts = function (districts) {
  districts.forEach(function (district) {
    emailHandler.addDistrict(district);
  });
};
// validate email signup
emailHandler.validateSignup = function (e) {
  e.preventDefault();
  let first = $('#email-signup-form input[name=first]');
  let last = $('#email-signup-form input[name=last]');
  let email = $('#email-signup-form input[name=email]');
  let zipcode = $('#email-signup-form input[name=zipcode]');
  let partner = $('#email-signup-form input[name=partner]');
  let districts = $('#email-signup-form input[name=districts]').tagsinput('items');
  let errors = 0;

  [first, email, zipcode].forEach(function (field) {
    let name = field[0].name;
    if (field[0].value.length === 0 && !$(field[0]).hasClass('hidden')) {
      field.addClass('has-error');
      errors++;
    } else if ((name === 'email' && !emailRegEx.test(field[0].value))) {
      field.addClass('has-error');
      errors++;
    } else if (name === 'zipcode' && !zipcode.hasClass('hidden') && !zipcodeRegEx.test(field[0].value)) {
      field.addClass('has-error');
      errors++;
    } else {
      field.removeClass('has-error');
    }
  });
  if (errors !== 0) {
    return;
  }

  let zipClean = zipcode.val().split('-')[0];
  if (districts.length === 0) {
    TownHall.lookupZip(zipClean)
      .then(function (zipToDistricts) {
        let districts = zipToDistricts.map(function (ele) {
          return ele.abr + '-' + ele.dis;
        });
        submitSignup(first, last, zipClean, email, districts, partner);
      });
  } else {

    submitSignup(first, last, zipClean, email, districts, partner);
  }
};

emailHandler.openEmailForm = function () {
  $('#email-signup').fadeIn(750);
  $('#email-update').hide();
};

emailHandler.closeEmailForm = function () {
  $('#email-signup').fadeOut(750);
  $('#email-update').removeClass('hidden').fadeIn(750);
  $('#thank-you-message').removeClass('hidden').fadeIn(750);
};

emailHandler.hideEmailForm = function () {
  $('#email-signup').hide();
  $('#email-update').removeClass('hidden').show();
};

export default emailHandler;

