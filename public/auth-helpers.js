function setupPasswordToggle(wrapper) {
  const input = wrapper.querySelector("input");
  const toggleButton = wrapper.querySelector(".toggle-password");

  if (!input || !toggleButton) return;

  const eyeIcon = toggleButton.querySelector(".eye-icon");
  const eyeSlashIcon = toggleButton.querySelector(".eye-slash-icon");

  toggleButton.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    eyeIcon.classList.toggle("hidden", isPassword);
    eyeSlashIcon.classList.toggle("hidden", !isPassword);

    toggleButton.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  });
}

document.querySelectorAll(".password-wrapper").forEach(setupPasswordToggle);
