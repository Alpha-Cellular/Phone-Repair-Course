import { supabaseClient } from "./utils/supabaseClient.js";

// --- Password Validation Function
function isValidPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return regex.test(password);
}

const form = document.getElementById("resetPasswordForm");

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value.trim();
  const button = document.getElementById("resetPasswordBtn");

  if (!isValidPassword(newPassword)) {
    alert("Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.");
    return;
  }

  button.innerHTML = "Resetting Password...";
  button.disabled = true;

  const { data, error } = await supabaseClient.auth.updateUser({
    password: newPassword
  });

  if (error) {
    button.innerHTML = "Reset Password";
    button.disabled = false;
    console.error("Password update failed:", error.message);
    alert("Error updating password: " + error.message);
  } else {
    button.innerHTML = "Reset Password";
    button.disabled = false;
    alert("Password updated successfully! You can now log in.");
    window.location.href = "./admin.html";
  }
})