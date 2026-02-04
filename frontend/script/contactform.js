document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        const payload = { name, email, phone, subject, message };

        try {
            const response = await fetch("http://localhost:5000/api/forms/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Message sent successfully!");
                contactForm.reset();

                // ✅ Trigger admin page update
                localStorage.setItem("newSubmission", Date.now());
            } else {
                alert(data.message || "Failed to send message");
            }
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Server error while sending message");
        }
    });
});
