let path = window.location.pathname;
console.log(path);

console.log(path);
const navbar = document.querySelector(".navbar-nav");
let navLinks = navbar.querySelectorAll("a");

navLinks.forEach((link) => {
  let href = link.getAttribute("href");
  href = href.replace(/^\./, "");
  if (href === "/index.html") href = "/";
  if (href === path) {
    link.classList.add("active");
    console.log(link);
  } else {
    console.log(`HREF:${href} .... PATH:${path}`);
    link.classList.remove("active");
  }
});
