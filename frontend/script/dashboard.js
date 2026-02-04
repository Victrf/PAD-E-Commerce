// dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("adminToken");

    // 🔒 1. Protect dashboard — if no token, redirect immediately
    if (!token) {
        window.location.href = "./login.html";
        return;
    }

    try {
        // 🔍 2. Verify token with backend
        const res = await fetch("http://localhost:5000/api/admin/verify", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            // ❌ Invalid or expired token
            throw new Error("Invalid token");
        }

        const data = await res.json();
        console.log("✅ Token verified:", data.message || "Valid session");

    } catch (error) {
        console.warn("⚠️ Session expired or invalid. Logging out...");
        localStorage.removeItem("adminToken");
        window.location.href = "./login.html";
        return;
    }

    // ✅ 3. Logout button logic
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("adminToken"); // clear token
            window.location.href = "./login.html"; // redirect
        });
    }
});
