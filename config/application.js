var envMode     = process.env.NODE_ENV || 'development'
    hapi        = require('hapi'),
    feed        = process.env.FEED_XML_URL
    blipp       = require('blipp'),
    moviesRoute = require('../routes/movies')
    packageJSON = require('../package.json')
    firebase    = require('firebase')
    
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
            apiKey: process.env.FIREBASE_APIKEY ,
            authDomain: process.env.FIREBASE_AUTHDOMAIN ,
            databaseURL: process.env.FIREBASE_DATABASEURL ,
            projectId: process.env.FIREBASE_PROJECTID ,
            storageBucket: process.env.FIREBASE_STORAGEBUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID '
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