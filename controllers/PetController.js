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
            res.status(500).json({ status: false, mensagem: error })
        }
    }

    //buscando todos os pets registrados no sistema
    static async getAll(req, res) {
        const pets = await Pet.find()

        res.status(200).json({
            status: true,  
            pets: pets,
        })
    }

    //buscando todos os pets de um usuario
    static async getAllUserPets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id })

        res.status(200).json({
            status: true,  
            pets,
        })
    }

    // buscando um pet por id
    static async getPetById(req, res) {
        const id = req.params.id
    
        // verificando se o id é valido
        if (!ObjectId.isValid(id)) {
          res.status(422).json({ status: false, mensagem: 'ID inválido!' })
          return
        }
    
        // verificando se o pet existe
        const pet = await Pet.findOne({ _id: id })
    
        if (!pet) {
          res.status(404).json({ status: false, mensagem: 'Pet não encontrado!' })
          return
        }
    
        res.status(200).json({
          status: true,  
          pet: pet,
        })
    }


    static async removePetById(req, res) {
        const id = req.params.id
    
        if (!ObjectId.isValid(id)) {
          res.status(422).json({ status: false, mensagem: 'ID inválido!' })
          return
        }
    
        const pet = await Pet.findOne({ _id: id })
    
        if (!pet) {
          res.status(404).json({ status: false, mensagem: 'Pet não encontrado!' })
          return
        }
    
        // verificando se foi o usuario logado que registrou o pet
        const token = getToken(req)
        const user = await getUserByToken(token)
    
        if (pet.user._id.toString() != user._id.toString()) {
          res.status(404).json({
            status: false, mensagem:
              'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
          })
          return
        }
    
        await Pet.findByIdAndRemove(id)
    
        res.status(200).json({ status: true, mensagem: 'Pet removido com sucesso!' })
    }

}
