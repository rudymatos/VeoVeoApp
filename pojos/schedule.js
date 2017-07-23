exports.Schedule = class{

    constructor(theater, day, time){
        this.theater = theater
        this.day = day
        this.time = time
    }

    toString(){
        return `${this.theater.name} (${this.day} at ${this.time})`
    }
}