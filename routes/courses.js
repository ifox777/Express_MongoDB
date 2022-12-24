import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {Course} from "../models/course.js";

export const routerCourses = Router()


routerCourses.get('/', async (req, res) =>{
    const courses = await Course.find().populate('userId', 'email name')
        .select('price title img')
    //console.log(courses)
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })

})

routerCourses.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
         return res.redirect('/')
    }
    const course = await Course.findById(req.params.id).lean()
    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
})
routerCourses.post('/edit', auth, async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body).lean()
    res.redirect('/courses')

})

routerCourses.post('/remove', auth, async(req,res) =>{
    try {
        await Course.deleteOne({ _id: req.body.id })
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

routerCourses.get('/:id',async (req,res) => {
    console.log('ID', req.params.id)
    const course = await Course.findById(req.params.id).lean()
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course

    })


})
