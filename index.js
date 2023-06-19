const express = require('express')
const exphbs = require('express-handlebars')

const publicRoutes = require('./routes/publicRoutes')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine','handlebars')

app.use(express.static('public'))

app.use(express.urlencoded({extended: true}))

app.use(express.json())

app.use('/', publicRoutes)

app.listen(3000, ()=>{
    console.log("Servidor ON")
})