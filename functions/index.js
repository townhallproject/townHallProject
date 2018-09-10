const functions = require('firebase-functions');
const url = require('url');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.stateRouting = functions.https.onRequest((req, res) => {
  req.url = url.parse(req.url);
  req.state = req.url.pathname.split('/')[1]
  console.log('state', req.state);
  // res.sendFile('index.html', {root: 'https://townhallproject-86312.firebaseapp.com/'});
  res.status(200).send(`<!doctype html>
  <head>
    <title>Time</title>
  </head>
  <body>
    ${__dirname}
  </body>
</html>`);
});
