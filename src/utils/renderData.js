import { faqs } from "../data/faqs.js";

export function renderFAQs() {
  const container = document.getElementById("faqs-content");
  let output = "";

  faqs.forEach(f => {
    const isPlainText = !/<[a-z][\s\S]*>/i.test(f.answer);

    const answerHTML = isPlainText ? `<p>${f.answer}</p>` : f.answer;

    output += `
      <p class="question">
        ${f.question}
        <i class="fas fa-chevron-circle-down"></i>
        <i class="fas fa-chevron-circle-up"></i>
      </p>
      <div class="answer" hidden>
        ${answerHTML}
      </div>
    `
  })

  container.innerHTML = output;

  document.querySelectorAll("p.question > i:first-child").forEach(arrDown => {
    const arrUp = arrDown.nextElementSibling;
    const answer = arrDown.parentElement.nextElementSibling;

    arrDown.addEventListener('click', () => {
      arrDown.style.display = "none";
      arrUp.style.display = "inline-block",
      answer.style.display = "block";
    })
  })

  document.querySelectorAll("p.question > i:last-child").forEach(arrUp => {
    arrUp.style.display = "none";

    const arrDown = arrUp.previousElementSibling;
    const answer = arrUp.parentElement.nextElementSibling;

    arrUp.addEventListener('click', () => {
      arrUp.style.display = "none";
      arrDown.style.display = "inline-block";
      answer.style.display = "none";
    })
  })
}