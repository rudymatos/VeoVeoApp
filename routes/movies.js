var constants   = require('../utilities/constants.js'),
    got         = require('got'),
    xmlReader   = require('xmlreader')
    movieObj    = require('../pojos/movie.js'),
    scheduleObj = require('../pojos/schedule.js')
    theaterObj  = require('../pojos/theater.js')
    dataParser  = require('../utilities/data_parser.js')
    frbHelper   = require('../utilities/firebase.js')

module.exports = function (server) {

    server.route({
        method: 'GET',
        path: '/movies/available_changes',
        handler: function (request, response) {

            got(App.feed).then(result => {
                xmlReader.read(result.body, function (error, xmlResult) {
                    if (error) {
                        return console.log(error);
                    }

                    var root = xmlResult.CaribbeanCinemas
                    var schedules = root.Schedules.Schedule
                    var theaters = root.Theaters.Theater
                    var movies = root.Movies.Movie

                    var movieList = dataParser.fillUpMovieList(movies)
                    var theaterList = dataParser.fillUpTheaterList(theaters)
                    dataParser.fillUpScheduleList(movieList, theaterList, schedules)
                    let firebaseHelper = new frbHelper.FirebaseHelper(App.firebase)
                    firebaseHelper.saveDataToFirebase(response, movieList)
                });
            }).catch(error => {
                console.log(error)
                response(constants.NO_AVAILABLE_CHANGES)
            });
        }
    })

    server.route({
        method: 'GET',
        path: '/movies/get_xml',
        handler: function (request, response) {
            response(constants.TEST_XML)
        }
    })

}
