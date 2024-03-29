import {Router} from "express";
//import {auth} from "../middleware/auth.js";
import {Course} from "../models/course.js";
import {auth} from "../middleware/auth.js";

export const routerCard = Router()

 function mapCartItems(cart) {
 return  cart.items.map(c => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count
}))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

routerCard.post('/add', auth, async(req, res) => {
    const course = await Course.findById(req.body.id).lean()
    await req.user.addToCart(course)
    res.redirect('/card')
})

routerCard.delete('/remove/:id', auth, async (req,res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId')
    const courses =  mapCartItems(user.cart)
   const cart =  {
        courses, price: computePrice(courses)
    }
   
    res.status(200).json(cart)

})

routerCard.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        //.execPopulate()

const courses = mapCartItems(user.cart)

    //console.log(courses)

    res.render('card',{
        title: 'Корзина',
        isCard:true,
        courses: courses,
        price: computePrice(courses),

    } )
})