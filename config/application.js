var envMode     = process.env.NODE_ENV || 'development'
    hapi        = require('hapi'),
    feed        = process.env.FEED_XML_URL
    blipp       = require('blipp'),
    moviesRoute = require('../routes/movies')
    packageJSON = require('../package.json')
    firebase    = require('firebase')


console.log('Loading App in ' + envMode + ' mode.')
var server = new hapi.Server()

global.App = {
    hapiServer: server,
    blipp: blipp,
    port: process.env.PORT || 3000,
    feed: feed,
    envMode: envMode,
    version: packageJSON.version,
    firebase: firebase,
    start: function () {
        App.hapiServer.connection({ port: App.port, routes: { cors: true } });
        var firebaseConfig = {
            apiKey: process.env.FIREBASE_APIKEY || 'AIzaSyCT3HS7xJR0uPQQkY4ncBESJouzHKwY_6Q',
            authDomain: process.env.FIREBASE_AUTHDOMAIN || 'veoveoapp-e2162.firebaseapp.com',
            databaseURL: process.env.FIREBASE_DATABASEURL || 'https://veoveoapp-e2162.firebaseio.com',
            projectId: process.env.FIREBASE_PROJECTID || 'veoveoapp-e2162',
            storageBucket: process.env.FIREBASE_STORAGEBUCKET || 'veoveoapp-e2162.appspot.com',
            messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID || '838473042899'
        }
        App.firebase.initializeApp(firebaseConfig)
        moviesRoute(App.hapiServer);
        App.hapiServer.register({ register: App.blipp, options: {} }, function (error) {
            if (error) {
                console.log('Error starting hapi server with error: ' + error)
            } else {
                App.hapiServer.start(function () {
                    console.log('Version ' + App.version + ' running at: ' + App.hapiServer.info.uri + '(' + new Date() + ')');
                });
            }
        })
    }
}