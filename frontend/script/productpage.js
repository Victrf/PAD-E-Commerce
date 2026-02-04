document.addEventListener("DOMContentLoaded", async () => {
    const productContainer = document.getElementById("product-page-list");
    const searchInput = document.getElementById("searchInput");
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    const sortSelect = document.getElementById("sortSelect");

    const PRODUCTS_PER_PAGE = 12;
    let allProducts = [];
    let currentPage = 1;

    // Track if user has interacted with the price filter
    priceRange.dataset.userChanged = "false";

    // Pagination container
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "d-flex justify-content-center align-items-center mt-4 flex-wrap gap-2";
    productContainer.after(paginationContainer);

    priceRange.addEventListener("input", () => {
        priceValue.textContent = `$${priceRange.value}`;
        priceRange.dataset.userChanged = "true"; // mark as user changed
        currentPage = 1;
        renderProducts();
    });

    searchInput.addEventListener("input", () => { currentPage = 1; renderProducts(); });
    sortSelect.addEventListener("change", () => { currentPage = 1; renderProducts(); });

    async function loadProducts() {
        try {
            const res = await fetch("http://localhost:5000/api/products");
            const data = await res.json();
            allProducts = data.products || [];
            renderProducts();
        } catch (err) {
            console.error("Error fetching products:", err);
            productContainer.innerHTML = `<p class="text-white">Failed to load products.</p>`;
        }
    }

    function renderProducts() {
        let products = [...allProducts];

        // Filter by search
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) products = products.filter(p => p.name.toLowerCase().includes(searchTerm));

        // Filter by price only if user has moved the slider
        const maxPrice = parseFloat(priceRange.value);
        if (priceRange.dataset.userChanged === "true") {
            products = products.filter(p => parseFloat(p.price) <= maxPrice);
        }

        // Sort products
        const sortValue = sortSelect.value;
        if (sortValue === "low-high") products.sort((a, b) => a.price - b.price);
        if (sortValue === "high-low") products.sort((a, b) => b.price - a.price);
        if (sortValue === "newest") products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Pagination slice
        const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const end = start + PRODUCTS_PER_PAGE;
        const productsToShow = products.slice(start, end);

        // Render products
        productContainer.innerHTML = "";
        if (productsToShow.length === 0) {
            productContainer.innerHTML = `<p class="text-white">No products available right now.</p>`;
            paginationContainer.innerHTML = "";
            return;
        }

        productsToShow.forEach(product => {
            const imgSrc = product.image_url
                ? `http://localhost:5000${product.image_url}`
                : "https://via.placeholder.com/300x300?text=No+Image";

            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-lg-3";
            col.innerHTML = `
                <div class="card product-card border-0 shadow-sm h-100 text-center">
                    <div class="product-img-wrapper overflow-hidden rounded-3">
                        <img src="${imgSrc}" class="card-img-top product-img" alt="${product.name}">
                        <div class="product-overlay">
                            <p class="text-white small mb-0">${product.description}</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="fw-semibold mb-2 text-white">${product.name}</h5>
                        <p class="text-white mb-1">FCFA ${product.price}</p>
                        <button class="btn btn-primary btn-sm">Buy Now</button>
                    </div>
                </div>
            `;
            productContainer.appendChild(col);

            // Buy Now click event
            col.querySelector(".btn").addEventListener("click", () => {
                window.location.href = `prodetails.html?id=${product.id}`;
            });
        });

        // Render pagination
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = "";
        if (totalPages <= 1) return;

        // Previous button
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "← Prev";
        prevBtn.className = "btn btn-outline-light btn-sm";
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener("click", () => { currentPage--; renderProducts(); });
        paginationContainer.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-light"}`;
            pageBtn.addEventListener("click", () => { currentPage = i; renderProducts(); });
            paginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next →";
        nextBtn.className = "btn btn-outline-light btn-sm";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener("click", () => { currentPage++; renderProducts(); });
        paginationContainer.appendChild(nextBtn);
    }

    loadProducts();
});
