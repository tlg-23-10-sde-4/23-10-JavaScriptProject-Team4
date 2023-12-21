const express = require("express")
const db = require('./connection/connection.js')
const cors = require('cors')
const { get } = require("mongoose")

db.on('error', (error) => console.error(error))

db.once('open', () => console.log("Successfully Connected to our mongodb"))

const app = express()

const favorites = []
const breakfast = []
const lunch = []
const dinner = []

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended : false}))
app.use(cors())


app.post('/addfavorites', function (req, res) {
    favorites.push(req.body)
    res.redirect('/addfavorites')
})
app.get('/addfavorites', function (req, res) {
    res.send(favorites)
})


app.post('/addbreakfast', function (req, res) {
    breakfast.push(req.body)
    res.redirect('/addbreakfast')
})
app.get('/addbreakfast', function (req, res) {
    res.send(favorites)
})


app.post('/addlunch', function (req, res) {
    lunch.push(req.body)
    res.redirect('/addlunch')
})
app.get('/addlunch', function (req, res) {
    res.send(favorites)
})


app.post('/adddinner', function (req, res) {
    dinner.push(req.body)
    res.redirect('/adddinner')
})
app.get('/adddinner', function (req, res) {
    res.send(favorites)
})


app.listen(PORT, async () => {
    console.log(`Now listening on port: ${PORT}`);
})