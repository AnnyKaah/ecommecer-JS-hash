document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-password-form");
  const messageElement = document.getElementById("form-message");
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

  if (passwordInput) {
    passwordInput.addEventListener("input", validatePassword);
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      messageElement.textContent = "";
      messageElement.style.color = "#d9534f";

      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        messageElement.textContent = "No reset token found.";
        return;
      }

      const password = passwordInput.value;

      try {
        const response = await fetch(`/api/auth/reset-password/${token}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "An error occurred.");
        }

        messageElement.textContent =
          "Password reset successfully! Redirecting to login...";
        messageElement.style.color = "var(--green)";

        setTimeout(() => {
          window.navigateWithTransition("/login.html");
        }, 3000);
      } catch (error) {
        messageElement.textContent = error.message;
      }
    });
  }
});
