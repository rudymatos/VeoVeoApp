exports.FirebaseHelper = class {
    constructor(firebase) {
        this.firebase = firebase
    }
    saveDataToFirebase(response, data) {
        var ref = firebase.app().database().ref().child('users');
        ref.orderByChild('order').equalTo(9).limitToLast(1).on('child_added', function (currentObject) {
            console.log(currentObject.val())
        })
    }
}
