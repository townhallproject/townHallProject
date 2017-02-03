(function(module) {
  var firebasedb = firebase.database()
  var provider = new firebase.auth.GoogleAuthProvider();

  // object to hold the front end view functions
  var eventHandler = {};

  // creates new Event object from form
  eventHandler.save = function (e) {
    e.preventDefault();
    var newEvent = new Event( $('#save-event input').get().reduce(function(newObj, cur){
      newObj[cur.id] = $(cur).val();
      return newObj;
    }, {})
  );
    newEvent.getLatandLog(newEvent.address);
  };

// Given a new event, creates Event Object and encodes with lat and lng based on address from google docs
  eventHandler.saveSimple = function (newevent) {
    var newEvent = new Event(newevent);
    newEvent.getLatandLog(newEvent.streetNumber + newEvent.streetName +newEvent.Zip);
  };

  // given an event and a current key, update that event.
  eventHandler.update = function (newevent , key) {
    var newEvent = new Event(newevent)
    var address = newEvent.streetNumber +' '+ newEvent.streetName +' '+ newEvent.City + ' ' + newEvent.Zip
    console.log(address);
    newEvent.getLatandLog(address, key);
  };

  //Sign in fuction for firebase
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

  //listens for auth state
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

  //renders the results of lookup to the page
  //colors based on party
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

  // for front end editor.
  $('#all-events').on('focusout', '.event-row', function(){
    id = this.id;
    console.log(id);
    newEvent = $(this).children('td').get().reduce(function(newObj, cur){
      newObj[cur.id] = $(cur).html();
      return newObj;
    }, {})
    console.log(newEvent);
    eventHandler.update(newEvent , id);
  })

  $('#save-event').on('submit', eventHandler.save);
  $('#look-up').on('submit', eventHandler.lookup);
  $('#view-all').on('click', Event.viewAll);

  module.eventHandler = eventHandler;
})(window);
