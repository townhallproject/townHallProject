
(function(module) {
// For handling user submitted events.
// Not being used yet.

  var newEventView = {};
  $('#all-events').on('focusout', '.event-row', function(){
    id = this.id;
    console.log(id);
    newTownHall = $(this).children('td').get().reduce(function(newObj, cur){
      newObj[cur.id] = $(cur).html();
      return newObj;
    }, {});
    console.log(newTownHall);
    eventHandler.update(newTownHall , id);
  });


  TownHall.viewAll = function () {
    var locations = [];
    firebase.database().ref('/townHalls').once('value').then(function(snapshot) {
      snapshot.forEach(function(ele){
        newTownHall = new TownHall(ele.val());
        $newRow = $(newTownHall.toHtml($('#view-firebase-template')));
        $newRow.attr('id' , ele.key);
        $('#all-events').append($newRow);
      });
    });
  };

  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //   // User is signed in.
  //     console.log(user.displayName, ' is signed in');
  //   } else {
  //     eventHandler.signIn()
  //     // No user is signed in.
  //   }
  // });

  //Sign in fuction for firebase
  newEventView.signIn = function (){
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
  };

  module.eventHandler = eventHandler;
})(window);
