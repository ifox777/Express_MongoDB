import {Router} from 'express';
import {hash, compare} from 'bcrypt'; //bcrypt
import nodemailer from 'nodemailer';
import * as crypto from "crypto";
//import sendgrid from 'nodemailer-sendgrid-transport'
import {User} from "../models/user.js";
//import {SENDGRID_API_KEY} from "../keys/index.js";
import {regEmail} from "../emails/registration.js";
import {resetEmail} from "../emails/reset.js";
import * as buffer from "buffer";


export const routerAuth = Router()



// const transporter = nodemailer.createTransport(sendgrid({
//     auth: {api_key: SENDGRID_API_KEY }
// }))


const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 587,
    secure: false,
    auth: {
        user: 'AlekseiChebenyuk@yandex.ru',
        pass: 'raodtmqjqjwhqwvk',
    },
})


routerAuth.get('/login', async (req,res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')

    })
})

routerAuth.get('/logout', async (req,res) => {
    //req.session.isAuthenticated = false  //1-й  вариант как очистить сессию
    //res.redirect('/auth/login#login')   //1-й  вариант как очистить сессию
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

routerAuth.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
        const areSame = await compare(password, candidate.password)
            if (areSame) {

                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })

            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }

})

routerAuth.post('/register', async(req,res) => {
    try{
        const {email, password, confirm, name} =  req.body

        const candidate = await User.findOne( {email})

        if (candidate) {
            req.flash('registerError', 'Пользователь стаким email уже существует')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await hash(password,10)
            const user = new User ({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()

            await transporter.sendMail(regEmail(email)) //отправка письма после регистрации. Рекомендуется после редиректов
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

routerAuth.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль',
        error: req.flash('error')
    })
})

routerAuth.post('/reset', async (req, res) =>{
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не атк повторите попытку позже')
                return res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')
            const candidate =  await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})