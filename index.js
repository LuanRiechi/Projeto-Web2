const express = require('express')
const exphbs = require('express-handlebars')
require('dotenv').config()
//rotas
const publicRoutes = require('./routes/publicRoutes')
const PetRoutes = require('./routes/PetRoutes')
const UserRoutes = require('./routes/UserRoutes')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine','handlebars')

app.use(express.static('public'))

app.use(express.urlencoded({extended: true}))

app.use(express.json())

//rotas
app.use('/', publicRoutes)
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(3000, ()=>{
    console.log("Servidor ON")
})