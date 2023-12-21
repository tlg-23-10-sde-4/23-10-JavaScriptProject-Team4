const express = require("express")
const db = require('./connection/connection.js')
const cors = require('cors')
const { get } = require("mongoose")

db.on('error', (error) => console.error(error))

db.once('open', () => console.log("Successfully Connected to our mongodb"))

const app = express()

const favorites = []

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended : false}))
app.use(cors())

app.get('/addfavorites', function (req, res) {
    res.send(favorites)
})

app.post('/addfavorites', function (req, res) {
    favorites.push(req.body)
    res.redirect('/addfavorites')
})

app.listen(PORT, async () => {
    console.log(`Now listening on port: ${PORT}`);
})