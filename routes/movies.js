var constants = require('../utilities/constants.js'),
    got = require('got'),
    xmlReader = require('xmlreader')
movieObj = require('../pojos/movie.js'),
    theaterObj = require('../pojos/theater.js')

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

                    var movieList = fillUpMovieList(movies)
                    var theaterList = fillUpTheaterList(theaters)
                    fillUpScheduleList(movieList, theaterList, schedules)

                });
            }).catch(error => {
                console.log(error)
                response(constants.NO_AVAILABLE_CHANGES)
            });
        }
    })

    function fillUpScheduleList(movieList, theaterList, schedulesNode) {
        schedulesNode.each(function (i, currentSchedule) {
            parseSchedule(currentSchedule.Detail.text())
        });
    }

    function parseSchedule(currentScheduleDetail) {
        var values = currentScheduleDetail.split(' ')
        
        for (var index = 0; index < values.length; index += 2) {
            var days = values[index].split('-')
            var times = values[index + 1].split(',')

            var scheduleDays = getDaysToCreate(days)
            console.log(scheduleDays)


        }



    }

    function getDaysToCreate(days) {
        var validDays = []
        var weekDays = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']
        if (days !== 'undefined' && days.length > 0) {
            var startDayIndex = weekDays.indexOf(days[0].replace(',',''))
            var endDayIndex = weekDays.indexOf(days[days.length - 1].replace(',',''))
            var hasEnded = false
            while(hasEnded){
                validDays.push(weekDays[startDayIndex])
                startDayIndex += 1
                if(startDayIndex > endDayIndex){
                    hasEnded = true
                }
            }
        }
        return validDays
    }


    function fillUpTheaterList(theaters) {
        var theaterList = []
        theaters.each(function (i, currentTheater) {
            var id = currentTheater.attributes().id
            var name = currentTheater.Name.text()
            var region = getStringValue(currentTheater.Region)
            var address = getStringValue(currentTheater.Address)
            var phone = getStringValue(currentTheater.Phone)
            var lat = getStringValue(currentTheater.lat)
            var lon = getStringValue(currentTheater.lon)
            var website = getStringValue(currentTheater.website)
            var description = getStringValue(currentTheater.desc)
            var price = getStringValue(currentTheater.precio)

            //Creating Theater Object
            let theater = new theaterObj.Theater(id, name, region, address, phone, lat, lon, website, description, price)
            theaterList.push(theater)
        });
        return theaterList
    }

    function fillUpMovieList(movies) {
        var movieList = []
        movies.each(function (i, currentMovie) {
            var id = currentMovie.attributes().id
            var name = currentMovie.Name.text()
            var coverUrl = getStringValue(currentMovie.Cover)
            var director = getStringValue(currentMovie.Director)
            var duration = getStringValue(currentMovie.Duration)
            var genres = getStringValue(currentMovie.Genres)
            var language = getStringValue(currentMovie.Language)
            var rating = getStringValue(currentMovie.Rating)
            var plot = getStringValue(currentMovie.Synopsis)
            var trailerUrl = getStringValue(currentMovie.TrailerURL)
            var writers = getStringValue(currentMovie.Writers)

            //Creating Movie Object
            let movie = new movieObj.Movie(id, name, coverUrl, director, duration, genres, language, rating, plot, trailerUrl, writers)
            movie.schedules.push(i)
            movieList.push(movie)
        });
        return movieList
    }

    function getStringValue(currentNode) {
        var value = "";
        if (typeof currentNode.text !== "undefined") {
            value = currentNode.text()
        }
        return value;
    }

    server.route({
        method: 'GET',
        path: '/movies/get_xml',
        handler: function (request, response) {
            response(constants.TEST_XML)
        }
    })

}
