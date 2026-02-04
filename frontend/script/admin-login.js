document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitBtn = loginForm.querySelector("button[type='submit']");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    const BACKEND_URL = "http://localhost:5000"; // Your Express backend

    // Redirect to dashboard if token exists
    const token = localStorage.getItem("adminToken");
    if (token) {
        window.location.href = "./dashboard.html"; // Adjust path as needed
        return;
    }

    // Password toggle
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.textContent = "Show";
    toggleBtn.className = "btn btn-sm btn-outline-light ms-2";
    passwordInput.parentNode.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", () => {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        toggleBtn.textContent = passwordInput.type === "password" ? "Show" : "Hide";
    });

    // Inline error message
    const errorMsg = document.createElement("p");
    errorMsg.className = "text-danger mt-2";
    emailInput.parentNode.appendChild(errorMsg);

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMsg.textContent = "";
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        if (!email || !password) {
            errorMsg.textContent = "Please fill in both email and password.";
            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, rememberMe })
            });

            const data = await res.json();

            if (res.ok) {
                // Store token in localStorage
                localStorage.setItem("adminToken", data.token);
                // Redirect to dashboard
                window.location.href = "./dashboard.html";
            } else {
                errorMsg.textContent = data.message || "Invalid credentials.";
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMsg.textContent = "An error occurred. Please try again later.";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
        }
    });
});
