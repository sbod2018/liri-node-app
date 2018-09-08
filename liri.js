require("dotenv").config();
//console.log(process.env.GREETING)
//console.log(process.env.SPOTIFY_ID)
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let request = require("request");

let spotify = new Spotify(keys.spotify);

// let omdb = new Omdb(key)

let command = process.argv[2].toLowerCase();
let userSearch = process.argv
.slice(3)
.join(" ")
.toLowerCase();

const spotifyThis = function(songTitle){
    if (songTitle.length == 0){
        songTitle = "the sign"
    }
    spotify.search({ type: 'track', query:songTitle, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(JSON.stringify(data, null, 2)); 
      console.log(
          `\nArtist: ${data.tracks.items[0].artists[0].name}\nAlbum: ${data.tracks.items[0].album.name}\nSong Name: ${songTitle}\n 
          Spotify Link: ${data.tracks.items[0].album.artists[0].external_urls.spotify}\n`);
      });

};

const commandSwitch = function(com, search){
    switch (com){
        case "spotify-this-song":
        spotifyThis(search);
        break;

        case "movie-this":
        movieThis(search);
        break;

        case "concert-this":
        consertThis(search);
        break;

        case "do-what-it-says":
        doWhatItSays();
        break;
    }
};

const movieThis = function(movieTitle){
    movieTitle = movieTitle.replace(/\s/g, "+").replace(/\./g,"");
    console.log(`\nYou searched ${userSearch}`);

    if (movieTitle.length == 0){
        movieTitle = "mr+nobody";
    }


let queryUrl = `http://www.omdbapi.com/?t=${movieTitle}&apikey=${keys.omdb}`;

request(queryUrl, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body);

});
};

commandSwitch(command, userSearch);


