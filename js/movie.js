const API_KEY = '55c1f2841989ee54cc3a9b0fc3e02aaf';
const genresMap = new Map();
let dbRefObject;
let MOVIE;
let isFavourite = false;
let currentMovieID;
let checkedMovies = new Array();

function userIsLoggedIn() {

    document.getElementById("user_displayname").innerHTML = localStorage.getItem("userDisplayName");
    document.getElementById("userLoggedIn").style.display = 'block';
    document.getElementById("userNotLoggedIn").style.display = 'none';
}

function userIsNotLoggedIn() {
    document.getElementById("userLoggedIn").style.display = 'none';
    document.getElementById("userNotLoggedIn").style.display = 'block';
    document.getElementById("btn_toggleFavourite").style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("userLoggedIn")) {
        userIsLoggedIn();
    }
    else {
        userIsNotLoggedIn();
    }

    getGenres();
    loadMovie();
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
        } else {
            // User is signed out
            localStorage.clear();
            userIsNotLoggedIn();
        }
    });

    if (localStorage.getItem("userLoggedIn")) {
        dbRefObject = firebase.database().ref(`favouriteMovies/${localStorage.getItem("userUID")}`);

        dbRefObject.on('value', function (snapshot) {
            isFavourite = false;

            for (index in snapshot.val()) {

                if (currentMovieID == index) {
                    isFavourite = true;
                }
            }

            if (isFavourite) {
                document.getElementById("btn_toggleFavourite").innerHTML = "Remove from watch list";
            }
            else {
                document.getElementById("btn_toggleFavourite").innerHTML = "Add to watch list";
            }
            document.getElementById("btn_toggleFavourite").style.display = 'block';
        })
    }

    document.getElementById("btn_Login").addEventListener('click', function () {

        history.pushState("temp data 1", "", "movie.html");
        window.location.replace("login.html");
    })

    document.getElementById("navbar_title").addEventListener('click', function () {
        window.location.replace("index.html");
    })


    document.getElementById("btn_toggleFavourite").addEventListener('click', function () {
        if (isFavourite) {
            dbRefObject.child(currentMovieID).remove();
        }
        else {
            dbRefObject.child(currentMovieID).set(MOVIE);
        }
    })

    document.getElementById("btn_Signout").addEventListener('click', function () {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
            alert(error);
        });
    })


})

function getGenres() {

    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(data => {
            for (let i in data.genres) {
                genresMap.set(data.genres[i].id, data.genres[i].name);
            }
        })
        .catch(error => {
            alert(error);
        })

}

function loadMovie() {
    fetch(`https://api.themoviedb.org/3/movie/${currentMovieID}?api_key=${API_KEY}&append_to_response=videos`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(movie => {

            MOVIE = movie;
            document.getElementById("movieTitle").innerHTML = movie.title;
            if (movie.poster_path != null) {
                document.getElementById("moviePoster").innerHTML = `<img class="img-fluid" alt="${movie.title}" src=https://image.tmdb.org/t/p/w300${movie.poster_path} loading="lazy">`;
            }
            document.getElementById("movieOverview").innerHTML = `Overview: ${movie.overview}`;
            document.getElementById("movieGenres").innerHTML = `Genres: ${decodeGenres(movie.genres)}`;
            document.getElementById("movieAverageVote").innerHTML = `Average vote: ${movie.vote_average}`;
            document.getElementById("movieReleaseDate").innerHTML = `Release date: ${formatDate(movie.release_date)}`;
            if (movie.videos.results[0] != null) {
                document.getElementById("movieTrailer").setAttribute("src", `https://www.youtube.com/embed/${movie.videos.results[0].key}`);
            }
            else {
                document.getElementById("movieTrailerDiv").style.display = 'none';
            }
            getSimilarMovies();
        })
        .catch(error => {
            alert(error);
        })

}

function decodeGenres(genres) {
    let decodedGenres = "";

    for (let index in genres) {
        let genreName = genresMap.get(genres[index].id);
        decodedGenres += genreName;
        if (index < genres.length - 1) {
            decodedGenres += ", ";
        }
    }

    return decodedGenres;
}

function formatDate(date) {
    let options = { year: 'numeric', month: 'long' };
    let formatedDate = new Date(date).toLocaleDateString("en-US", options);
    return formatedDate;
}

function getSimilarMovies() {
    fetch(`https://api.themoviedb.org/3/movie/${currentMovieID}/similar?api_key=${API_KEY}&language=en-US&page=1`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(similarMovies => {

            if (similarMovies.results != "") {
                document.getElementById("similarMoviesLabel").innerHTML = "Similar movies";
                let html = '';
                for (let i in similarMovies.results) {
                    html += `<a href="movie.php?id=${similarMovies.results[i].id}"><div class="similarMovie m-2" onclick="showMovieDetails(${similarMovies.results[i].id})">`;
                    if (similarMovies.results[i].poster_path != null) {
                        html += `<img class="similarMovie_poster" alt="${similarMovies.results[i].title}" src=https://image.tmdb.org/t/p/w200${similarMovies.results[i].poster_path} loading="lazy">`;
                    }
                    else {
                        html += `<img class="similarMovie_poster" alt="${similarMovies.results[i].title}" src="../img/image_not_found.png" style="width:100%; object-fit : cover; object-position: 50%" loading="lazy">`;
                    }
                    html += `<div class="similarMovie_title"> ${similarMovies.results[i].title}</div></div>`;
                }

                document.getElementById("similarMovies").innerHTML = html;
            }
            else {
                document.getElementById("similarMoviesLabel").style.display = 'none';
                document.getElementById("similarMovies").style.display = 'none';
            }

        })
        .catch(error => {
            alert(error);
        })

}

function setMovieID(movieID) {
    currentMovieID = movieID
}