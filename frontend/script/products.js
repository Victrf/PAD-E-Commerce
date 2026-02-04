document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");

  const paginationContainer = document.createElement("div");
  paginationContainer.className = "d-flex justify-content-center align-items-center mt-4 flex-wrap gap-2";
  productList.after(paginationContainer);

  const PRODUCTS_PER_PAGE = 12;
  let allProducts = [];
  let currentPage = 1;

  productList.innerHTML = `
    <div class="text-center w-100 py-5">
      <div class="spinner-border text-light" role="status"></div>
      <p class="mt-3">Loading products...</p>
    </div>
  `;

  async function loadProducts() {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      allProducts = data.products || [];

      if (allProducts.length === 0) {
        productList.innerHTML = `<div class="text-center py-5"><p class="text-white-50">No products available right now.</p></div>`;
        return;
      }

      renderProducts();
      renderPagination();
    } catch (err) {
      console.error("Error fetching products:", err);
      productList.innerHTML = `<div class="text-center text-danger py-5"><p>Failed to load products.</p></div>`;
    }
  }

  function renderProducts() {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const productsToShow = allProducts.slice(start, end);

    productList.innerHTML = "";

    productsToShow.forEach(product => {
      const price = Number(product.price) || 0;
      const imgSrc = product.image_url
        ? `http://localhost:5000${product.image_url}`
        : "https://via.placeholder.com/300x300?text=No+Image";

      const card = `
        <div class="col-12 col-sm-6 col-lg-3" data-aos="fade-up">
          <div class="card border-0 shadow-sm h-100 product-card">
            <div class="overflow-hidden rounded-3 position-relative">
              <img src="${imgSrc}" class="card-img-top product-img" alt="${product.name}">
              <div class="card-overlay d-flex flex-column justify-content-center align-items-center text-center p-3">
                <p class="mb-2 text-white">${product.description || "Beautiful handcrafted item"}</p>
                <p class="mb-0 text-white"><strong>Price:</strong> $${price.toFixed(2)}</p>
              </div>
            </div>
            <div class="card-body text-center">
              <h5 class="fw-semibold mb-2">${product.name}</h5>
              <p class="text-muted mb-1">FCFA ${price.toFixed(2)}</p>
              <button class="btn btn-primary btn-sm">Acheter Maintenant</button>
            </div>
          </div>
        </div>
      `;
      productList.insertAdjacentHTML("beforeend", card);

      // Attach Buy Now click events
      document.querySelectorAll(".product-card .btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
          const product = productsToShow[index];
          // Save product ID in URL query param
          window.location.href = `prodetails.html?id=${product.id}`;
        });
      });

    });
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Précédent";
    prevBtn.className = "btn btn-outline-light btn-sm";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
        renderPagination();
      }
    });
    paginationContainer.appendChild(prevBtn);

    // Numbered page buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-light"}`;
      pageBtn.addEventListener("click", () => {
        currentPage = i;
        renderProducts();
        renderPagination();
      });
      paginationContainer.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Suivant →";
    nextBtn.className = "btn btn-outline-light btn-sm";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        renderPagination();
      }
    });
    paginationContainer.appendChild(nextBtn);
  }

  loadProducts();
});
