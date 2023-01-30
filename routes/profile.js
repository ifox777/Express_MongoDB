import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {User} from "../models/user.js";


export const routerProfile = Router()

routerProfile.get('/', auth,  async (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject()
    })
})

routerProfile.post('/', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const toChange = {
            name: req.body.name
        }

        //console.log(req.file)

        if (req.file) {
            toChange.avatarUrl = req.file.path
        }
        Object.assign(user, toChange)   //Чтобы добавить новые поля объекту User
        await user.save() //пользователь сохраняется
        res.redirect('/profile')  //редирект на страницу профайла
    } catch (e) {
        console.log(e)
    }
})