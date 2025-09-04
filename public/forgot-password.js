document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgot-password-form");
  const messageElement = document.getElementById("form-message");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      messageElement.textContent = "";
      messageElement.style.color = "#d9534f"; // Default to error color

      const email = document.getElementById("email").value;

      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "An error occurred.");
        }

        messageElement.textContent = data.message;
        messageElement.style.color = "var(--green)"; // Success color
        form.reset();
      } catch (error) {
        messageElement.textContent = error.message;
      }
    });
  }
});
