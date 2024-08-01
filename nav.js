let path = window.location.pathname;

// Handle the root URL case and pretty URLs
if (path === "/" || path === "/index.html") {
  path = "./index.html";
} else {
  // Prepend "./" for consistency with href attributes
  path = `.${path}`;
}

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
