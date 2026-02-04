document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("product-upload-form");
    const productCards = document.getElementById("product-cards");
    const token = localStorage.getItem("adminToken");

    if (!token) {
        window.location.href = "./login.html";
        return;
    }

    // Fetch and display products
    const loadProducts = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/products", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            const products = data.products || [];

            productCards.innerHTML = "";
            if (products.length === 0) {
                productCards.innerHTML = `<p class="text-white text-center">No products available.</p>`;
                return;
            }

            products.forEach(product => {
                const imgSrc = product.image_url
                    ? `http://localhost:5000${product.image_url}`
                    : "https://via.placeholder.com/300x300?text=No+Image";

                const card = document.createElement("div");
                card.className = "col-12 col-sm-6 col-lg-4";
                card.innerHTML = `
                    <div class="card border-0 shadow-lg h-100 hover-scale">
                        <img src="${imgSrc}" class="card-img-top" alt="${product.name}">
                        <div class="card-body text-center">
                            <h5 class="fw-bold mb-2">${product.name}</h5>
                            <p class="text-muted mb-1">FCFA ${product.price}</p>
                            <p class="card-text">${product.description}</p>
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn btn-sm btn-outline-warning edit-btn" data-id="${product.id}">Edit</button>
                                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                productCards.appendChild(card);
            });
        } catch (err) {
            console.error("Error loading products:", err);
            productCards.innerHTML = `<p class="text-white text-center">Failed to load products.</p>`;
        }
    };

    loadProducts();

    // Upload product
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        try {
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                alert("✅ Product uploaded successfully!");
                uploadForm.reset();
                loadProducts();
            } else {
                alert(data.message || "Failed to upload product");
            }
        } catch (err) {
            console.error("Error uploading product:", err);
            alert("Server error while uploading product");
        }
    });

    // Delete/Edit
    productCards.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("delete-btn")) {
            if (!confirm("Are you sure?")) return;
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    alert("🗑️ Product deleted!");
                    loadProducts();
                }
            } catch (err) { console.error(err); }
        }

        if (e.target.classList.contains("edit-btn")) {
            alert("Edit coming soon!");
        }
    });
});
