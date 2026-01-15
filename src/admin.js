import { supabaseClient } from "./utils/supabaseClient.js";

const logInForm = document.getElementById("logInForm");
const signUpForm = document.getElementById("signUpForm");
const signUpInstead = document.getElementById("signUpInstead");
const logInInstead = document.getElementById("logInInstead");
const resetPassword = document.getElementById("resetPassword");

signUpInstead.addEventListener('click', () => {
  logInForm.style.display = "none";
  signUpForm.style.display = "flex";

  logInForm.reset();
})

logInInstead.addEventListener('click', () => {
  signUpForm.style.display = "none";
  logInForm.style.display = "flex";

  signUpForm.reset();
})

resetPassword.addEventListener('click', () => {
  window.location.href = "./confirmEmail.html";
})


// --- Password Validation Function
function isValidPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return regex.test(password);
}



// --- SignUpForm handler

signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById("signUpEmail").value.trim();
  const password = document.getElementById("signUpPassword").value.trim();
  const button = document.getElementById("signUpButton");

  const allowedEmails = [
    "savedbygrace.wdm@gmail.com",
    "yusufbzn@gmail.com"
  ]

  if (!allowedEmails.includes(email)) {
    alert("Sorry. You don't have permission to view this site!");
    return
  }

  if (!isValidPassword(password)) {
    alert("Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.");
    return;
  }

  button.innerHTML = "Signing Up...";
  button.disabled = true;

  const { data, error } = await supabaseClient.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: "https://alpha-cellular.github.io/Phone-Repair-Course/dashboard.html"
    } 
  });

  if (error) {
    button.innerHTML = "Sign Up";
    button.disabled = false;
    alert(error.message);
  } else {
    button.innerHTML = "Sign Up";
    button.disabled = false;
    alert("Please check your email to confirm your account. You will only receive this email if creating a new account.");
  }
})


// --- logInForm handler
logInForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById("logInEmail").value.trim();
  const password = document.getElementById("logInPassword").value.trim();
  const button = document.getElementById("logInButton");

  button.innerHTML = "Logging In...";
  button.disabled = true;

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    button.innerHTML = "Log In";
    button.disabled = false;
    alert(error.message);
  } else {
    button.innerHTML = "Log In";
    button.disabled = false;
    alert("Login Successful!");
    window.location.href = "./dashboard.html";
  }
})
