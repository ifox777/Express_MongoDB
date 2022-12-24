import {Router} from "express";
import {Order} from "../models/order.js";
import {auth} from "../middleware/auth.js";

export const routerOrders = Router()

routerOrders.get('/', auth, async (req, res) =>{
    try {
        const orders = await Order.find({'user.userId': req.user._id})
            .populate('user.userId')
        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c)  => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e)
    }

})

routerOrders.post('/', auth, async (req, res) => {

    try {
        const user = await req.user
            .populate('cart.items.courseId')

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc}
        }))
        //console.log(courses)

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })
        //console.log(order)
        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (e) { console.log(e)

    }

})