document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessageElement = document.getElementById("login-error");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorMessageElement.textContent = ""; // Clear previous errors

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed. Please try again.");
        }

        // Save user info to localStorage
        localStorage.setItem("userInfo", JSON.stringify(data));

        // Check for a redirect URL in the query parameters
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirect");

        // Redirect to the stored URL or to the homepage as a fallback
        window.navigateWithTransition(redirectUrl || "/index.html");
      } catch (error) {
        if (errorMessageElement) {
          errorMessageElement.textContent = error.message;
        } else {
          alert(error.message);
        }
      }
    });
  }
});
