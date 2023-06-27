const getUserByToken = require('./get-user-by-token')
const Pet = require('../models/Pet')

const checkUserHasPet = async (token) =>{
    const user = await getUserByToken(token)

    const userPets = await Pet.findOne({ 'user._id': user._id })

    return userPets
}

module.exports = checkUserHasPet;