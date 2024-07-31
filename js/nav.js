let path = window.location.pathname.split("/").pop();
path = `./${path}`;

const navbar = document.querySelector(".navbar-nav");
let navLinks = navbar.querySelectorAll("a");

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href === path) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});
