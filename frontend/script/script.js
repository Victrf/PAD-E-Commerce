
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    priceRange.addEventListener("input", () => {
        priceValue.textContent = `$${priceRange.value}`;
    });

