import {BASE_URL, EMAIL_FROM} from "../keys/index.js";

export const resetEmail = function (email, token) {
    return{
        to: email,
        from: EMAIL_FROM,
        subject: 'Восстановление доступа',
        html: `
        <h1>Вы забыли пароль?</h1>
        <p>Если нет, то произнорируйте данное письмо</p>
        <p>Иначе нажмите на ссылку ниже</p>
        <p><a href="${BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
        <hr /> 
         <a href="${BASE_URL}">Магазин курсов</a>            
        `
    }
}