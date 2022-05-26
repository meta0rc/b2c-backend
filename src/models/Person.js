const mongoose = require('mongoose')

const Person = mongoose.model('Person', {
    name: String,
    email: String,
    password: String,
    img: String,
    endereco: String,
    job: String, 
    JobRelationsShip: [],
    premium: Boolean,
    bio: String,
    geo: String,
    num: String,
    capa: String,
    wwp: String,
    certifications: [],
    
    avaliables: []

})

module.exports = Person;