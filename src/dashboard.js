import { supabaseClient } from "./utils/supabaseClient.js";


window.addEventListener("DOMContentLoaded", async () => {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    window.location.href = "./admin.html";
  } else {
    loadApplications();
    setInterval(loadApplications, 5000);
  }
})


async function loadApplications() {
  const {data, error } = await supabaseClient
    .from("aptitude_applications")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.log(error);
    return;
  }

  // --- Formatting Date & Time
  function formatDateTime(isoString) {
    const date = new Date(isoString);

    return date.toLocaleString("en-ZA", {
      timeZone: "Africa/Johannesburg",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })
  }


  const table = document.getElementById("applications");
  table.innerHTML = "";
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th id="name-heading" class="name">Name</th>
      <th>No.</th>
      <th>Test Status</th>
      <th>Payment Status</th>
      <th>Date & Time</th>
      <th>Firstname</th>
      <th>Surname</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Preferred Contact Method</th>
      <th>Gender</th>
      <th>Region</th>
      <th>PC Experience</th>
      <th>Repair Experience</th>
      <th>Medical Condition</th>
      <th>Medical Condition Details</th>
      <th>Color Blind</th>
      <th>Eyewear</th>
      <th>Eyewear Type</th>
      <th>Eyetest 1</th>
      <th>Eyetest 2</th>
      <th>Eyetest 3</th>
      <th>Eyetest 4</th>
      <th>Eyetest 5</th>
      <th>Transport</th>
      <th>Availability</th>
      <th>Message</th>
    </tr>                               
  `;                  
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  tbody.innerHTML = data.length === 0
    ? `<tr><td>No applications yet</td></tr>`
    : data.map((app, index) => `
      <tr>
        <td class="name">${app.firstname} ${app.surname}</td>
        <td>${data.length - index}</td>
        <td>${app.test_status}</td>
        <td>${app.payment_status}</td>
        <td>${formatDateTime(app.created_at)}</td>
        <td>${app.firstname}</td>
        <td>${app.surname}</td>
        <td class="email">${app.email}</td>
        <td>${app.phone}</td>
        <td>${app.preferred_contact_method}</td>
        <td>${app.gender}</td>
        <td>${app.region}</td>
        <td>${app.pc_experience}</td>
        <td>${app.repair_experience}</td>
        <td>${app.medical_condition}</td>
        <td>${app.medical_condition_details || ''}</td>
        <td>${app.color_blind}</td>
        <td>${app.eyewear}</td>
        <td>${app.eyewear_type || ''}</td>
        <td>${app.eyetest_1_result}</td>
        <td>${app.eyetest_2_result}</td>
        <td>${app.eyetest_3_result}</td>
        <td>${app.eyetest_4_result}</td>
        <td>${app.eyetest_5_result}</td>
        <td>${app.transport}</td>
        <td>${app.availability}</td>
        <td>${app.message || ''}</td>
      </tr>
      `).join("");
  table.appendChild(tbody);
}


const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener('click', async () => {
  logoutButton.innerHTML = "Logging Out..."
  logoutButton.disabled = true;

  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      throw error;
    }

    alert("You have been logged out successfully!");
    window.location.href = "./admin.html";
  } catch (err) {
    console.error("Logout error:", err);
    alert("Something went wrong while logging out. Please try again.");

    logoutButton.innerHTML = "Log Out";
    logoutButton.disabled = false;
  }
})