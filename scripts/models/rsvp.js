/*globals $ firebasedb */
(function (module) {

  function Rsvp(opts) {
    this.family_name = opts.family_name;
    this.given_name = opts.given_name;
    this.postal_code = opts.postal_code || '';
    this.email_address = opts.email_address;
    this.eventId = opts.eventId;
    this.phone_number = opts.phone_number || '';
    this.can_contact = opts.can_contact;
  }

  Rsvp.prototype.writeToFirebase = function() {
    if (this.family_name && this.given_name && this.email_address && this.eventId) {
      firebasedb.ref('rsvps/' + this.eventId).push(this)
        .then(function(){
          $('#rsvp-form').addClass('hidden');
        });
    }
  };

  module.Rsvp = Rsvp;
})(window);