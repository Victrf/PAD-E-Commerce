document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) return;

    const imgEl = document.querySelector(".main-img");
    const nameEl = document.querySelector("#product-detail h2");
    const priceEl = document.querySelector("#product-detail h4");
    const descEl = document.querySelector("#product-detail p.fs-5");
    const buyBtn = document.querySelector("#product-detail a.btn-success");

    try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product details");
        const data = await res.json();
        const product = data.product;

        const imgSrc = product.image_url
            ? `http://localhost:5000${product.image_url}`
            : "https://via.placeholder.com/500x500";

        imgEl.src = imgSrc;
        imgEl.alt = product.name;
        nameEl.textContent = product.name;
        priceEl.textContent = `FCFA ${product.price}`;
        descEl.textContent = product.description || "Beautiful handcrafted item";

        buyBtn.href = `https://wa.me/+917337638491?text=I'm%20interested%20in%20${encodeURIComponent(
            product.name
        )}%20priced%20at%20FCFA ${product.price}`;
    } catch (err) {
        console.error("Error fetching product details:", err);
    }
});
