const Pet = require('../models/Pet')

// helpers
const getUserByToken = require('../helpers/get-user-by-token')
const getToken = require('../helpers/get-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {
  // criando pet
  static async create(req, res) {
    const{name,age,description,color} = req.body
    const available = true

    // validações
    if (!name) {
      res.status(422).json({ status: false, mensagem: 'O nome é obrigatório!' })
      return
    }

    if (!age) {
      res.status(422).json({ status: false, mensagem: 'A idade é obrigatória!' })
      return
    }

    if (!color) {
      res.status(422).json({ status: false, mensagem: 'A cor é obrigatória!' })
      return
    }

    // pegando o usuario logado
    const token = getToken(req)
    const user = await getUserByToken(token)

    // criando novo pet
    const pet = new Pet({
      name: name,
      age: age,
      description: description,
      color: color,
      available: available,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })

    try {
      const newPet = await pet.save()
      res.status(201).json({
        status: true,
        newPet: newPet,
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }

}
