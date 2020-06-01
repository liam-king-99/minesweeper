const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('layouts/minesweeper', {
        title: 'Minesweeper'
    })
    return
})

router.get('/public/react/minesweeper.jsx', (req, res) => {
    res.sendFile("../public/react/minesweeper.jsx")
    return
})

router.get('/public/css/styles.css', (req, res) => {
    res.sendFile("../public/css/styles.css")
    return
})

module.exports = router