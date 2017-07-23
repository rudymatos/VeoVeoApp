var validator = require('./validator.js')

exports.fillUpScheduleList = function fillUpScheduleList(movieList, theaterList, schedulesNode) {
    schedulesNode.each(function (i, currentSchedule) {
        var scheduleDayAndTime = currentSchedule.Detail.text()
        if (validator.validateScheduleTime(scheduleDayAndTime)) {
            const regexExpression = "/\s{2,}/g"
            scheduleDayAndTime = scheduleDayAndTime.replace('/','/ ').replace(regexExpression, ' ').split(' ').filter(Boolean)
            for (var index = 0; index < scheduleDayAndTime.length; index += 2) {
                var days = scheduleDayAndTime[index].split('-')
                var times = scheduleDayAndTime[index + 1].split(',')
                var scheduleDays = getDaysToCreate(days)

                var currentMovie = movieList.find(m => m.id == currentSchedule.Movie.text())
                var currentTheater = theaterList.find(t => t.id == currentSchedule.Theater.text())

                scheduleDays.forEach(function (scheduleDay) {
                    times.forEach(function (time) {
                        let schedule = new scheduleObj.Schedule(currentTheater, scheduleDay, time.replace('/', ''))
                        currentMovie.schedules.push(schedule)
                    })
                })
            }
        }
    });
}

function getDaysToCreate(days) {
    var validDays = []
    var weekDays = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']
    if (typeof days !== 'undefined' && days.length > 0) {
        var startDayIndex = weekDays.indexOf(days[0].replace(',', ''))
        var endDayIndex = weekDays.indexOf(days[days.length - 1].replace(',', ''))
        var hasEnded = false
        while (!hasEnded) {
            validDays.push(weekDays[startDayIndex])
            startDayIndex += 1
            if (startDayIndex > endDayIndex) {
                hasEnded = true
            }
        }
    }
    return validDays
}


exports.fillUpTheaterList = function fillUpTheaterList(theaters) {
    var theaterList = []
    theaters.each(function (i, currentTheater) {
        var id = currentTheater.attributes().id
        var name = currentTheater.Name.text()
        var region = validator.getStringValue(currentTheater.Region)
        var address = validator.getStringValue(currentTheater.Address)
        var phone = validator.getStringValue(currentTheater.Phone)
        var lat = validator.getStringValue(currentTheater.lat)
        var lon = validator.getStringValue(currentTheater.lon)
        var website = validator.getStringValue(currentTheater.website)
        var description = validator.getStringValue(currentTheater.desc)
        var price = validator.getStringValue(currentTheater.precio)

        //Creating Theater Object
        let theater = new theaterObj.Theater(id, name, region, address, phone, lat, lon, website, description, price)
        theaterList.push(theater)
    });
    return theaterList
}

exports.fillUpMovieList = function fillUpMovieList(movies) {
    var movieList = []
    movies.each(function (i, currentMovie) {
        var id = currentMovie.attributes().id
        var name = currentMovie.Name.text()
        var coverUrl = validator.getStringValue(currentMovie.Cover)
        var director = validator.getStringValue(currentMovie.Director)
        var duration = validator.getStringValue(currentMovie.Duration)
        var genres = validator.getStringValue(currentMovie.Genres)
        var language = validator.getStringValue(currentMovie.Language)
        var rating = validator.getStringValue(currentMovie.Rating)
        var plot = validator.getStringValue(currentMovie.Synopsis)
        var trailerUrl = validator.getStringValue(currentMovie.TrailerURL)
        var writers = validator.getStringValue(currentMovie.Writers)

        //Creating Movie Object
        let movie = new movieObj.Movie(id, name, coverUrl, director, duration, genres, language, rating, plot, trailerUrl, writers, 0, 0)
        movie.schedules.push(i)
        movieList.push(movie)
    });
    return movieList
}
