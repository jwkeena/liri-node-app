// Reads and sets any environment variables with the dotenv package
require("dotenv").config();

// Import spotify api key
const keys = require("./keys.js");

// Import packages
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

// Four main function definitions
function movieSearch(searchTerms) {
    
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

        // Log query to txt file
        let text = "\r\nmovie-search," + '"' + searchTerms + '";';
        fs.appendFile("savedsearches.txt", text, function (err) {
            if (err) {
                console.log("Search not saved to .txt file");
                console.log(err);
            } else {
                console.log("Search saved!");
            }
        });

        searchAgain();
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
            searchAgain();
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

    console.log("\n**************Top 3 Spotify Results**************")
    // Run loop backwards to see top result first in terminal
    for (i = 2; i >= 0; i < i--) {
        console.log("\n---------------Result " + (i + 1) + "------------------");
        console.log("Title: " + data[i].name);
        console.log("Artist: " + data[i].artists[0].name);
        console.log("Album: " + data[i].album.name);
        console.log("Album spotify link: " + data[i].album.external_urls.spotify);
        console.log("------------------------------------------------");
    };

    // Log query to txt file
    let text = "\r\nspotify-search," + '"' + searchTerms + '";';
    fs.appendFile("savedsearches.txt", text, function (err) {
        if (err) {
            console.log("Search not saved to .txt file");
            console.log(err);
        } else {
            console.log("Search saved!");
        }
    });
    searchAgain();

    }).catch(function(err) {
        console.log(err);
        searchAgain();
    });
};

function bandSearch(searchTerms) {

    if (searchTerms === "") {
        queryURL = "https://rest.bandsintown.com/artists/" + "M. Ward" + "/events?app_id=codingbootcamp";
    } else {
        queryURL = "https://rest.bandsintown.com/artists/" + searchTerms + "/events?app_id=codingbootcamp";
        console.log(queryURL)
    };

    axios.get(queryURL).then(function(response) {

        if (response.data.length === 0) {
            console.log("No upcoming shows!");
        } else {

            for (i = response.data.length - 1; i >= 0; i--) {
            console.log("\n---------------------Show " + (i + 1) + "-------------------");
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

            // Log query to txt file
            let text = "\r\nband-search," + '"' + searchTerms + '";';
            fs.appendFile("savedsearches.txt", text, function (err) {
                if (err) {
                    console.log("Search not saved to .txt file");
                    console.log(err);
                } else {
                    console.log("Search saved!");
                }
            });
                searchAgain();
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
            searchAgain();
        });
};

function readFile(searchTerms) {
    const fs = require("fs");

    if (searchTerms === "") {
        searchTerms = "savedsearches.txt";
    }

    fs.readFile(searchTerms, "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        } else {
            let dataArr = data.split(";");
            
            // Format the array with no line breaks in bash by removing all line and space breaks
            formattedDataArr = [];

            for (i = 0; i < dataArr.length; i += 2) {
                formattedDataArr.push(dataArr[i].trim());
                formattedDataArr.push(dataArr[i + 1].trim());
            }
            
            inquirer.prompt([
                {
                    type: "list",
                    message: "What sort of entertainment would you like to search?",
                    choices: formattedDataArr, // Pass all arguments in the .txt file to inquirer as choices
                    name: "entertainmentChoice"
                }

            ]).then(function(resp) {

                // Present all choices in the text file as choices for searching
                newCommandArr = resp.entertainmentChoice.split(",");

                if (newCommandArr[0] === "spotify-search") {
                    spotifySearch(newCommandArr[1]);
                } else if (newCommandArr[0] === "movie-search") {
                    movieSearch(newCommandArr[1]);
                } else if (newCommandArr[0] === "band-search") {
                    // Remove quotation marks from string or the bands in town API won't accept it
                    band = newCommandArr[1].replace(/['"]+/g, '')
                    bandSearch(band);
                };
            });
        };
    });
};

// Processing user input
function askForInput() {
    inquirer.prompt([
        {
            type: "list",
            message: "What sort of entertainment would you like to search?",
            choices: ["Movies", "Songs", "Bands", "Read file"],
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
                    message: "Which band or act are you interested in?",
                    name: "band"
                }
            ]).then(function(resp) {
                bandSearch(resp.band);
            });
        } else if (resp.entertainmentChoice === "Saved searches") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What would you like to search again?",
                    name: "file"
                }
            ]).then(function(resp) {
                readFile(resp.file);
            });
        };
    });
}

function searchAgain() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to search again?",
            name: "searchAgain"
        }
    ]).then(function(resp) {
        if(resp.searchAgain) {
            askForInput();
        } else {
            return;
        }
    })
}

askForInput();