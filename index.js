const express           = require("express")
const app               = express()
const wokas          = require('./woka.json')

function getAllTextures() {
    let wokas = []
    Object.keys(wokaList).forEach(groupName => {
        let group = wokaList[groupName]
        group.collections.forEach(collection => {
            collection.textures.forEach(texture => {
                wokas.push({
                    id: texture.id,
                    url: texture.url,
                    layer: groupName
                })
            })
        })
    })
    return wokas
}

app.get("/api/map", (req, res) => {
    console.debug("Receive map request with parameters:", req.query)

    res.send(JSON.stringify({
        mapUrl : "http://maps.localtest.me/starter/map.json",
        group : "wa",
        authenticationMandatory: false
    }
    ))
})

app.get("/api/woka/list", (req, res) => {
    // You receive the userId 
    res.send(wokas)
})

app.get("/api/room/access", (req, res) => {
    let characterLayers = req.query.characterLayers || []

    // Notice that we filter the textures based on the user selection (given on characterLayers)
    let textures = getAllTextures().filter(woka => characterLayers.indexOf(woka.id) !== -1)

    // make sure to preserve the texture order (given on characterLayers)
    textures.sort( (t1, t2) => characterLayers.indexOf(t1.id) - characterLayers.indexOf(t2.id) )
    res.send(
        {
            email: "someuser@iamokay",
            userUuid: req.query.userIdentifier,
            tags: ["user"],
            visitCardUrl: `http://alink-to-the-user-profile.cool?user=${req.query.userIdentifier}`,
            textures: textures,
            messages:[],
            anonymous: false
        }
    )
})


app.get("*", (req, res) => {
    console.debug("Request not handled:", req.url)
    console.debug(req.method)
    console.debug(req.query)
    res.send("{}")
})

app.listen(8080)