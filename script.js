
// DOM Elements
const loginForm = document.getElementById('login-form');
const signupOptions = document.getElementById('signup-options');
const signupAdmin = document.getElementById('signup-admin');
const signupCollector = document.getElementById('signup-collector');
const signupAgent = document.getElementById('signup-agent');
const showSignupOptions = document.getElementById('showSignupOptions');
const backToLoginLinks = document.querySelectorAll('#backToLogin');

// Function to reset all forms
function resetForms() {
    loginForm.style.display = 'none';
    signupOptions.style.display = 'none';
    signupAdmin.style.display = 'none';
    signupCollector.style.display = 'none';
    signupAgent.style.display = 'none';
}

// Show login form by default
loginForm.style.display = 'block';

// Show sign-up options when "Sign Up here" is clicked
showSignupOptions.addEventListener('click', (e) => {
    e.preventDefault();
    resetForms();
    signupOptions.style.display = 'block';
});

// Show Admin signup form
document.getElementById('signupAdmin').addEventListener('click', (e) => {
    e.preventDefault();
    resetForms();
    signupAdmin.style.display = 'block';
});

// Show Collector signup form
document.getElementById('signupCollector').addEventListener('click', (e) => {
    e.preventDefault();
    resetForms();
    signupCollector.style.display = 'block';
});

// Show Agent signup form
document.getElementById('signupAgent').addEventListener('click', (e) => {
    e.preventDefault();
    resetForms();
    signupAgent.style.display = 'block';
});

// Go back to login form when "Login" is clicked
backToLoginLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        resetForms();
        loginForm.style.display = 'block';
    });
});
