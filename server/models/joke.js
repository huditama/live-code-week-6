const mongoose = require('mongoose')
const Schema = mongoose.Schema

let jokeSchema = new Schema({
    joke: String,
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

let Joke = mongoose.model('Joke', jokeSchema)

module.exports = Joke