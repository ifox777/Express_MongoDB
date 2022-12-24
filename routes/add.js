import {Router} from "express";
import {Course} from "../models/course.js"
import {auth} from "../middleware/auth.js";

export const routerAdd = Router()

routerAdd.get('/', auth,(req, res) =>{
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})


routerAdd.post('/', auth,async(req, res) => {
    //console.log(req.body)
    //const course = new Course(req.body.title, req.body.price, req.body.img)
   const course = new Course({
       title: req.body.title,
       price: req.body.price,
       img: req.body.img,
       userId: req.user
   })

    try {
        await course.save()
        res.redirect('/courses')

    } catch (e) {
       console.log(e)
    }

    //редирект, чтоьыб после ввода данных не зависало, а перекидывало на страницу

})
