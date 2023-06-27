const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getUserByToken = require('../helpers/get-user-by-token')
const getToken = require('../helpers/get-token')
const ObjectId = require('mongoose').Types.ObjectId
const getPetsUser = require('../helpers/check-user-has-pet')


module.exports = class UserController {
  static async register(req, res) {

    const{name,email,password,confirmpassword} = req.body

    // validações
    if (!name) {
      res.status(422).json({status: false, mensagem: 'O nome é obrigatório!' })
      return
    }

    if (!email) {
      res.status(422).json({ status: false, mensagem: 'O e-mail é obrigatório!' })
      return
    }


    if (!password) {
      res.status(422).json({ status: false, mensagem: 'A senha é obrigatória!' })
      return
    }

    if (!confirmpassword) {
      res.status(422).json({ status: false, mensagem: 'A confirmação de senha é obrigatória!' })
      return
    }

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ status: false, mensagem: 'A senha e a confirmação precisam ser iguais!' })
      return
    }

    // verificando se usuario existe
    const userExists = await User.findOne({ email: email })

    if (userExists) {
      res.status(422).json({ status: false, mensagem: 'Por favor, utilize outro e-mail!' })
      return
    }

    // criando senha criptografada
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // criando objeto usuario
    const user = new User({
      name: name,
      email: email,
      password: passwordHash,
    })

    try {
      const newUser = await user.save()
      res.status(201).json({ status: true, newUser })
    } catch (error) {
      res.status(500).json({ status: false, mensagem: error })
    }
  }

  static async login(req, res) {
    const {email, password} = req.body

    if (!email) {
      res.status(422).json({ status: false, mensagem: 'O e-mail é obrigatório!' })
      return
    }


    if (!password) {
      res.status(422).json({ status: false, mensagem: 'A senha é obrigatória!' })
      return
    }

    // verificando se usuario existe
    const user = await User.findOne({ email: email })

    if (!user) {
      return res
        .status(422)
        .json({ status: false, mensagem: 'Não há usuário cadastrado com este e-mail!' })
    }

    // verificando se a senha confere
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      return res.status(422).json({ status: false, mensagem: 'Senha inválida' })
    }

    await createUserToken(user, req, res)
  }

  static async getUserById(req, res) {
    const id = req.params.id
    if(!id){
      return res.status(422).json({ status: false, mensagem: 'Id invalido' })
    }

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ status: false, mensagem: 'ID inválido!' })
      return
    }

    const user = await User.findById(id)

    if (!user) {
      res.status(422).json({ status: false, mensagem: 'Usuário não encontrado!' })
      return
    }

    res.status(200).json({status: true, user })
  }

  static async editUser(req, res) {
    const token = getToken(req)

    const user = await getUserByToken(token)

    const{name,email,password,confirmpassword} = req.body

    // validações
    if (!name) {
      res.status(422).json({ status: false, mensagem: 'O nome é obrigatório!' })
      return
    }

    user.name = name

    if (!email) {
      res.status(422).json({ status: false, mensagem: 'O e-mail é obrigatório!' })
      return
    }

    // verificando se usuario existe
    const userExists = await User.findOne({ email: email })

    if (user.email !== email && userExists) {
      res.status(422).json({ status: false, mensagem: 'Por favor, utilize outro e-mail!' })
      return
    }

    user.email = email

    // verificando se a senha confere
    if (password != confirmpassword) {
      res.status(422).json({ status: false, mensagem: 'As senhas não conferem.' })
      return

    } else if (password == confirmpassword && password != null) {
      // criando a senha
      const salt = await bcrypt.genSalt(12)
      const reqPassword = req.body.password

      const passwordHash = await bcrypt.hash(reqPassword, salt)

      user.password = passwordHash
    }

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true },
      )
      res.status(200).json({
        status: true,
        data: updatedUser,
      })
    } catch (error) {
      res.status(500).json({ status: false, mensagem: error })
    }
  }

  static async removeUser(req,res){

    const token = getToken(req)

    const user = await getUserByToken(token)

    if(!user){
      res.status(404).json({ status: false, mensagem: 'Usuario nao existe' })
      return
    }

    const userPets = await getPetsUser(token)
    if(userPets){
      res.status(404).json({ status: false, mensagem: 'Não é possivel deletar usuario com pet cadastrado!' })
      return
    }
    
    await User.findByIdAndRemove(user._id)
    res.status(200).json({ status: true, mensagem:"usuario deletado com sucesso"})
  }

}