document.addEventListener("DOMContentLoaded", () => {
    const customOrderForm = document.getElementById("customOrderForm");

    customOrderForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const bagDescription = document.getElementById("bagDescription").value.trim();
        const contactMethod = document.getElementById("contactMethod").value;
        const contactInfo = document.getElementById("contactInfo").value.trim();
        const referenceFiles = document.getElementById("referenceUpload").files;

        const formData = new FormData();
        formData.append("bagDescription", bagDescription);
        formData.append("contactMethod", contactMethod);
        formData.append("contactInfo", contactInfo);

        // ✅ Use the same field name as Multer expects
        for (let i = 0; i < referenceFiles.length; i++) {
            formData.append("referenceUpload", referenceFiles[i]);
        }

        try {
            const response = await fetch("http://localhost:5000/api/forms/custom-order", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Custom order submitted successfully!");
                customOrderForm.reset();

                // ✅ Trigger event for admin page to refresh immediately
                localStorage.setItem("newSubmission", Date.now());
            } else {
                alert(data.message || "Failed to submit custom order");
            }
        } catch (err) {
            console.error("Error submitting custom order:", err);
            alert("Server error while submitting custom order");
        }
    });
});
