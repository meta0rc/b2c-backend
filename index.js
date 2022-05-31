const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./src/routes/routes')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)

const port = process.env.PORT || 3000

const mongo = 'mongodb+srv://gabriel:LzxLySm9nKHQQeSI@apicluster.os8bk.mongodb.net/usersDatabase?retryWrites=true&w=majority'

mongoose
.connect(mongo)
.then(() =>{ 
    console.log('Conenctou ao Mongo')
    app.listen(port, ()=> { 
        console.log('Running in', port)
    })
})
.catch((err) => {
    console.log(err)
})





