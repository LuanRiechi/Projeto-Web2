const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')


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

let mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/contato',(req,res)=>{
    const {name,email,assunto,mensagem} = req.body
    if(!name){
        res.json({status: false, mensagem:"Sem nome do usuario"})
    }
    if(!email){
        res.json({status: false, mensagem:"Sem email do usuario"})
    }
    if(!assunto){
        res.json({status: false, mensagem:"Assunto nao informado"})
    }
    if(!mensagem){
        res.json({status: false, mensagem:"Mensagem nao informada"})
    }
    let detalhesEmail ={
        from: `PETSCP <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_FINAL,
        subject: assunto,
        text: mensagem +"\n"+"usuario: " + name + "\n"+"E-mail: " + email
    }

    mailTransport.sendMail(detalhesEmail, function(err,data){
        if(err){
            res.json({status: false, mensagem:"erro no envio de email"})
        }else{
            res.redirect('/')
        }
    })
})




module.exports = router