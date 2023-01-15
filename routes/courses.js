import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {Course} from "../models/course.js";

export const routerCourses = Router()

function isOwner(course, req) {
   return course.userId.toString() === req.user._id.toString()
}


routerCourses.get('/', async (req, res) =>{
   try {
       const courses = await Course.find().populate('userId', 'email name')
           .select('price title img')
       //console.log(courses)
       res.render('courses', {
           title: 'Курсы',
           isCourses: true,
           userId: req.user ? req.user._id.toString() : null,
           courses
       })
   } catch (e) {
        console.log(e)
   }



})

routerCourses.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
         return res.redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id).lean()
        console.log()
        if (!isOwner(course, req)){
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e)
    }


})
routerCourses.post('/edit', auth, async (req, res) => {
    try {
        const {id} = req.body
        delete req.body.id

         const course = await Course.findById(id).lean()
        if(!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        Object.assign(course, req.body)
        await course.save()


        //await Course.findByIdAndUpdate(id, req.body).lean()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }



})

routerCourses.post('/remove', auth, async(req,res) =>{
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

routerCourses.get('/:id',async (req,res) => {
    try {
        console.log('ID', req.params.id)
        const course = await Course.findById(req.params.id).lean()
        res.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course

        })
    } catch (e) {
        console.log(e)
    }

})
