const bcrypt = require('bcryptjs')

module.exports = {
    hash: function (inputPassword) {
        return bcrypt.hashSync(inputPassword, bcrypt.genSaltSync(10))
    },
    compare: function (inputPassword, userPassword) {
        return bcrypt.compareSync(inputPassword, userPassword)
    }
}