// Reads and sets any environment variables with the dotenv package
require("dotenv").config();

// Import spotify api key
const keys = require("./keys.js");

// Import npm packages
const inquirer = require("inquirer");

// Four main function definitions
function movieSearch(searchTerms) {
    const axios = require("axios");
    
    // In case no movie is searched, search for Mr. Nobody
    if (searchTerms === "") {
        queryURL = "http://www.omdbapi.com/?t=" + "Mr.Nobody" + "&y=&plot=short&apikey=trilogy"
    } else {
        queryURL = "http://www.omdbapi.com/?t=" + searchTerms + "&y=&plot=short&apikey=trilogy"
    };

    // OMDB API request via axios
    axios.get(queryURL).then(function(response) {
        console.log("\n------------------OMDB Info------------------");
        console.log("Title:           " + response.data.Title);
        console.log("Rated:           " + response.data.Rated);
        console.log("Runtime:         " + response.data.Runtime);
        console.log("Released on:     " + response.data.Released)
        console.log("Director:        " + response.data.Director);
        console.log("Starring:        " + response.data.Actors);
        console.log("Country:         " + response.data.Country);
        console.log("Language(s):     " + response.data.Language);
        console.log("IMDB score:      " + response.data.imdbRating);
        console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
        console.log(" *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *")
        console.log(response.data.Plot);
        console.log(" *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *");
        console.log("------------------------------------------------");
        }).catch(function(error) {
            if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
            } else if (error.request) {
            // If the request was made but no response was received
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            }
            console.log(error.config);
        });
};

function spotifySearch(searchTerms) {
    const Spotify = require("node-spotify-api");
    const spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });
    
    // In case no movie is searched, search for Mr. Nobody
    if (searchTerms === "") {
        searchTerms = "the sign ace of base";
    };
        
    spotify.search({ type: 'track', query: searchTerms }).then(function(response) {
    data = response.tracks.items;

    console.log("\n**************Top 5 Spotify Results**************")
    for (i = 0; i < 5; i < i++) {
        console.log("\n---------------Result " + (i + 1) + "------------------");
        console.log("Title: " + data[i].name);
        console.log("Artist: " + data[i].artists[0].name);
        console.log("Album: " + data[i].album.name);
        console.log("Album spotify link: " + data[i].album.external_urls.spotify);
        console.log("------------------------------------------------");
    }

  }).catch(function(err) {
    console.log(err);
  });
};

function bandSearch(searchTerms) {
    const axios = require("axios");

    if (searchTerms === "") {
        queryURL = "https://rest.bandsintown.com/artists/" + "M. Ward" + "/events?app_id=codingbootcamp";
    } else {
        queryURL = "https://rest.bandsintown.com/artists/" + searchTerms + "/events?app_id=codingbootcamp";
    };

    axios.get(queryURL).then(function(response) {
        
        if (response.data.length === 0) {
            console.log("No upcoming concerts!")
        } else {
            for (i = 0; i < response.data.length; i ++) {
            console.log("\n--------------------Concert " + (i + 1) + "-------------------");
            console.log("Performers: " + response.data[i].lineup.join(", "));
            console.log("Venue: " + response.data[i].venue.name);
                if (response.data[i].venue.region){
                    console.log("Location : " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                } else {
                    console.log("Location : " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                };
            console.log("Time: " + response.data[i].datetime); //use moment to format this as "MM/DD/YYYY")   
            console.log("------------------------------------------------");
            }
        };
        }).catch(function(error) {
            if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
            } else if (error.request) {
            // If the request was made but no response was received
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            };
            console.log(error.config);
        });
};

// Processing user input
inquirer.prompt([
    {
        type: "list",
        message: "What sort of entertainment would you like to search?",
        choices: ["Movies", "Songs", "Bands", "Load .txt file"],
        name: "entertainmentChoice"
    }
]).then(function(resp) {
    if(resp.entertainmentChoice === "Movies") {
        inquirer.prompt([
            {
                type: "input",
                message: "Which movie are you interested in?",
                name: "movie"
            }
        ]).then(function(resp) {
            movieSearch(resp.movie);
        });
    } else if (resp.entertainmentChoice === "Songs") {
        inquirer.prompt([
            {
                type: "input",
                message: "Which song are you interested in?",
                name: "song"
            }
        ]).then(function(resp) {
            spotifySearch(resp.song);
        });
    } else if (resp.entertainmentChoice === "Bands") {
        inquirer.prompt([
            {
                type: "input",
                message: "Which band are you interested in?",
                name: "band"
            }
        ]).then(function(resp) {
            bandSearch(resp.band);
        });
    } else if (resp.entertainmentChoice === "Load .txt file") {
        console.log("Do what it says");
    };
});


// let input = process.argv;
// let searchTerms = "";
// for (var i = 3; i < input.length; i++) {
//     if (i > 3 && i < input.length) {
//       searchTerms = searchTerms + "+" + input[i];
//     } else {
//       searchTerms += input[i];
//     }
//   };