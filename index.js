const express           = require("express")
const app               = express()
const wokaList          = require('./woka.json')
const availableWokas    = require('./availableWorks.json')


app.get("/api/map", (req, res) => {
    console.debug("Receive map request with parameters:", req.query)

    res.send(JSON.stringify({
        mapUrl : "http://maps.localtest.me/starter/map.json",
        group : "wa",
        authenticationMandatory: true
    }
    ))
})

app.get("/api/woka/list", (req, res) => {
    res.send(wokaList)
})

app.get("/api/room/access", (req, res) => {
    console.debug(req.query)
    res.send(JSON.stringify(
        {
            email: "foo@good",
            userUuid: req.query.userIdentifier,
            tags: ["user"],
            visitCardUrl: null,
            textures: availableWokas,
            messages:[],
            anonymous: false
        }
    ))
})


app.get("*", (req, res) => {
    console.debug(req.method)
    console.debug(req.url)
    console.debug(req.body)
    res.send("{}")
})

app.listen(8080)