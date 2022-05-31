const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes/routes')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)


const url = 'mongodb+srv://gabriel:LzxLySm9nKHQQeSI@apicluster.os8bk.mongodb.net/usersDatabase?retryWrites=true&w=majority'
const port = proces.env.PORT || 3030
mongoose
.connect(url)
.then(() =>{ 
    console.log('Conenctou ao Mongo')
    app.listen(3030, ()=> { 
        console.log('Running')
    })
})
.catch((err) => {
    console.log(err)
})





