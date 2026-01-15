import { supabaseClient } from "./utils/supabaseClient.js";

const confirmEmailForm = document.getElementById("confirmEmailForm");
const closeBtn = document.getElementById("close");

closeBtn.addEventListener('click', () => {
  window.location.href = "./admin.html";
})

confirmEmailForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById("confirmEmail").value.trim();
  const button = document.getElementById("confirmEmailButton");

  button.innerHTML = "Confirming Email...";
  button.disabled = true;

  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: "https://alpha-cellular.github.io/Phone-Repair-Course/resetPassword.html"
  });

  if (error) {
    button.innerHTML = "Confirm Email";
    button.disabled = false;
    console.error("Error sending password reset email:", error.message);
    alert("Error sending password reset email: " + error.message);
  } else {
    button.innerHTML = "Confirm Email";
    button.disabled = false;
    alert("Password reset email sent! Check your inbox and click the link to proceed.")
  }
})
