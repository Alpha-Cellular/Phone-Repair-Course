import { supabaseClient } from "./supabaseClient.js";

export async function formHandler() {
  const form = document.getElementById("registrationForm");

  // --- Check number of submissions
  async function updateRegistrationCount() {
    let count = 0;
    try {
      const { count: rowCount, error: countError } = await supabaseClient
        .from("aptitude_applications")
        .select("id", { count: "exact", head: true});

      if (!countError) {
        count = rowCount;
      } else {
        console.warn("could not check registration capacity:", countError);
      }
    } catch (err) {
      console.warn("Error checking registration count:", err);
    }

    if (count >= 40) {
      form.innerHTML = `
        <h1 class="center">
          Registrations are now closed!!!
        </h1>
      `;
      return;
    }
  }

  setInterval(updateRegistrationCount, 5000);

  
  // --- Age input handler
  const ageInput = document.getElementById("age");

  ageInput.addEventListener('input', () => {
    ageInput.value = ageInput.value
      .replace(/\D/g, "")
      .slice(0, 2)
  })


  // --- Medical condition handler
  const medicalRadios = document.querySelectorAll('input[name="medical_condition"]');
  const medicalDetailsContainer = document.getElementById("medical_condition_details_container");
  const medicalDetails = document.getElementById("medical_condition_details");

  medicalRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selected = document.querySelector('input[name="medical_condition"]:checked')?.value;

      if (selected === "yes") {
        medicalDetailsContainer.hidden = false;
        medicalDetails.required = true;
        medicalDetails.focus();
      } else {
        medicalDetailsContainer.hidden = true;
        medicalDetails.required = false;
        medicalDetails.value = "";
      }
    })
  })

  // --- Eyewear handler
  const eyewearRadios = document.querySelectorAll('input[name="eyewear"]');
  const eyewearContainer = document.getElementById("eyewear_type");
  const eyewearTypeRadios = document.querySelectorAll('input[name="eyewear_type"]')

  eyewearRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selected = document.querySelector('input[name="eyewear"]:checked')?.value;

      if (selected === "yes") {
        eyewearContainer.hidden = false;
        eyewearTypeRadios[0].focus();
      } else {
        eyewearContainer.hidden = true;
        eyewearTypeRadios.forEach(r => r.checked = false)
      }
    })
  })



  // --- Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- Age
    const age = parseInt(document.getElementById("age").value);

    if (age < 16) {
      alert("Sorry, you must be 16 or older to qualify.")
      return;
    }

    // --- Preferred contact method
    const contactMethods = [...document.querySelectorAll('input[name="contactMethod"]:checked')];
    if (contactMethods.length === 0) {
      alert ("Please select at least one preferred contact method.");
      document.querySelector('input[name="contactMethod"]').focus();
      return;
    }

    // --- Colorblind logic
    const colorBlind = document.querySelector('input[name="colorBlind"]:checked').value;

    if (colorBlind === "yes") {
      alert("We appreciate your interest in this course. However, because the training requires precise color identification, applicants who are color-blind are unable to participate and cannot proceed with registration.");
      return;
    }


    // --- Transport logic
    const transport = document.querySelector('input[name="transport"]:checked').value;

    if (transport === "no") {
      alert("This course requires you to have your own means of transport or be able to arrange reliable transport independently. Unfortunately, applicants who are unable to arrange their own transport will not be able to proceed with registration.");
      return;
    }


    // --- Medical condition logic
    const medicalCondition = document.querySelector('input[name="medical_condition"]:checked')?.value;
    const medicalDetails = document.getElementById("medical_condition_details");

    if (medicalCondition === "yes" && medicalDetails.value.trim() === "") {
      alert("Please provide medical condition details.");
      medicalDetails.focus();
      return;
    }

    // --- Eyewear logic
    const eyewear = document.querySelector('input[name="eyewear"]:checked')?.value;
    const eyewearTypeSelected = document.querySelector('input[name="eyewear_type"]:checked');

    if (eyewear === "yes" && !eyewearTypeSelected) {
      alert("Please select your eyewear type.");
      document.querySelector('input[name="eyewear_type"]').focus();
      return;;
    }

    // --- Button User Interface
    const signUpButton = document.getElementById("signUp");
    signUpButton.innerHTML = "Signing Up...";
    signUpButton.disabled = true;

    // --- Eyetest answers
    const correctAnswers = {
      eyetest_1: "8952",
      eyetest_2: "7530",
      eyetest_3: "386",
      eyetest_4: "98413",
      eyetest_5: "16457"
    }

    const eyetest_1_answer = document.getElementById("eye_test_1").value.trim(); 
    const eyetest_2_answer = document.getElementById("eye_test_2").value.trim();
    const eyetest_3_answer = document.getElementById("eye_test_3").value.trim(); 
    const eyetest_4_answer = document.getElementById("eye_test_4").value.trim(); 
    const eyetest_5_answer = document.getElementById("eye_test_5").value.trim(); 


    // --- Collect data
    const data = {
      firstname: document.getElementById("firstname").value.trim(),
      surname: document.getElementById("surname").value.trim(),
      email: document.getElementById("email").value.trim().toLowerCase(),
      phone: document.getElementById("phone").value.trim(),

      preferred_contact_method: contactMethods.map(c => c.value).join(", "),

      age: document.getElementById("age").value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      region: document.getElementById("region").value.trim(),

      pc_experience: document.querySelector('input[name="pc_experience"]:checked').value,
      repair_experience: document.querySelector('input[name="repair_experience"]:checked').value,


      medical_condition: medicalCondition === "yes",
      medical_condition_details: medicalDetails.value || null,

      color_blind: document.querySelector('input[name="colorBlind"]:checked').value === "yes",

      eyewear: eyewear === "yes",
      eyewear_type: eyewearTypeSelected ? eyewearTypeSelected.value : null,

      eyetest_1: eyetest_1_answer,
      eyetest_2: eyetest_2_answer,
      eyetest_3: eyetest_3_answer,
      eyetest_4: eyetest_4_answer,
      eyetest_5: eyetest_5_answer,


      eyetest_1_result: eyetest_1_answer === correctAnswers.eyetest_1 ? "pass" : "fail",
      eyetest_2_result: eyetest_2_answer === correctAnswers.eyetest_2 ? "pass" : "fail",
      eyetest_3_result: eyetest_3_answer === correctAnswers.eyetest_3 ? "pass" : "fail",
      eyetest_4_result: eyetest_4_answer === correctAnswers.eyetest_4 ? "pass" : "fail",
      eyetest_5_result: eyetest_5_answer === correctAnswers.eyetest_5 ? "pass" : "fail",

      transport: document.querySelector('input[name="transport"]:checked').value,
      availability: document.getElementById("availability").value.trim(),

      message: document.getElementById("message").value || null
    };

    const { error } = await supabaseClient
      .from("aptitude_applications")
      .insert([data]);

    if (error) {
      console.error(error);
      alert("Something went wrong. Please check your internet connection and try again.");
      return;
    } else {
      emailjs.send("service_c0rsz8d", "template_4h8zaoz", {
        applicant_name: data.firstname,
        applicant_email: data.email
      })
      .then(() => {
        signUpButton.innerHTML = "Sign Up";
        signUpButton.disabled = false;
        alert("Your application has been submitted! Please check your email for confirmation.");
        form.reset();
      }) 
      .catch((err) => {
        signUpButton.innerHTML = "Sign Up";
        signUpButton.disabled = false;
        console.error("EmailJS error:", err);
        alert("Application submitted, but confirmation email could not be sent.");
        form.reset();
      })
    }
  })
}
