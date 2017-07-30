const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Schema = mongoose.Schema;

const app = express();
app.use(cors())
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

const MONGO_USER = "REDACTED";
const MONGO_PWD = "REDACTED"
const MONGODB_CONNECTION_STRING = "mongodb://" + MONGO_USER + ":" + MONGO_PWD + "@ds127883.mlab.com:27883/act-about-db";

mongoose.connect(MONGODB_CONNECTION_STRING, {useMongoClient: true});

// go up to 200km from our location, for demo purposes
const MAX_DISTANCE_METRES = 200000;

const ActAbout = mongoose.model('ActAbout', new Schema(), 'act_about');

function welcome(req, res) {
    res.send("welcome to ACT About!");
}

// perform search

function search(req, res, next) {
    const { lng, lat, category, type } = req.body;

    console.log("long: ", lng," lat: ", lat," category: " + category, " type: ", type);

    // longitude & latitude are mandatory
    if (!(lng && lat)) {
        res.status(400);
        res.search("Invalid request");
    }

    if (category && type) {
        ActAbout.geoNear(
            [ parseFloat(lng), parseFloat(lat)],
            { maxDistance: MAX_DISTANCE_METRES, 
                spherical: true,
                query: {
                    category: category,
                    type: type
                } 
            },
        ).then(results => {
                console.log('resultsize: ', results.length);
                res.send(results);

        }).catch(next);
    } else if (category) {
        // there has to be a neater way of handling dynamic filters in mongoose
        // but this has to do for now
        ActAbout.geoNear(
            [ parseFloat(lng), parseFloat(lat)],
            { maxDistance: MAX_DISTANCE_METRES, 
                spherical: true,
                query: {
                    category: category
                } 
            },
        ).then(results => {
                console.log('resultsize: ', results.length);
                res.send(results);

        }).catch(next);

    } else if (type) {
        ActAbout.geoNear(
            [ parseFloat(lng), parseFloat(lat)],
            { maxDistance: MAX_DISTANCE_METRES, 
                spherical: true,
                query: {
                    type: type
                } 
            },
        ).then(results => {
                console.log('resultsize: ', results.length);
                res.send(results);

        }).catch(next);

    } else {
        res.status(400);
        res.send("invalid request");
    }
}



// show item
function displayItem(req, res, next) {
    const itemId = req.params.id;
    ActAbout.findById({_id:itemId})
    .then(item => {
        res.send(item);
    })
    .catch(next);

}

app.get("/", welcome);
app.get("/welcome", welcome);
app.post("/search", search);
app.get("/item/:id", displayItem);



app.use((err, req, res, next) => {
	console.log(err);
	res.send({ error: err.message });
	next();
});


app.listen(5000, () => {
	console.log("Server listening on post 5000");
});

