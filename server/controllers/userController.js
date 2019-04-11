const User = require('../models/user')
const Joke = require('../models/joke')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const axios = require('axios')

let ax = axios.create({ baseURL: 'https://icanhazdadjoke.com' })
ax.defaults.headers.common['Accept'] = `application/json`

class userController {
    static register(req, res) {
        const { email, password } = req.body
        User
            .create({
                email,
                password
            })
            .then((createdUser) => {
                res.status(200).json({ message: 'Successfully created a user!', createdUser })
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static login(req, res) {
        const { email, password } = req.body
        User
            .findOne({
                email
            })
            .then((findOneUser) => {
                if (!findOneUser) res.status(401).json({ message: 'Email/Password is incorrect!' })
                else if (!compare(password, findOneUser.password)) res.status(401).json({ message: 'Email/Password is incorrect!' })
                else {
                    const { id, first_name, last_name, email } = findOneUser
                    const payload = { id, first_name, last_name, email }
                    const token = sign(payload)
                    req.headers.token = token
                    res.status(200).json({
                        message: 'You have successfully logged in!',
                        token,
                        details: payload
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            })
    }

    static getJoke(req, res) {
        ax
            .get('/')
            .then(({ data }) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static getFavorites(req, res) {
        Joke
            .find({ UserId: req.authenticatedUser.id })
            .populate('UserId')
            .then((favoriteJokes) => {
                res.status(200).json(favoriteJokes)
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            })
    }

    static addToFavorites(req, res) {
        const { joke } = req.body
        Joke
            .create({ joke, UserId: req.authenticatedUser.id })
            .then((createdJoke) => {
                res.status(201).json({ message: 'Added joke to favorites!', createdJoke })
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            })
    }

    static deleteFavorites(req, res) {
        const { JokeId } = req.params
        Joke
            .findByIdAndDelete(JokeId)
            .then((deletedJoke) => {
                res.status(200).json({ message: 'Deleted joke from your favorites!', deletedJoke })
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    // TESTING PURPOSES
    static findOne(req, res) {
        Joke
            .findById(req.params.JokeId)
            .then((findOneJoke) => {
                res.status(200).json(findOneJoke)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }
}

module.exports = userController