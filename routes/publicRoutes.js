const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('public/home')
})

router.get('/sobre',(req,res)=>{
    res.render('public/sobre')
})

router.get('/tecnologias',(req,res)=>{
    res.render('public/tecnologias')
})

router.get('/desenvolvedor',(req,res)=>{
    res.render('public/desenvolvedor')
})

router.get('/contato',(req,res)=>{
    res.render('public/contato')
})

router.get('/registrar',(req,res)=>{
    res.render('public/registrar')
})




module.exports = router