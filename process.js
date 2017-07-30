var fs = require('fs');

let jsonData = require('/Users/elvalencia/Development/govhack/dataset/act_about.json');

let newJsonData = jsonData.map(function(document) {

    // console.log(document);

// console.log(document.type +  " / " + document.longitude);

    // some records don't have lat long
    // may have to enhance them later if have suburb info - or leave them out if schools
    if (document.hasOwnProperty('longitude') && document.hasOwnProperty('latitude')) {
        var coordLong = parseFloat(document.longitude);
        var coordLat = parseFloat(document.latitude);

        var locationObj = {
                type: "Point",
                coordinates: [coordLong, coordLat]       
        };

        document.location = locationObj;
    }

// dont remove. just allows us to make sure we didnt screw up the order
// mongodb wants them in long,lat order 
//    delete document["latitude"];
//    delete document["longitude"];

   return document;
});

// console.log(newJsonData);


let savePath = '/Users/elvalencia/Development/govhack/dataset/act_about_pointed.json';

fs.writeFile(savePath, JSON.stringify(newJsonData), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});