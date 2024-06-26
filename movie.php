<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cinephil</title>
    <link rel="icon" href="img/icon.svg">
    <link rel="stylesheet" href="bootstrap-5.0.0-beta2-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/movie.css">
    <script src="./js/movie.js" type="text/javascript"></script>
</head>

<?php

if (isset($_GET["id"])) {
    echo '<script>setMovieID(' . $_GET["id"] . ')</script>';
}

?>


<body>
    <nav id="navbar">
        <h1 role="button" aria-label="Return to Index Page" class="pulpFictionFont" id="navbar_title">Cinephil</h1>
        <div id="userLoggedIn">
            <span aria-label="Username" id="user_displayname"></span>
            <button class="button" id="btn_Signout">Sign out</button>
        </div>
        <div id="userNotLoggedIn">
            <button class="button" id="btn_Login">Log in</button>
        </div>
    </nav>

    <div aria-label="Movie Information" id="movieDetails">
        <div aria-label="Movie Title" class="display-4 text-center" id="movieTitle"></div>
        <div class="d-flex justify-content-center flex-wrap m-2">
            <div class="p-1" id="moviePoster"></div>
            <div class="p-2" id="movieDetailsText">
                <div aria-label="Movie Overview" id="movieOverview"></div>
                <div aria-label="Movie Genres" id="movieGenres"></div>
                <div aria-label="Movie Average Grade" id="movieAverageVote"></div>
                <div aria-label="Movie Release Date" id="movieReleaseDate"></div>
            </div>
        </div>

        <button aria-label="Add Movie to Favorite List" class="button m-2" id="btn_toggleFavourite"></button>

        <div class="text-center" id="movieTrailerDiv">
            <iframe id="movieTrailer" title="Movie trailer from YouTube" allowfullscreen></iframe>
        </div>

        <div class="display-5 p-1 m-2" id="similarMoviesLabel"></div>
        <div aria-label="List of Similar Movies" class="d-inline-flex p-1" id="similarMovies"></div>
    </div>

    <footer>Made by: Šarani</footer>

    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
    https://firebase.google.com/docs/web/setup#available-libraries -->
    <!-- <script src="https://www.gstatic.com/firebasejs/8.2.9/firebase-analytics.js"></script> -->
    <!-- Add Firebase products that you want to use -->
    <script src="https://www.gstatic.com/firebasejs/8.2.9/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.3.0/firebase-database.js"></script>

    <script>
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
  apiKey: "AIzaSyBx-ptRl0CygBfbJZPXNiIZjM678jjPv_Y",
  authDomain: "cinephil-c54db.firebaseapp.com",
  projectId: "cinephil-c54db",
  storageBucket: "cinephil-c54db.appspot.com",
  messagingSenderId: "58616980623",
  appId: "1:58616980623:web:6f22be444bfaf77b2c7cfa",
  databaseURL: "https://cinephil-c54db-default-rtdb.europe-west1.firebasedatabase.app/"
};
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    /* firebase.analytics(); */
    </script>
    </script>
</body>

</html>