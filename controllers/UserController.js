const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

//helpers
const createUserToken = require('../helpers/create-user-token')


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

}