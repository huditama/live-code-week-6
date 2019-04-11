const { verify } = require('../helpers/jwt')
const Joke = require('../models/joke')

module.exports = (req, res, next) => {
    const decoded = verify(req.headers.token)
    Joke
        .findOne({ _id: req.params.JokeId })
        .populate('UserId')
        .then((findOneJoke) => {
            if (findOneJoke.UserId.email === decoded.email) next()
            else res.status(401).json({ type: 'AUTHORIZATION ERROR', message: 'You do not have access to this page!' })
        })
}