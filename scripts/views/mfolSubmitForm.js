
(function (module) {
// For handling user submitted events.
/*global firebasedb MfolEvent moment  Handlebars regEx:true*/

  var newEventView = {};
  MfolEvent.currentEvent = {
    yearMonthDay: '2018-04-07',
    members: {}
  };
  MfolEvent.reps = {};

  newEventView.render = function () {
    var typeaheadConfig = {
      fitToElement: true,
      delay: 10,
      highlighter: function(item) { return item; }, // Kill ugly highlight
      filter: function(selection) {
        $('#state').val(selection);
      }
    };
    $('#state').typeahead('destroy');
    $('#state').typeahead($.extend({source: Object.keys(fips)}, typeaheadConfig));


    MfolEvent.getMocByStateAndDistrict().then(function(mocsByStateAndDistrict){
      newEventView.mocsByStateAndDistrict = mocsByStateAndDistrict;
    });
  };

  newEventView.generalCheckbox = function (event) {
    event.preventDefault();
    MfolEvent.currentEvent[this.id] = this.checked;
  };

  newEventView.membersCheckbox = function (event) {
    event.preventDefault();
    var input = $(this).parents('.input-group').find('.member-name');
    if (this.checked) {
      MfolEvent.currentEvent.members[this.id] = input.val();
    } else {
      MfolEvent.currentEvent.members[this.id] = null;
      delete MfolEvent.currentEvent.members[this.id];
    }
  };

  newEventView.geoCode = function ($input) {
    var $form = $($input).parents('form');
    var address = $form.find('#address').val();
    if (MfolEvent.currentEvent.lat && MfolEvent.currentEvent.lng) {
      delete MfolEvent.currentEvent.lat;
      delete MfolEvent.currentEvent.lng;
    }
    MfolEvent.getLatandLog(address).then(function (geotownHall) {
      var $feedback = $form.find('#location-form-group');
      $feedback.removeClass('has-error');
      $feedback.addClass('has-success');
      $form.find('#address').val(geotownHall.address);
      MfolEvent.currentEvent.lat = geotownHall.lat;
      MfolEvent.currentEvent.lng = geotownHall.lng;
      MfolEvent.currentEvent.address = geotownHall.address;
      /* eslint-env es6*/
      /* eslint quotes: ["error", "single", { "allowTemplateLiterals": true }]*/
      $form.find('#address-feedback').html('Location is valid, make sure the address is correct:<br>' + geotownHall.address);
    }).catch(function () {
      var $feedback = $form.find('#location-form-group');
      $feedback.addClass('has-error');
      $form.find('#locationCheck').val('Geocoding failed').addClass('has-error');
    });
  };

  newEventView.addressChanged = function () {
    var $input = $(this);
    var $form = $input.parents('form');
    if (this.id === 'address') {
      $form.find('#locationCheck').val('');
      newEventView.geoCode($input);
      $form.find('#location-form-group').removeClass('has-success');
      $form.find('#address-feedback').html('Enter a valid street address, if there isn\'t one, leave this blank');
    }
  };

  newEventView.districtEntered = function (value, $form) {
    var state = $form.find('#state').val();
    if (value && Number(value)) {
      $form.find('#chamber').val('lower');
      $form.find('#District').val(state + '-' + Number(value));
    } else if (value.split('-').length > 0){
      $form.find('#District').val(state + ' ' + value);
    } else {
      $form.find('#chamber').val('upper');
      $form.find('#District').val('Senate');
    }
  };

  newEventView.displayMembers = function(district) {
    if (newEventView.mocsByStateAndDistrict[MfolEvent.currentEvent.state]
      && newEventView.mocsByStateAndDistrict[MfolEvent.currentEvent.state]['districts'][district]
      ) {
      var rep = newEventView.mocsByStateAndDistrict[MfolEvent.currentEvent.state]['districts'][district];
      if (!MfolEvent.reps[rep]) {
        $('.invited-members').remove();
        var compiledTemplate = Handlebars.getTemplate('invitedMembers');
        $('#your-rep').append($(compiledTemplate(rep)));
        MfolEvent.reps[rep] = true;
      }
    }
  };

  newEventView.changeDistrict = function (event) {
    event.preventDefault();
    var $form = $(this).parents('form');
    var value = $(this).attr('data-value');
    $form.find('#district').val(value);
    $form.find('#district').change().addClass('has-success');
    MfolEvent.reps = {};
    if (value) {
      MfolEvent.currentEvent.chamber = 'lower';
    }
  };

  // New Event METHODS
  newEventView.validatePhoneNumber = function(phonenumber){
    var $phoneNumberError = $('#phoneNumber-error');
    regEx = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
    var testNumber = regEx.test(phonenumber);
    if (testNumber) {
      $phoneNumberError.addClass('hidden');
      $phoneNumberError.parent().removeClass('has-error');
      $phoneNumberError.parent().addClass('has-success');
      phonenumber = phonenumber.replace(/[^\d]/g, '');
      if (phonenumber.length === 10) {
        $('#phoneNumber').val(phonenumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'));
      }
      return null;
    } else {
      $phoneNumberError.removeClass('hidden');
      $phoneNumberError.parent().addClass('has-error');
      $phoneNumberError.parent().removeClass('has-success');
    }
  };

  newEventView.validateDateTime = function($curValue, format, id) {
    if (!moment($curValue, format).isValid()) {
      $('#' + id + '-error').removeClass('hidden');
      $('#' + id).parent().addClass('has-error');
      return false;
    } else {
      $('#' + id + '-error').addClass('hidden');
      $('#' + id).parent().removeClass('has-error');
      return true;
    }
  };

  newEventView.updatedNewMfolEventObject = function updatedNewMfolEventObject($form) {
    var updated = $form.find('.edited').get();
    var databaseTH = MfolEvent.currentEvent;
    var updates = updated.reduce(function (newObj, cur) {
      var $curValue = $(cur).val();
      var timeFormats = ['hh:mm A', 'h:mm A'];
      switch (cur.id) {
      case 'timeStart24':
        if (!newEventView.validateDateTime($curValue, timeFormats, 'timeStart24')){
          return;
        }
        newObj.timeStart24 = moment($curValue, timeFormats).format('HH:mm:ss');
        newObj.Time = moment($curValue, timeFormats).format('h:mm A');
        var tempEnd = moment($curValue, timeFormats).add(2, 'h');
        newObj.timeEnd24 = moment(tempEnd).format('HH:mm:ss');
        newObj.timeEnd = moment(tempEnd).format('h:mm A');
        break;
      case 'timeEnd24':
        if (!newEventView.validateDateTime($curValue, timeFormats, 'timeEnd24')){
          return;
        }
        newObj.timeEnd24 = moment($curValue, timeFormats).format('HH:mm:ss');
        newObj.timeEnd = moment($curValue, timeFormats).format('h:mm A');
        break;
      case 'yearMonthDay':
        var dateFormats = ['YYYY-MM-DD', 'MM/DD/YYYY', 'MM-DD-YYYY', 'MMMM D, YYYY'];
        if (!newEventView.validateDateTime($curValue, dateFormats, 'yearMonthDay')){
          return;
        }
        newObj[cur.id] = moment($curValue, dateFormats).format('YYYY-MM-DD');
        newObj.dateString = moment($curValue, dateFormats).format('ddd, MMM D YYYY');
        newObj.Date = moment($curValue, dateFormats).format('ddd, MMM D YYYY');
        break;
      case 'district':
        newEventView.districtEntered($curValue, $form);
        newObj[cur.id] = $curValue;
        break;
      default:
        newObj[cur.id] = $curValue;
      }
      return newObj;
    }, {});
    MfolEvent.currentEvent = Object.assign(databaseTH, updates);
  };

  newEventView.newformChanged = function () {
    var $input = $(this);
    var $form = $input.parents('form');
    if (this.id === 'phoneNumber') {
      newEventView.validatePhoneNumber($input.val());
    }
    if (this.id === 'district') {
      newEventView.displayMembers($input.val());
    }
    $input.addClass('edited');
    newEventView.updatedNewMfolEventObject($form);
  };

  newEventView.stateChanged = function(event){
    event.preventDefault();
    var state = $(this).val().toUpperCase();
    $(this).val(state);
    $('#district-dropdown-list').empty();
    if (newEventView.mocsByStateAndDistrict[state]) {
      var districts = Object.keys(newEventView.mocsByStateAndDistrict[state].districts);
      if (districts.length ===1) {
        districts = ['At large'];
      }
      var compiledTemplate = Handlebars.getTemplate('districtDropdown');
      $('#district-dropdown-list').append($(compiledTemplate({districts: districts})));
    }
  };

  newEventView.validateDateNew = function () {
    var newMfolEvent = MfolEvent.currentEvent;
    if (newMfolEvent.lat) {
      return MfolEvent.validateZone(newMfolEvent);
    } else {
      return Promise.resolve(newMfolEvent);
    }
  };

  newEventView.checkForFields = function () {
    var requiredFields = true;
    if (!Object.prototype.hasOwnProperty.call(MfolEvent.currentEvent, 'yearMonthDay')) {
      $('#yearMonthDay').parent().addClass('has-error');
      $('#yearMonthDay-error').removeClass('hidden');
      requiredFields = false;
    }
    if (!Object.prototype.hasOwnProperty.call(MfolEvent.currentEvent, 'timeStart24') && MfolEvent.currentEvent.meetingType !== 'Tele-Town Hall') {
      $('#timeStart24').parent().addClass('has-error');
      $('#timeStart24-error').removeClass('hidden');
      requiredFields = false;
    }
    return requiredFields;
  };

  newEventView.resetData = function () {
    $('#advanced-moc-options').addClass('hidden');
    $('.has-success').removeClass('has-success');
    $('.edited').removeClass('edited');
    $('.event-details').removeClass('hidden');
    $('.general-error').addClass('hidden');
    $('.has-error').removeClass('has-error');
    $('#list-of-current-pending').addClass('hidden');
    document.getElementById('new-event-form-element').reset();
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    //reset if last was no event
    $('.event-details').removeClass('hidden');
    $('.new-event-form').unbind('submit');
    $('.new-event-form').on('submit', 'form', newEventView.submitNewEvent);
    //reset globals
    MfolEvent.currentEvent = {
      yearMonthDay: '2018-04-07',
      members: {}
    };    //reset imputs
    $('.general-inputs').removeClass('hidden').show();
    $('.non-standard').addClass('hidden');
  };

  newEventView.submitNewEvent = function (event) {
    event.preventDefault();
    var $form = $(this);
    newEventView.updatedNewMfolEventObject($form);
    var newMfolEvent = MfolEvent.currentEvent;
    if (newEventView.checkForFields()) {
      newMfolEvent.lastUpdated = Date.now();
      newEventView.validateDateNew()
        .then(function(validatedDate){
          if (validatedDate) {
            var toSubmit = new MfolEvent(validatedDate);
            toSubmit.submit().then(function () {
              newEventView.resetData();
            }).catch(function(error){
              $('general-error').text('Please open your console (View>Developer>JavaScript console)and email meganrm@townhallproject.com a screenshot:', error).removeClass('hidden');
            });
          }
        })
        .catch(function(){
          var toSubmit = new MfolEvent(newMfolEvent);
          toSubmit.submit()
          .catch(function(error){
            $('general-error').text('Please open your console (View>Developer>JavaScript console)and email meganrm@townhallproject.com a screenshot:', error).removeClass('hidden');
          });
        });
    } else {
      $('html, body').animate({
        scrollTop: $('.has-error').offset().top
      }, 'slow');
    }
  };

  // event listeners for new form
  $('.new-event-form-mfol').on('change', '.form-control', newEventView.newformChanged);

  // $('.new-event-form-mfol').on('click', '.meeting a', newEventView.changeMeetingType);
  $('.new-event-form-mfol').on('click', '.district-group a', newEventView.changeDistrict);
  $('.new-event-form-mfol').on('change', '#state', newEventView.stateChanged);
  $('.new-event-form-mfol').on('change', '.member-checkbox', newEventView.membersCheckbox);
  $('.new-event-form-mfol').on('change', '.general-checkbox', newEventView.generalCheckbox);
  $('.new-event-form-mfol').on('change', '#address', newEventView.addressChanged);
  $('.new-event-form-mfol').on('submit', 'form', newEventView.submitNewEvent);




  module.newEventView = newEventView;
})(window);
