import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAmCMim_2ePjXmiPrFhscbuBOr0updtryc',
  authDomain: 'thp-dev-db.firebaseapp.com',
  databaseURL: 'https://thp-dev-db.firebaseio.com',
  projectId: 'thp-dev-db',
  storageBucket: 'thp-dev-db.appspot.com',
  messagingSenderId: '426223839812'
};

firebase.initializeApp(config);

const firebasedb = firebase.database();

export { firebase, firebasedb };