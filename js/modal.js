const contactForm = document.querySelector("#contact-form");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.querySelector("#name").value;
  const email = contactForm.querySelector("#email").value;
  const subject = contactForm.querySelector("#subject").value;
  const message = contactForm.querySelector("#message").value;

  const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSdd8mRzsAanrx9TbpnLlU-x3H9V34ti5TkdDTi0qNbHv_iUfA/viewform?usp=pp_url&entry.1881277022=${name}&entry.2125381079=${email}&entry.1468752291=${subject}&entry.77150289=${message}`;

  // Close the modal
  const modal = bootstrap.Modal.getInstance(
    document.querySelector("#contactModal")
  );
  modal.hide();

  window.open(formURL, "_blank");
});
