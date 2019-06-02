// Reads and sets any environment variables with the dotenv package
require("dotenv").config();

// Import api keys
const keys = require("./keys.js");
// Access keys information like so: const spotify = new Spotify(keys.spotify);

const inquirer = require("inquirer");
const axios = require("axios");

// Four main function definitions
function movieThis(searchTerms) {
    // In case no movie is searched, search for Mr. Nobody
    if (searchTerms === "") {
        queryURL = "http://www.omdbapi.com/?t=" + "Mr.Nobody" + "&y=&plot=short&apikey=trilogy"
    } else {
        queryURL = "http://www.omdbapi.com/?t=" + searchTerms + "&y=&plot=short&apikey=trilogy"
    };

    // OMDB API request via axios
    axios.get(queryURL).then(function(response) {
        console.log("------------------------------------------------");
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
            movieThis(resp.movie);
        });
    } else if (resp.entertainmentChoice === "Songs") {
        console.log("searching songs");
    } else if (resp.entertainmentChoice === "Bands") {
        console.log("searching bands");
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