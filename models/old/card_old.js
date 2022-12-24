import path from "path";
import fs from 'fs';
const __dirname = path.resolve()
const p = path.join(
    __dirname,
    'data',
    'card.json'
)

export class Card_old {
    static async add(course) {
        const card = await Card_old.fetch()


        const  idx = card.courses.findIndex(c => c.id === course.id)
        const candidate = card.courses[idx]

        if (candidate) {
            // курс уже есть
            candidate.сount++
            card.courses[idx] = candidate
        } else {
            // нужно добавить курс
            course.сount = 1
            card.courses.push(course)
        }

        card.price += +course.price
        return new Promise((resolve, reject) =>{
            fs.writeFile(p, JSON.stringify(card), (err) =>{
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })

        })
    }
    static async remove(id) {
        const card = await Card_old.fetch()

        const idx = card.courses.findIndex(c => c.id === id)
        const course = card.courses[idx]

        if (course.сount === 1) {
            //удалить
            card.courses = card.courses.filter(c => c.id !== id)
        } else {
            //изменить количество
            card.courses[idx].сount--
        }

        card.price -= course.price
        return new Promise((resolve, reject) =>{
            fs.writeFile(p, JSON.stringify(card), (err) =>{
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })

        })


    }

    static  async fetch() {
        return new Promise((resolve, reject) =>{
            fs.readFile(p, 'utf-8',(err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            } )
        })
    }

}