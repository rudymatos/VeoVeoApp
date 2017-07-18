exports.Movie = class{
    
   constructor(id, name, coverUrl, director, duration, genres, language, rating, plot, trailerUrl, writers, imdbReview, rottenTomatoesReview){
       this.id = id
       this.name = name
       this.coverUrl = coverUrl
       this.director = director
       this.duration = duration
       this.genres = genres
       this.language = language
       this.rating = rating
       this.plot = plot
       this.trailerUrl = trailerUrl
       this.writers = writers
       this.schedules = []
       this.imdbReview = imdbReview
       this.rottenTomatoesReview = rottenTomatoesReview
   }

   toString(){
       return `${this.id} : ${this.name}`;
   }
}