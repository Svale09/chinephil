let currentPageNumber = 1;
let maxPageNumber;
const minPageNumber = 1;
const searchedByEnum = {
    title: 1,
    popularity: 2,
    topRated: 3,
    nowPlaying: 4,
    upcoming: 5,
    genre: 6
};
const genresMap = new Map();
let searchedBy;
let inputTitle;
let inputGenreID;
let genre = "";
let refreshFlag = false;


document.addEventListener("DOMContentLoaded", function () {
    //display of movies
    //on refresh keep the search parameters
    Promise.resolve(getGenres()).then(function () {
        if (history.state != null) {
            //restores the state after refresh
            document.getElementById("page_navigation").style.display = 'flex';
            currentPageNumber = history.state.currentPage;
            maxPageNumber = history.state.maxPages;
            searchedBy = history.state.currentSearch;
            inputTitle = history.state.inputTitle;
            inputGenreID = history.state.inputGenre;
            genre = history.state.genre;

            refreshFlag = true;
            searchByInput();
            setCurrentPageNumber(currentPageNumber);
        }
        else {
            //if there is no previous state, i.e. fresh load
            getPopularMovies(1);
            document.getElementById("page_navigation").style.display = 'flex';
            showInitialStatePageNavigation();
        }
    })

    document.getElementById("page_navigation").style.display = 'none';

    //user
    if (localStorage.getItem("userLoggedIn")) {
        userIsLoggedIn();
    }
    else {
        userIsNotLoggedIn();
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
        } else {
            // User is signed out
            localStorage.clear()
            /* sessionStorage.removeItem("movieID") */
            userIsNotLoggedIn()
        }
    });


    //header
    document.getElementById("navbar_title").addEventListener('click', function () {
        getPopularMovies(1);
        document.getElementById("page_navigation").style.display = 'flex';
        showInitialStatePageNavigation();
    })


    //log in, sign out and show saved movies buttons
    document.getElementById("btn_Login").addEventListener('click', function () {
        window.location = "login.html";
    })

    document.getElementById("btn_Signout").addEventListener('click', function () {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
            alert(error)
        });
    })

    document.getElementById("btn_showToWatchList").addEventListener('click', function () {
        window.location = "savedmovies.html";
    })

    //search by title
    document.getElementById("btn_search").addEventListener('click', function () {
        if (input_movieTitle.value.trim() != "") {
            inputTitle = input_movieTitle.value.trim();
            showInitialStatePageNavigation();
            getMoviesByTitle(inputTitle, currentPageNumber);
            resetInputValues();
            searchMode.scrollIntoView();
        }
    })

    document.querySelector("#input_movieTitle").addEventListener("keyup", event => {
        if (event.keyCode == 13) { //if enter is pressed
            event.preventDefault();
            document.getElementById("btn_search").click();
        }
    })


    //search by genre
    document.getElementById("select_genre").addEventListener("change", function () {
        if (this.value != -1) {
            inputGenreID = this.value;
            showInitialStatePageNavigation();
            getMoviesByGenre(this.value, currentPageNumber);
            resetInputValues();
            searchMode.scrollIntoView();
        }
    })

    //search popular
    document.getElementById("btn_getPopularMovies").addEventListener('click', function () {
        showInitialStatePageNavigation();
        getPopularMovies(currentPageNumber);
        resetInputValues();
        searchMode.scrollIntoView();
    })
    //search top rated        
    document.getElementById("btn_getTopRatedMovies").addEventListener('click', function () {
        showInitialStatePageNavigation();
        getTopRatedMovies(currentPageNumber);
        resetInputValues();
        searchMode.scrollIntoView();
    })
    //search upcoming
    document.getElementById("btn_getUpcomingMovies").addEventListener('click', function () {
        showInitialStatePageNavigation();
        getUpcomingMovies(currentPageNumber);
        resetInputValues();
        searchMode.scrollIntoView();
    })
    //search now playing
    document.getElementById("btn_getNowPlayingMovies").addEventListener('click', function () {
        showInitialStatePageNavigation();
        getNowPlayingMovies(currentPageNumber);
        resetInputValues();
        searchMode.scrollIntoView();
    })



    //page navigation
    document.getElementById("btn_previousPage").addEventListener('click', function () {
        if (currentPageNumber > minPageNumber) {
            currentPageNumber--;
            setCurrentPageNumber(currentPageNumber);
            searchMode.scrollIntoView();
            searchByInput();
        }
        resetInputValues();
    })

    document.getElementById("btn_nextPage").addEventListener('click', function () {
        if (currentPageNumber < maxPageNumber) {
            currentPageNumber++;
            setCurrentPageNumber(currentPageNumber);
            searchMode.scrollIntoView();
            searchByInput();
        }
        resetInputValues();
    })





})

