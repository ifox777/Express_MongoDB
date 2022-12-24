// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs'
// import path from 'path'
//
// const __dirname = path.resolve()
//
//
//
// // сюда будем передавать даныне данныео введенных курсач
//
// export class Course {
//     constructor(title, price, img) {
//         this.title = title
//         this.price = price
//         this.img = img
//         this.id = uuidv4()
//
//     }
//
//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id
//         }
//     }
//    static async update (course) {
//         const courses = await Course.getALL()
//
//        const idx = courses.findIndex(c => c.id === course.id)
//        courses[idx] = course
//        return new Promise((resolve, reject) => {
//            fs.writeFile(
//                path.join(__dirname, 'data', 'courses.json'),
//                JSON.stringify(courses),
//                (err) => {
//                    if (err) {
//                        reject(err)
//                    } else {
//                        resolve()
//                    }
//                }
//            )
//        })
//     }
//
//    async save() {
//         const courses = await Course.getALL()
//        courses.push(this.toJSON())
//
//        return new Promise((resolve, reject) => {
//            fs.writeFile(
//                path.join(__dirname, 'data', 'courses.json'),
//                JSON.stringify(courses),
//                (err) => {
//                    if (err) {
//                        reject(err)
//                    } else {
//                        resolve()
//                    }
//                }
//                         )
//
//
//            })
//
//
//        console.log('Courses', courses)
//     }
//
//     static getALL() {
//
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, 'data', 'courses.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         reject(err)
//                     }
//                     else {
//                         resolve(JSON.parse(content))
//                     }
//                 }
//             )
//         })
//     }
//
//     static async getById(id) {
//        const courses  = await Course.getALL()
//         return courses.find(c => c.id === id)
//     }
//
// }
