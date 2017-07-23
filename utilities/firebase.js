var constants = require('../utilities/constants.js')

exports.FirebaseHelper = class {
    constructor(firebase) {
        this.firebase = firebase
    }
    saveDataToFirebase(response, data) {
        var ref = firebase.app().database().ref().child('movie_listing');
        var nextVersion = 1.0
        ref.orderByChild('version').limitToLast(1).once('value', function (snap) {
            if (snap.val() !== null) {
                nextVersion = snap.val()[(Object.keys(snap.val())[0])].version + 0.1
            }
        }).then(value => {
            var movieListing = { version: nextVersion, updatedOn: new Date().toString(), data: data }
            ref.push(movieListing)
            response(constants.DATA_SAVED_IN_FIREBASE_SUCESSFULLY)
        });
    }
}
