const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CinemaSchema = new Schema({
    uuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: Schema.Types.Mixed,
        required: true
    },
    url: {
        type: String
    },
    films: {
        type: [String],
        default: []
    }
})

mongoose.model('cinemas', CinemaSchema)