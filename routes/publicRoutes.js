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
        res.json({erro: true, mensagem:"Sem nome do usuario"})
    }
    if(!email){
        res.json({erro: true, mensagem:"Sem email do usuario"})
    }
    if(!assunto){
        res.json({erro: true, mensagem:"Assunto nao informado"})
    }
    if(!mensagem){
        res.json({erro: true, mensagem:"Mensagem nao informada"})
    }
    let detalhesEmail ={
        from: `PETSCP <${process.env.EMAIL_USER}>`,
        to: 'leleco12_@hotmail.com',
        subject: assunto,
        text: mensagem +"\n"+"usuario: " + name + "\n"+"E-mail: " + email
    }

    mailTransport.sendMail(detalhesEmail, function(err,data){
        if(err){
            res.json({erro: true, mensagem:"erro no envio de email"})
        }else{
            res.redirect('/')
        }
    })
})




module.exports = router