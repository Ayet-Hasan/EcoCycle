// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
//
// const switchToSignup = document.getElementById('signup-optoin');
// const signupOption = document.getElementById('signup-option');


// Switch to Signup
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    // signupForm.classList.add('active');

});

// Switch to Login
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
});

// Initialize default view
loginForm.classList.add('active');
// signupForm.classList.remove('active');
// signupOption.classList.remove('active');

