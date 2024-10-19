// Replace with the actual URL where your API is running 
const apiUrl = "http://127.0.0.1:8000";
  // Replace with your EmailJS User ID

// Initialize EmailJS

   // Initialize EmailJS


// Function to show the sign-up form
function showSignUp() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
}

// Function to show the login form
function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

// Handle login form submission
document.querySelector("#login-form form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent default form submission

    // Get form data
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Send POST request using fetch
    fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    .then(async response => {
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail);
        }
        return response.json();
    })
    .then(data => {
        alert("Login successful!");
        const TOKEN = data.access_token;
        window.location.href = "/home/albaforce/WebDev/invictus/dash/index.html";
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();  // Generates a 6-digit code
}

// Handle registration form submission
// document.getElementById("signup-form").addEventListener("submit", function(event) {
//     event.preventDefault();  // Prevent form submission

//     // Get registration form data
//     const username = document.getElementById("username").value;
//     const email = document.getElementById("signup-email").value;
//     const password = document.getElementById("signup-password").value;
//     const verifyPassword = document.getElementById("verify-password").value;
//     const verificationCode = generateVerificationCode(); // You need to define this function

//     // Send POST request for registration
//     fetch(`${apiUrl}/register`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username: username, email: email, password: password, verify_password: verifyPassword }),
//     })
//     .then(async response => {
//         if (!response.ok) {
//             const data = await response.json();
//             console.log("! response")
//             throw new Error(data.detail);
//               // Handle error details
//         }
//         console.log("response")
//         return response.json();  // Parse the response body as JSON
//     })
//     .then(data => { 
//         console.log("response")
//         alert(data.message);  // Show success message

//         // Update the UI by hiding the signup form and showing the verification section
//         document.getElementById("signup-form").style.display = "none";
//         document.getElementById("verification-section").style.display = "block";
        
//         // Send the verification email after registration (make sure the email sending logic is correct)
//         sendVerificationEmail(email, verificationCode);
//     })
//     .catch(error => {
//         document.getElementById("error-message").textContent = error.message;  // Show error message
//         console.error("Error during registration:", error);
//     });
// });

document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent default form submission

    // Get registration form data
    const username = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const verifyPassword = document.getElementById("verify-password").value;
    const verificationCode = generateVerificationCode();  // Assuming you have this function

    console.log("Form data:", { username, email, password, verifyPassword });

    // Send POST request for registration
    fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, email: email, password: password, verify_password: verifyPassword }),
    })
    .then(async response => {
        console.log("Received response from backend");
        if (!response.ok) {
            const data = await response.json();
            console.log("Error response data:", data);
            throw new Error(data.detail);
        }
        return response.json();  // Parse the response body as JSON
    })
    .then(data => { 
        if (!data) {
            throw new Error("No response data received.");
        }
        alert(data.message);  // Show success message
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("verification-section").style.display = "block";
        // Send the verification email after registration
        sendVerificationEmail(email, verificationCode);
    })
    .catch(error => {
        console.log("Caught error:", error.message);  // Debug caught error
        document.getElementById("error-message").textContent = error.message;  // Show error message
    });
});
// Function to send the verification email using EmailJS
function sendVerificationEmail(email, verificationCode) {
    var templateParams = {
        to_email: email,
        message: "Please verify your account by entering the verification code provided.",
        code : verificationCode
    };

    emailjs.send("service_fr4lait", "template_x1326zz", templateParams).then(function(response) {
            alert('Verification email sent! Please check your inbox.');  // Notify user
        }, function(error) {
            console.error("Error sending verification email:", error);
        });
}

// Handle the code verification step
// document.querySelector("#send-code").addEventListener("click", function(event) {
//     event.preventDefault();

//     // Get email and verification code
//     const email = document.getElementById("signup-email").value;
//     const code = document.getElementById("verification-code").value;

//     // Send POST request for verification
//     fetch(`${apiUrl}/verify-code`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: email, code: code }),
//     })
//     .then(response => {
//         if (!response.ok) {
//             return response.json().then(data => {
//                 throw new Error(data.detail);
//             });
//         }
//         return response.json();
//     })
//     .then(data => {
//         alert(data.message);  // Show success message
//         // Notify the backend that the verification was successful
//         notifyBackend(email, code);
//     })
//     .catch(error => {
//         document.getElementById("verification-message").textContent = error.message;
//     });
// });

// Function to notify the backend about successful verification

document.querySelector("#send-code").addEventListener("click", function(event) {
    event.preventDefault();
    fetch(`${apiUrl}/verify-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    })
    .then(async response => {
        if (!response.ok) {
            
            throw new Error();
        }
        return response.json();
    })
    .then(data => {
        alert("Verification confirmed! You can now log in.");
        window.location.href = "/dash/index.html";  // Redirect to dashboard after confirmation
    })
    .catch(error => {
        console.error("Error confirming verification:", error);
    });
});
