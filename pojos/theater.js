exports.Theater = class{
    constructor(id, name, region, address, phone, lat, lon, website, description, price){
        this.id = id
        this.name = name
        this.region = region
        this.address = address
        this.phone = phone
        this.lat = lat
        this.lon = lon
        this.website = website
        this.description = description
        this.price = price

    }

    toString(){
        return `${name} : ${address}`
    }

}