//check which type of search is selected then call that search function
function searchByInput() {
    switch (searchedBy) {
        case searchedByEnum.title:
            getMoviesByTitle(inputTitle, currentPageNumber);
            break;
        case searchedByEnum.popularity:
            getPopularMovies(currentPageNumber);
            break;
        case searchedByEnum.topRated:
            getTopRatedMovies(currentPageNumber);
            break;
        case searchedByEnum.nowPlaying:
            getNowPlayingMovies(currentPageNumber);
            break;
        case searchedByEnum.upcoming:
            getUpcomingMovies(currentPageNumber);
            break;
        case searchedByEnum.genre:
            getMoviesByGenre(inputGenreID, currentPageNumber);
            break;
    }
}


//show/remove username depending on whether the user is logged in or not
function userIsLoggedIn() {
    document.getElementById("user_displayname").innerHTML = localStorage.getItem("userDisplayName");
    document.getElementById("userLoggedIn").style.display = 'block';
    document.getElementById("userNotLoggedIn").style.display = 'none';
    document.getElementById("btn_showToWatchList").style.display = 'block';
}

function userIsNotLoggedIn() {
    document.getElementById("userLoggedIn").style.display = 'none';
    document.getElementById("userNotLoggedIn").style.display = 'block';
    document.getElementById("btn_showToWatchList").style.display = 'none';
}


//page navigation
function showInitialStatePageNavigation() {
    btn_previousPage.style.visibility = "hidden";
    btn_nextPage.style.visibility = "visible";
    currentPageNumber = 1;
    current_pageNumber.innerHTML = currentPageNumber;
}

function setMaxPageNumber(value) {
    maxPageNumber = value
    if (maxPageNumber <= currentPageNumber) {
        btn_nextPage.style.visibility = "hidden";
    }
}

function setCurrentPageNumber(value) {
    if (value > minPageNumber) {
        btn_previousPage.style.visibility = "visible";
    }
    else {
        btn_previousPage.style.visibility = "hidden";
    }

    if (value < maxPageNumber) {
        btn_nextPage.style.visibility = "visible";
    }
    else {
        btn_nextPage.style.visibility = "hidden";
    }
    currentPageNumber = value;
    current_pageNumber.innerHTML = currentPageNumber;
}

function resetInputValues() {
    input_movieTitle.value = "";
}

//go to selected movie page
function showMovieDetails(movieID) {
    historyPush();
    sessionStorage.setItem("movieID", movieID);
    sessionStorage.setItem("currentPage", currentPageNumber);
    sessionStorage.setItem("currentSearch", searchedBy);
    //calls movie.php to display the movie details page
    window.location = `movie.php?id=${movieID}`
    return false
}


/* API functions */
const API_KEY = '55c1f2841989ee54cc3a9b0fc3e02aaf'
function getGenres() {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(data => {
            let html = `<option value="-1">Search by genre</option>`;
            for (let i in data.genres) {
                html += `<option value="${data.genres[i].id}">${data.genres[i].name}</option>`;
                genresMap.set(data.genres[i].id, data.genres[i].name);
            }
            select_genre.innerHTML = html;
        })
        .catch(error => {
            alert(error);
        })
}

function getPopularMovies(pageNumber) {
    searchedBy = searchedByEnum.popularity
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(data => {
            let html = `<h2 class="pulpFictionFont">Popular movies</h2>`
            renderMoviesIntoHTML(html, data);
        })
        .catch(error => {
            alert(error);
        })
}

function getTopRatedMovies(pageNumber) {
    searchedBy = searchedByEnum.topRated

    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${pageNumber}`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(data => {
            let html = `<h2 class="pulpFictionFont">Top rated movies</h2>`;
            renderMoviesIntoHTML(html, data);
        })
        .catch(error => {
            alert(error);
        })

}

function getUpcomingMovies(pageNumber) {
    searchedBy = searchedByEnum.upcoming

    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${pageNumber}`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(data => {
            let html = `<h2 class="pulpFictionFont">Upcoming movies</h2>`;
            renderMoviesIntoHTML(html, data);
        })
        .catch(error => {
            alert(error);
        })
}

