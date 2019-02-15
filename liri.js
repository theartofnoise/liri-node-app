
var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");
var currentDate = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

var pounds = "\n#######################################";

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
     if (endSearch == false) {
         endSearch = "Mr+Nobody";
     }
    var movieUrl = "http://www.omdbapi.com/?t=" + endSearch + "&y=&plot=long&apikey="+keys.OMDB.id;
    axios.get(movieUrl).then(
        function(response) {
            // console.log(response)
            var movieResponse = `${pounds}\nTitle: ${response.data.Title}\nRated: ${response.data.Rated}\nRelease Year: ${response.data.Year}\nIMDB Rating: ${response.data.imdbRating}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}`
            //returns response
          console.log(movieResponse);
          //appends to log.txt
          fs.appendFileSync("./log.txt", movieResponse+"\nTime Searched: "+currentDate);
        }
      );
}
//spotify function
function spotifyApi(){
    if (endSearch == false) {
        endSearch = "the sign ace of base";
    }
    spotify.search({ type: 'track', query: endSearch, limit: 1}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //logs out results
        var songData = `${pounds}\nArtist: ${JSON.stringify(data.tracks.items[0].album.artists[0].name,null,2).replace(/"/g,"")}\nTrack Name: ${JSON.stringify(data.tracks.items[0].name,null,2).replace(/"/g,"")}\nAlbum: ${JSON.stringify(data.tracks.items[0].album.name,null,2).replace(/"/g,"")}\nPopularity out of 100: ${JSON.stringify(data.tracks.items[0].popularity,null,2)}\nPreview Here: ${JSON.stringify(data.tracks.items[0].preview_url,null,2).replace(/"/g,"")}`;

        console.log(songData);
        // appends search to log
        fs.appendFileSync("./log.txt", songData+"\nTime Searched: "+currentDate);

      });

}
//Api for bands in town
function bandsInTownApi(){
    if (endSearch == false) {
        endSearch = "bOunce";
    }
    var bandUrl = "https://rest.bandsintown.com/artists/" + endSearch + "/events?app_id="+keys.bandsInTown.id;
    axios.get(bandUrl).then(
        function(response) {
            // log band response
            console.log(pounds);
            var bandVenue = "Next Show Location: "+JSON.stringify(response.data[0].venue.name,null,2).replace(/"/g,"");
            var venueLoc = "Where: "+JSON.stringify(response.data[0].venue.city +", "+response.data[0].venue.region,null,2).replace(/"/g,"");
            // moments to display time
            var time = response.data[0].datetime;
            var bandDate = "When: "+moment(time).format("dddd, MMMM Do YYYY, h:mm:ss a");
            console.log(`Band: ${endSearch}\n${bandVenue}\n${venueLoc}\n${bandDate}`);
            //go to log.txt
            fs.appendFileSync("./log.txt", `${pounds}\nBand: ${endSearch}\n${bandVenue}\n${venueLoc}\n${bandDate}\nTime Searched: ${currentDate}`);
            
        }
      );
}
// reads random.txt andsends it through spotify
function doIt(){
    //making it readable
    var textFile = fs.readFileSync("./random.txt","utf8").split(",",2);

    endSearch = textFile[1].replace(/"/g,"");
    console.log(endSearch);
    spotifyApi();
}
//checks to see which search to use
switch(group) {
    case "movie-this":
        OMDBApi();
      break;
    case "spotify-this-song":
        spotifyApi();
      break;
    case "concert-this":
        bandsInTownApi();
      break;
    case "do-what-it-says":
        doIt();
      break;
    default:
      console.log("error 666: wrong input")
  }

  // check out more at https://theartofnoise.github.io/Bootstrap-Portfolio/
