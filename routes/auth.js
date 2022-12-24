import {Router} from 'express';
import {hash, compare} from 'bcrypt'; //bcrypt
import {User} from "../models/user.js";

export const routerAuth = Router()


routerAuth.get('/login', async (req,res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
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
                res.redirect('/auth/login#login')
            }
        } else {
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }

})

routerAuth.post('/register', async(req,res) => {
    try{
        const {email, password, repeat, name} =  req.body

        const candidate = await User.findOne( {email})

        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await hash(password,10)
            const user = new User ({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})