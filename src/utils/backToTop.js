export function backToTop() {
  const top = document.getElementById("top");

  window.addEventListener('scroll', () => {
    top.classList.toggle("show", window.scrollY > 300);
  })

  top.addEventListener('click', (e) => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  })
}