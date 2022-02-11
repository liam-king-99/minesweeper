const clockRoute = require("./clock")
const minesweeperRoute = require("./minesweeper")
const path = require('path')

const constructorMethod = app => {
  app.get("/", (req, res) => {
    res.render('layouts/home', {
      title: 'Home'
    })
  })
  app.use("/clock", clockRoute)
  app.use("/minesweeper", minesweeperRoute)
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" })
  })
}

module.exports = constructorMethod