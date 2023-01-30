import express from 'express'
import path from 'path';
import csrf from 'csurf';
import flash from 'connect-flash';
import exphbs from 'express-handlebars'
import session from 'express-session'
import  {default as connectMongo} from 'connect-mongodb-session'
import {routerHome} from "./routes/home.js";
import {routerCourses} from "./routes/courses.js";
import {routerAdd} from "./routes/add.js";
import {routerCard} from "./routes/card.js";
import {routerOrders} from "./routes/orders.js";
import {routerAuth} from "./routes/auth.js";
import{routerProfile} from "./routes/profile.js";
import mongoose from 'mongoose';
import {varMiddleware} from "./middleware/variables.js";
import {userMiddleware} from "./middleware/user.js";
import {errorHandler} from "./middleware/error.js";
import {fileMiddleware} from "./middleware/file.js";
import * as keys from './keys/index.js';


//const MONGODB_URI = 'mongodb://localhost:27017/shop'
const app = express()
const __dirname = path.resolve()
const MongoStore = connectMongo(session)

//настройка Handlebars
const hbs = exphbs.create({
defaultLayout: 'main', //название главного файла в папке layout (имя папки зарезервировано)
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },

    extname: 'hbs',
    helpers: {ifeq(a, b, options) {

    if (a == b) {
        return options.fn(this)
    }
    return options.inverse(this)
}}
})

const store = new MongoStore({

    uri: keys.MONGODB_URI,
    collection: 'sessions'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// app.use( async (req, res, next) =>{
//    try{
//        const  user = await User.findById('6388af1978a22113b7e8c667')
//        req.user  = user
//        next()
//    } catch (e) {
//        console.log(e)
//    }
//
//
// })   // Нужно когда нет функционала auth!

// обозначаем папку для добваления CSS
app.use(express.static(path.join(__dirname, 'public')))
//чтобы при вводе значений в форму и отправку ее получали объект
app.use('/images', express.static( path.join(__dirname, 'images')))
//для картинок тоже папку надо сделать статичной
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}),)
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

//так включаем экраны
app.use('/', routerHome)
app.use('/add',routerAdd)
app.use('/courses',routerCourses) //инициализируем вывод старницы курсов
app.use('/card', routerCard)  //инициализируем вывод старницы коррзины
app.use('/orders', routerOrders) //инициализируем вывод старницы заказов
app.use('/auth', routerAuth)  //инициализируем вывод старницы авторизации
app.use('/profile', routerProfile) //инизиализируем вывод страницы профиля

app.use(errorHandler )

const PORT = process.env.PORT || 3000

async function start () {
        try {
            await  mongoose.connect(keys.MONGODB_URI, {useNewUrlParser: true})
            // const candidate = await User.findOne()
            // if (!candidate) {
            //     const user = new User({
            //             email: 'ifox777@mail.ru',
            //             name: 'Aleksei',
            //             cart: {items:[]}
            //         })
            //     await user.save()
            // }   // Нужно когда нет функционала auth!
            app.listen(PORT, ()=>{
                console.log(`Server is running on port ${PORT}`)
            })
        } catch (e) {
            console.log(e)
        }



}
// async function start() {
//     try {
//         const url = `mongodb+srv://vladilen:0I5GEL9uLUcR38GC@cluster0-3rrau.mongodb.net/shop`
//         await mongoose.connect(url, {useNewUrlParser: true})
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`)
//         })
//     } catch (e) {
//         console.log(e)
//     }
// }

start()


