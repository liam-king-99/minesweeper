const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('layouts/clock', {
        title: 'Clock'
    })
    return
})

router.get('/public/react/clock.jsx', (req, res) => {
    res.sendFile("../public/react/clock.jsx")
    return
})

module.exports = router