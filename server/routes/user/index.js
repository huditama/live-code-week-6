const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const authenticate = require('../../middlewares/authenticate')
const authorize = require('../../middlewares/authorize')

// TESTING PURPOSES
router.get('/getJoke/:JokeId', userController.findOne)


router.post('/register', userController.register)
router.post('/login', userController.login)
router.use(authenticate)
router.get('/getJoke', userController.getJoke)
router.get('/favorites', userController.getFavorites)
router.post('/favorites', userController.addToFavorites)
router.delete('/favorites/:JokeId', authorize, userController.deleteFavorites)
router.post('/verify', authenticate)

module.exports = router