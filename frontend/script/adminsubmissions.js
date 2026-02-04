document.addEventListener("DOMContentLoaded", async () => {
    const submissionsContainer = document.querySelector("#admin-forms-list .row");
    const filterInput = document.querySelector("#admin-forms-filter input");
    const filterSelect = document.querySelector("#admin-forms-filter select");
    const applyBtn = document.querySelector("#admin-forms-filter button");

    let allSubmissions = [];

    // ✅ Fetch all submissions
    async function fetchSubmissions() {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                submissionsContainer.innerHTML = `<p class="text-danger">You must be logged in as admin to view submissions.</p>`;
                return;
            }

            const [customOrdersRes, contactsRes] = await Promise.all([
                fetch("http://localhost:5000/api/forms/custom-orders", {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch("http://localhost:5000/api/forms/contacts", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            if (!customOrdersRes.ok || !contactsRes.ok)
                throw new Error("Failed to fetch submissions");

            const [customOrders, contacts] = await Promise.all([
                customOrdersRes.json(),
                contactsRes.json()
            ]);

            const normalizedCustomOrders = customOrders.map(order => ({
                id: order.id,
                name: order.name || "N/A",
                email: order.email || "N/A",
                type: "custom_order",
                displayType: "Custom Order",
                details: order.bag_description || "No details provided",
                contactMethod: order.contact_method || "N/A",
                contactInfo: order.contact_info || "N/A",
                referenceImages: order.file_paths || [],
                processed: order.processed || false
            }));

            const normalizedContacts = contacts.map(contact => ({
                id: contact.id,
                name: contact.name || "N/A",
                email: contact.email || "N/A",
                type: "contact",
                displayType: "General Inquiry",
                details: contact.message || "No message provided",
                contactMethod: "email",
                contactInfo: contact.email || "",
                referenceImages: [],
                processed: contact.processed || false
            }));

            allSubmissions = [...normalizedCustomOrders, ...normalizedContacts];
            renderSubmissions(allSubmissions);
        } catch (error) {
            console.error("Error fetching submissions:", error);
            submissionsContainer.innerHTML = `<p class="text-white">Failed to load submissions.</p>`;
        }
    }

    // ✅ Render submissions
    function renderSubmissions(submissions) {
        if (!submissions.length) {
            submissionsContainer.innerHTML = `<p class="text-white">No submissions available.</p>`;
            return;
        }

        submissionsContainer.innerHTML = submissions.map(sub => {
            const imagesHTML = sub.referenceImages.length
                ? `<div class="mb-2 text-white"><strong>Reference Image:</strong>
                     <div class="image-preview mt-2">
                       ${sub.referenceImages.map(img => `<img src="http://localhost:5000/${img}" class="img-fluid rounded me-2 mb-2" alt="Reference">`).join("")}
                     </div>
                   </div>`
                : "";

            let contactHref = "#";
            if (sub.contactMethod === "whatsapp" && sub.contactInfo) {
                const phone = sub.contactInfo.replace(/\D/g, "");
                contactHref = `https://wa.me/${phone}?text=Hi ${sub.name}, regarding your ${sub.displayType.toLowerCase()}...`;
            } else if (sub.contactMethod === "email" && sub.contactInfo) {
                contactHref = `mailto:${sub.contactInfo}?subject=${encodeURIComponent(sub.displayType)}&body=Hi ${sub.name},`;
            }

            const processedClass = sub.processed ? "btn-secondary disabled" : "btn-warning";

            return `
                <div class="col-12 col-md-6 col-lg-4" data-id="${sub.id}" data-type="${sub.type}">
                    <div class="card shadow-lg border-0 hover-scale fun-card">
                        <div class="card-body">
                            <h5 class="fw-bold text-white">${sub.name}</h5>
                            <p class="text-white"><strong>Email:</strong> ${sub.email}</p>
                            <p class="text-white"><strong>Type:</strong> ${sub.displayType}</p>
                            <p class="text-white"><strong>Details:</strong> ${sub.details}</p>
                            ${imagesHTML}
                            <div class="d-flex gap-2 mt-3">
                                <a href="${contactHref}" class="btn btn-success btn-sm" target="_blank">Contact</a>
                                <button 
                                    class="btn ${processedClass} btn-sm mark-processed-btn" 
                                    data-id="${sub.id}" 
                                    data-type="${sub.type}"
                                    ${sub.processed ? "disabled" : ""}>
                                    ${sub.processed ? "Processed" : "Mark as Processed"}
                                </button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${sub.id}" data-type="${sub.type}">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        attachEventListeners();
    }

    // ✅ Attach button handlers
    function attachEventListeners() {
        const token = localStorage.getItem("adminToken");

        // --- Mark as processed (already working)
        document.querySelectorAll(".mark-processed-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const type = btn.getAttribute("data-type");
                btn.disabled = true;
                btn.textContent = "Processing...";

                try {
                    const res = await fetch(`http://localhost:5000/api/forms/submissions/${type}/${id}/processed`, {
                        method: "PATCH",
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (!res.ok) throw new Error("Failed to mark as processed");

                    const submission = allSubmissions.find(sub => sub.id == id && sub.type === type);
                    if (submission) submission.processed = true;

                    btn.classList.remove("btn-warning");
                    btn.classList.add("btn-secondary");
                    btn.textContent = "Processed";
                } catch (error) {
                    console.error("Error marking as processed:", error);
                    btn.disabled = false;
                    btn.textContent = "Try Again";
                }
            });
        });

        // --- Delete submissions (FIXED)
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const type = btn.getAttribute("data-type"); // <--- important fix
                if (!confirm("Are you sure you want to delete this submission?")) return;

                try {
                    const res = await fetch(`http://localhost:5000/api/forms/submissions/${type}/${id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (!res.ok) throw new Error("Failed to delete submission");

                    // Remove from local array and UI instantly
                    allSubmissions = allSubmissions.filter(sub => !(sub.id == id && sub.type === type));
                    const card = document.querySelector(`[data-id="${id}"][data-type="${type}"]`);
                    if (card) card.remove();
                } catch (error) {
                    console.error("Error deleting submission:", error);
                }
            });
        });
    }

    // ✅ Filter submissions
    // ✅ Filter submissions
    function applyFilter() {
        const query = filterInput.value.toLowerCase();
        const typeFilter = filterSelect.value;

        const filtered = allSubmissions.filter(sub => {
            const matchesQuery =
                sub.name.toLowerCase().includes(query) ||
                sub.email.toLowerCase().includes(query);

            let matchesType = true;

            if (typeFilter && typeFilter !== "" && typeFilter !== "Filter by type") {
                if (typeFilter === "general_inquiry") {
                    matchesType = sub.displayType === "General Inquiry";
                } else {
                    matchesType = sub.type === typeFilter;
                }
            }


            return matchesQuery && matchesType;
        });

        renderSubmissions(filtered);
    }


    applyBtn.addEventListener("click", applyFilter);

    // ✅ Initial fetch
    fetchSubmissions();

    // ✅ Listen for new submissions from other pages
    window.addEventListener("storage", (event) => {
        if (event.key === "newSubmission") {
            fetchSubmissions(); // Refresh submissions instantly
        }
    });
});
