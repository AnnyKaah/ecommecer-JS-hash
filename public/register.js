document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const errorMessageElement = document.getElementById("register-error");

  const passwordInput = document.getElementById("password");
  const submitButton = document.getElementById("submit-btn");

  const criteria = {
    length: document.getElementById("length"),
    uppercase: document.getElementById("uppercase"),
    lowercase: document.getElementById("lowercase"),
    number: document.getElementById("number"),
    special: document.getElementById("special"),
  };

  const validatePassword = () => {
    const value = passwordInput.value;
    const validations = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[@$!%*?&]/.test(value),
    };

    let allValid = true;
    for (const key in validations) {
      const element = criteria[key];
      if (validations[key]) {
        element.classList.add("valid");
      } else {
        element.classList.remove("valid");
        allValid = false;
      }
    }

    submitButton.disabled = !allValid;
  };

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorMessageElement.textContent = "";

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        errorMessageElement.textContent = "Passwords do not match.";
        return;
      }

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Registration failed. Please try again."
          );
        }

        // Save user info and redirect
        localStorage.setItem("userInfo", JSON.stringify(data));
        window.navigateWithTransition("/index.html");
      } catch (error) {
        if (errorMessageElement) {
          errorMessageElement.textContent = error.message;
        } else {
          alert(error.message);
        }
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", validatePassword);
  }
});
