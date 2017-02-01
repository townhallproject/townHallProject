(function(module) {
  var firebasedb = firebase.database()

  var eventHandler = {};
  eventHandler.save = function (e) {
    e.preventDefault();
    var newEvent = new Event( $('#save-event input').get().reduce(function(newObj, cur){
      newObj[cur.id] = $(cur).val();
      return newObj;
    }, {})
  );
    newEvent.getLatandLog( newEvent.address);
  };

  eventHandler.lookup = function (e) {
    e.preventDefault();
    Event.lookupZip($('#look-up input').val())
  }
  eventHandler.render = function (data) {
    $('#nearest').text(data)
  }

  $('#save-event').on('submit', eventHandler.save);
  $('#look-up').on('submit', eventHandler.lookup);

  module.eventHandler = eventHandler;
})(window);
