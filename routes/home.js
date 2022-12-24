import {Router} from "express";

export const routerHome = Router()


routerHome.get('/', (req, res) =>{
    res.render('index', {
        title: 'Главная страница',
        isHome: true
    })
})