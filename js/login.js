document.addEventListener('DOMContentLoaded', (event) => {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            localStorage.setItem("userLoggedIn", true)
            if (user.displayName != null) {
                localStorage.setItem("userDisplayName", user.displayName)
                localStorage.setItem("userLoggedIn", true)
            }
            else {
                localStorage.setItem("userDisplayName", user.email)
            }
            window.location.replace("index.html")
            localStorage.setItem("userUID", user.uid)
        } else {
            // User is signed out
        }
    })

    document.querySelector("#span_showLoginForm").addEventListener("click", event => {
        event.preventDefault()
        document.querySelector("#form_login").style.display = "block"
        document.querySelector("#form_signup").style.display = "none"
    })

    document.querySelector("#span_showSignupForm").addEventListener("click", event => {
        event.preventDefault()
        document.querySelector("#form_login").style.display = "none"
        document.querySelector("#form_signup").style.display = "block"
    })

    document.querySelector("#btn_Login").addEventListener("click", event => {
        event.preventDefault()
        let email = form_login_input_email.value
        let password = form_login_input_password.value
        login(email, password)
    })

    document.querySelector("#btn_Signup").addEventListener("click", event => {
        event.preventDefault()
        let firstname = form_signup_input_firstname.value.trim()
        let lastname = form_signup_input_lastname.value.trim()
        let email = form_signup_input_email.value
        let password = form_signup_input_password.value
        if (firstname.trim() != "" && lastname.trim() != "") {
            signup(firstname, lastname, email, password)
        } else {
            alert("First name field or last name field is empty")
        }
    })

    document.querySelector("#form_login_input_password").addEventListener("keyup", event => {
        if (event.keyCode == 13) {
            event.preventDefault()
            document.querySelector("#btn_Login").click()
        }
    })

    document.querySelector("#form_signup_input_password").addEventListener("keyup", event => {
        if (event.keyCode == 13) {
            event.preventDefault()
            document.querySelector("#btn_Signup").click()
        }
    })

    document.querySelector("#span_Continue_Without_login").addEventListener("click", event => {
        event.preventDefault()
        window.location.replace("index.html")
    })
})

function login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage)
        });
}

function signup(firstname, lastname, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            let user = userCredential.user;
            user.updateProfile({
                displayName: firstname + " " + lastname
            })
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage)
        });
}