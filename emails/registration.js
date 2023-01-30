import {EMAIL_FROM, BASE_URL} from "../keys/index.js";


export const regEmail  = function (email) {
    return{
        to: email,
        from: EMAIL_FROM,
        subject: 'Аккаунт создан',
        html: `
        <h1>Добро пожаловать в наш магазин</h1>
        <p>Вы успешно создали аккаунт c email - ${email}</p>
        <hr /> 
         <a href="${BASE_URL}">Магазин курсов</a>            
        `
    }

}