function getNowPlayingMovies(pageNumber) {
    searchedBy = searchedByEnum.nowPlaying

    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${pageNumber}`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(data => {
            let html = `<h2 class="pulpFictionFont">Now playing movies</h2>`;
            renderMoviesIntoHTML(html, data);
        })
        .catch(error => {
            alert(error);
        })
}


function getMoviesByGenre(genreID, pageNumber) {
    searchedBy = searchedByEnum.genre;
    if (!refreshFlag)
        genre = select_genre.options[select_genre.selectedIndex].text;
    let html = `<h2 class="pulpFictionFont">${genre} movies</h2>`;

    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_genres=${genreID}&page=${pageNumber}`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(data => {
            renderMoviesIntoHTML(html, data);
        })
        .catch(error => {
            alert(error);
        })
}

function getMoviesByTitle(title, pageNumber) {
    searchedBy = searchedByEnum.title;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${title}&include_adult=false&page=${pageNumber}`, {
        method: 'get'
    })
        .then(response => response.json())
        .then(data => {
            let html = `<h2 class="pulpFictionFont">Results for: ${title}</h2>`;
            renderMoviesIntoHTML(html, data);
        })
        .catch(error => {
            alert(error);
        })
}

function renderMoviesIntoHTML(searchModeHTML, moviesJSON) {
    //rendering movie data into HTML
    searchMode.innerHTML = searchModeHTML;
    setMaxPageNumber(moviesJSON.total_pages);
    let html = '';

    for (let index in moviesJSON.results) {
        html += `<div class="movie animate-bottom" onclick="showMovieDetails(${moviesJSON.results[index].id})">`;
        if (moviesJSON.results[index].poster_path != null) {
            if (window.innerWidth > 500) {
                html += `<img class="movie_poster" alt="${moviesJSON.results[index].title}" src=https://image.tmdb.org/t/p/w400${moviesJSON.results[index].poster_path}>`;
            }
            else {
                html += `<img class="movie_poster" alt="${moviesJSON.results[index].title}" src=https://image.tmdb.org/t/p/w300${moviesJSON.results[index].poster_path}>`;
            }
        }
        else {
            html += `<img class="movie_poster" src="./img/image_not_found.png" style="object-fit : cover; object-position: 47% 50%">`;
        }
        html += `<span class="movie_info">${moviesJSON.results[index].title}</span>`;
        let genres = '';

        for (let i in moviesJSON.results[index].genre_ids) {
            genres += String(genresMap.get(moviesJSON.results[index].genre_ids[i]));

            if (i < moviesJSON.results[index].genre_ids.length - 1) {
                genres += ', ';
            }
        }

        html += `<span class="movie_info">${genres}</span></div>`;
    }

    movies_container.innerHTML = html;
    historyPush();
}


//history push and pop
//manages browser history state
function historyPush() {
    console.log("History push")
    refreshFlag = false;

    let state = {
        'currentPage': currentPageNumber,
        'maxPages': maxPageNumber,
        'currentSearch': searchedBy,
        'inputTitle': inputTitle,
        'inputGenre': inputGenreID,
        'selectedIndex': select_genre.selectedIndex,
        'genre': genre
    };
    let title = '';
    let url = '?search=' + searchedBy + "&page=" + currentPageNumber;

    //checks if current state is different from last saved
    if (!history.state ||
        history.state.currentPage != state.currentPage ||
        history.state.currentSearch != state.currentSearch ||
        history.state.maxPages != state.maxPages ||
        history.state.inputTitle != state.inputTitle ||
        history.state.inputGenre != state.inputGenre ||
        history.state.selectedIndex != state.selectedIndex ||
        history.state.genre != state.genre)
        history.pushState(state, title, url);
}

window.addEventListener('popstate', e => {
    if (e.state) {
        refreshFlag = false;

        currentPageNumber = e.state.currentPage;
        maxPageNumber = e.state.maxPages;
        searchedBy = e.state.currentSearch;
        inputTitle = e.state.inputTitle;
        inputGenreID = e.state.inputGenre;
        select_genre.selectedIndex = e.state.selectedIndex;
        genre = e.state.genre

        setCurrentPageNumber(currentPageNumber);

        switch (searchedBy) {
            case searchedByEnum.title:
                getMoviesByTitle(inputTitle, currentPageNumber);
                break;
            case searchedByEnum.popularity:
                getPopularMovies(currentPageNumber);
                break;
            case searchedByEnum.topRated:
                getTopRatedMovies(currentPageNumber);
                break;
            case searchedByEnum.nowPlaying:
                getNowPlayingMovies(currentPageNumber);
                break;
            case searchedByEnum.upcoming:
                getUpcomingMovies(currentPageNumber);
                break;
            case searchedByEnum.genre:
                getMoviesByGenre(inputGenreID, currentPageNumber);
                break;
        }
    }
});




