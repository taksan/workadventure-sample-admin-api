const express  = require("express")
const cors = require('cors')
const app      = express()
const wokaList   = require('./woka.json')
const companions = require("./companions.json")

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

app.use(cors())

app.use(express.static('public'))

app.get("/api/capabilities", (req, res) => {
    res.send({
        "api/companion/list": "v1"
    })
})

app.get("/api/companion/list", (req, res) => {
    res.send(companions)
})

app.get("/api/map", (req, res) => {
    console.debug("Receive map request with parameters:", req.query)

    res.send(JSON.stringify({
        mapUrl : "https://taksan.github.io/workadventure-map-starter-kit/map.json",
        group : "wa",
        authenticationMandatory: false,
        redirectUrl: null,
        mucRooms: null
    }
    ))
})

app.get("/api/woka/list", (req, res) => {
    // You receive the userId 
    res.send(wokaList)
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
            anonymous: false,
            mucRooms: [{ name: "Connected Users", type: "default", "url": req.query.playUri }]
        }
    )
})


app.get("*", (req, res) => {
    console.debug("Request not handled:", req.url)
    console.debug(req.method)
    console.debug(req.query)

    res.send("{}")
})

const ADMIN_URL = process.env.ADMIN_URL

app.listen(8080, ()=> {

    companions.push({
        name: "extra",
        "textures": [
            {
                "name": "blauhai3.png",
                "img": `${ADMIN_URL}/companions/blauhai3.png`
            },
            {
                "name": "Smiley.png",
                "img": `${ADMIN_URL}/companions/Smiley.png`
            }
        ]
    })
    wokaList["woka"]["collections"].push({
        "name": "extra",
        "position": 1,
        "textures": [
            {
                "id": "pipo-nekonin001",
                "name": "pipo-nekonin001",
                "url": `${ADMIN_URL}/wokas/pipo-nekonin001.png`,
                "position": 0
            }
        ]
    })

    wokaList["hair"]["collections"].push({
        "name": "extra",
        "position": 1,
        "textures": [
            {
                "id": "samurai-dark",
                "name": "samurai-dark",
                "url": `${ADMIN_URL}/hair/_samurai_dark.png`,
                "position": 0
            },
            {
                "id": "samurai-white",
                "name": "samurai-white",
                "url": `${ADMIN_URL}/hair/_samurai_white.png`,
                "position": 1
            }
        ]
    })
})