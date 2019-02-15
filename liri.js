
var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");


var pounds = "#######################################";

var group = process.argv[2];
var searchTerms = process.argv;
var endSearch = "";
for (var i = 3; i < searchTerms.length; i++) {

    if (i > 3 && i < searchTerms.length) {
      endSearch = endSearch + "+" + searchTerms[i];
    }
    else {
      endSearch += searchTerms[i];
  
    }
  }

//movie search
 function OMDBApi(){
    var movieUrl = "http://www.omdbapi.com/?t=" + endSearch + "&y=&plot=long&apikey="+keys.OMDB.id;
    axios.get(movieUrl).then(
        function(response) {
            // console.log(response)
          console.log(`${pounds}\nTitle: ${response.data.Title}\nRated: ${response.data.Rated}\nRelease Year: ${response.data.Year}\nIMDB Rating: ${response.data.imdbRating}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}`);
        }
      );
}
//spotify function
function spotifyApi(){
    
    spotify.search({ type: 'track', query: endSearch, limit: 1}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //logs out results
        console.log(pounds);
        console.log("Artist: "+JSON.stringify(data.tracks.items[0].album.artists[0].name,null,2).replace(/"/g,"")); 
        console.log("Track Name: "+JSON.stringify(data.tracks.items[0].name,null,2).replace(/"/g,"")); 
        console.log("Album: "+JSON.stringify(data.tracks.items[0].album.name,null,2).replace(/"/g,"")); 
        console.log("Popularity out of 100: "+JSON.stringify(data.tracks.items[0].popularity,null,2)); 
        console.log("Preview Here: "+JSON.stringify(data.tracks.items[0].preview_url,null,2).replace(/"/g,"")); 
      });

}
//Api for bands in town
function bandsInTownApi(){
    var bandUrl = "https://rest.bandsintown.com/artists/" + endSearch + "/events?app_id="+keys.bandsInTown.id;
    axios.get(bandUrl).then(
        function(response) {
            // log band response
            console.log("Venue: "+JSON.stringify(response.data[0].venue.name,null,2).replace(/"/g,""));
            console.log("Venue Location: "+JSON.stringify(response.data[0].venue.city +", "+response.data[0].venue.region,null,2).replace(/"/g,""));
            // moments to display time
            var time = response.data[0].datetime;
            var bandDate = moment(time).format("dddd, MMMM Do YYYY, h:mm:ss a");
            console.log(bandDate); 
        }
      );
}
function doIt(){
    var textFile = fs.readFileSync("./random.txt","utf8").split(",",2);

    endSearch = textFile[1].replace(/"/g,"");
    console.log(endSearch);
    spotifyApi();
}
//checks to see which search to use
if (group == "movie-this") {
    OMDBApi();
}
if (group == "spotify-this-song"){
    spotifyApi();
}
if (group == "concert-this"){
    bandsInTownApi();
}
if (group == "do-what-it-says") {
    doIt();
}
