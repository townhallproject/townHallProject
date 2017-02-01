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
    newEvent.getLatandLog(newEvent.address);
  };

  eventHandler.saveSimple = function (event) {
    var newEvent = new Event(event)
    newEvent.getLatandLog(newEvent.streetNumber + newEvent.streetName);
  };

  eventHandler.signIn = function (){
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  }


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    // User is signed in.
      console.log(user.displayName, ' is signed in');
    } else {
      eventHandler.signIn()
      // No user is signed in.
    }
  });

  eventHandler.lookup = function (e) {
    e.preventDefault();
    Event.lookupZip($('#look-up input').val())
  }

  eventHandler.render = function (events, num) {
    var $parent = $('#nearest')
    $parent.empty();
    recenterMap(events.slice(0,num));
    for (var i = 0; i < num; i++) {
      var $panel = $(events[i].toHtml($('#event-template')))
      if (events[i].Party === 'Democratic') {
        $panel.children('.panel').addClass('panel-dem');
        $panel.appendTo($parent);
      }
      else {
        $panel.children('.panel').addClass('panel-rep');
        $panel.appendTo($parent);
      }
    }
  }

  $('#save-event').on('submit', eventHandler.save);
  $('#look-up').on('submit', eventHandler.lookup);

  module.eventHandler = eventHandler;
})(window);
