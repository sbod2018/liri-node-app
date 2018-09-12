require("dotenv").config();
//console.log(process.env.GREETING)
//console.log(process.env.SPOTIFY_ID)
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let request = require("request");
let moment = require("moment");
let spotify = new Spotify(keys.spotify);
let fs = require("fs");

// let omdb = new Omdb(key)

let command = process.argv[2].toLowerCase();
let userSearch = process.argv
    .slice(3)
    .join(" ")
    .toLowerCase();

const spotifyThis = function (songTitle) {
    if (songTitle.length == 0) {
        songTitle = "the sign"
    }
    spotify.search({ type: 'track', query: songTitle, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //console.log(JSON.stringify(data, null, 2));
        console.log(
            `\nArtist: ${data.tracks.items[0].artists[0].name}\nAlbum: ${data.tracks.items[0].album.name}\nSong Name: ${songTitle}\n 
          Spotify Link: ${data.tracks.items[0].album.artists[0].external_urls.spotify}\n`);
    });

};

const commandSwitch = function (com, search) {
    switch (com) {
        case "spotify-this-song":
            spotifyThis(search);
            break;

        case "movie-this":
            movieThis(search);
            break;

        case "concert-this":
         concertThis(search);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    }
};

const movieThis = function (movieTitle) {
    movieTitle = movieTitle.replace(/\s/g, "+").replace(/\./g, "");
    console.log(`\nYou searched ${userSearch}`);

    if (movieTitle.length == 0) {
        movieTitle = "mr+nobody";
    }


    let queryUrl = `http://www.omdbapi.com/?t="${movieTitle}&y=&plot=short&apikey=${keys.omdb}`;

    request(queryUrl, function (error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log(JSON.parse(body))
            console.log("Title:" + JSON.parse(body).Title);
            console.log("Year:" + JSON.parse(body).Year);
            console.log(
                JSON.parse(body).Ratings[0].Source + ": " + JSON.parse(body).Ratings[0].Value);
            console.log(
                JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value);
            console.log("Produced In: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);


        }

    });
};

let concertThis = function (artist) {
    artist.replace(/\s/g, "+")
        .replace(/\./g, "+")
        .replace(/\//g, "%252F")
        .replace(/\?/g, "%253F")
        .replace(/\*/g, "%252A")
        .replace(/\"/g, "%27C");
    console.log(`\nYou Searched ${userSearch}`);

    if (artist.length == 0) {
        artist = "acrania";
    }

    let queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${keys.bandsInTown}`;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200){
            //console.log(JSON.parse(body))

            JSON.parse(body).forEach(element => {
                console.log(`\nVenue: ${element.venue.name}`);
                console.log(`Location: ${element.venue.city}`);
                console.log(`Date: ${moment(element.datetime, "YYYY-MM-DD").format("L")}`);
            });
            
        }
    });

}

let doWhatItSays = function(){
    fs.readFile('random.txt', 'utf8', function(err,data){
        if (err){
            return console.log(err);
        }
        data = data.split(",");
        spotifyThis(data[1]);
        console.log(data[1]);
        })
};


commandSwitch(command, userSearch);


