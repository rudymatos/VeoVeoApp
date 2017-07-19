var firebase = require('firebase')
exports.saveDataToFirebase = function saveDataToFirebase(responseObject, data) {
    firebase.initializeApp(App.firebaseConfig);
    var ref = firebase.app().database().ref();
    ref.once('value').then(function (snap) {
        responseObject({snap })
    })
}




