const mongoose = require('mongoose')
const Schema = mongoose.Schema


const FilmSchema = new Schema({
    uuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    year: {
        type: String
    },
    rate: {
        type: String
    },
    length: {
        type: String
    },
    country: {
        type: String
    },
    link: {
        type: String
    },
    picture: {
        type: String
    },
    cinemas: {
        type: [String],
        default: []
    },
    isFavorite: {
        type: Boolean
    }
})

mongoose.model('films', FilmSchema)