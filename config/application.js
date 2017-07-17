var envMode     = process.env.NODE_ENV || 'development' 
    hapi        = require('hapi'),
    feed        = process.env.FEED_XML_URL || 'http://localhost:3000/movies/get_xml'
    blipp       = require('blipp'),
    moviesRoute = require('../routes/movies')
    packageJSON = require('../package.json');

console.log('Loading App in '+envMode +' mode.')
var server = new hapi.Server()

global.App = {
    hapiServer : server,
    blipp : blipp,
    port : process.env.PORT || 3000,
    feed : feed,
    envMode : envMode,
    version :  packageJSON.version,
    start : function(){
        App.hapiServer.connection({port: App.port, routes : {cors: true}});
        moviesRoute(App.hapiServer);
        App.hapiServer.register({register: App.blipp, options: {}}, function(error){
            if(error){
                console.log('Error starting hapi server with error: '+error)
            }else{
                App.hapiServer.start(function(){
                    console.log('Version '+App.version+' running at: '+ App.hapiServer.info.uri + '(' + new Date() +')');
                });
            }
        })
    }
}