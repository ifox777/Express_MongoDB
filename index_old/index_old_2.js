import express from 'express'
import path from 'path'
const app = express()
const __dirname = path.resolve()



app.get('/', (req, res) =>{
//res.status(200) можно не добавлять
    res.sendFile(path.join(__dirname, 'views', 'index.hbs'))

})

app.get('/about', (req, res) =>{
    res.sendFile(path.join(__dirname, 'views', 'about.hbs'))

})


const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
