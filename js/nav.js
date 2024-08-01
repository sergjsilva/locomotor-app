let path = window.location.pathname;
const navbar = document.querySelector(".navbar-nav");
let navLinks = navbar.querySelectorAll("a");

navLinks.forEach((link) => {
  let href = link.getAttribute("href");
  href = href.replace(/^\./, "");
  if (href === "/index.html") href = "/";
  if (href === path) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});
