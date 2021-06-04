let dbRefObject;

function userIsLoggedIn() {
    document.querySelector("#user_displayname").innerHTML = localStorage.getItem("userDisplayName")
    document.querySelector("#userLoggedIn").style.display = "block"
    document.querySelector("#userNotLoggedIn").style.display = "none"
}

function userIsNotLoggedIn() {
    document.querySelector("#userLoggedIn").style.display = "none"
    document.querySelector("#userNotLoggedIn").style.display = "block"
}

document.addEventListener('DOMContentLoaded', (event) => {

    document.querySelector("#savedMovies").style.display = "none"
    if (localStorage.getItem("userLoggedIn")) {
        userIsLoggedIn()
    }
    else {
        userIsNotLoggedIn()
    }
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
        } else {
            // User is signed out
            localStorage.clear()
            window.location.replace("index.html")
            userIsNotLoggedIn()
        }
    });

    dbRefObject = firebase.database().ref(`favouriteMovies/${localStorage.getItem("userUID")}`);

    dbRefObject.on('value', function (snapshot) {
        renderSavedMoviesIntoHTML(snapshot.val())
        document.querySelector("#loader").style.display = "none"
        document.querySelector("#savedMovies").style.display = "grid"
    })

    document.querySelector("#navbar_title").addEventListener("click", event => {
        event.preventDefault()
        location.reload()
    })

    document.querySelector("#btn_Signout").addEventListener("click", event => {
        event.preventDefault()
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            localStorage.clear()
            window.location.replace("index.html")
            userIsNotLoggedIn()
        }).catch((error) => {
            // An error happened.
            alert(error)
        });
    })

    document.querySelector("#btn_discoverMovies").addEventListener("click", event => {
        event.preventDefault()
        window.location.replace("index.html")
    })

})

function renderSavedMoviesIntoHTML(movies) {
    var html = ''
    console.log(movies)
    if (movies != null) {
        for (let [key, movie] of Object.entries(movies)) {
            html += `<div class="savedMovie m-2">
                        <div class="savedMovieTitle p-1">${movie.title}</div>
                        <img class="savedMoviePoster" alt="${movie.title}" src="https://image.tmdb.org/t/p/w300${movie.poster_path}" onclick="showMovieDetails(${movie.id})"><br>
                        <button class="button m-2" onclick="removeMovieFromList(${movie.id})">Remove from watch list</button>
                    </div>`
        }
    }
    else {
        html += '<div class="display-5 text-center m-2">Your saved movies will be displayed here</div>'
    }
    document.querySelector("#savedMovies").innerHTML = html
}

function showMovieDetails(movieID) {
    sessionStorage.setItem("movieID", movieID)
    window.location = "movie.html"
    return false
}

function removeMovieFromList(movieID) {
    dbRefObject.child(movieID).remove()
}