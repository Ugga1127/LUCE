// const allButtons = document.querySelectorAll(".add-btn");

// function showSuccessAlert() {
//     alert("Order Added Successfully!");
// }

// allButtons.forEach(button => {
//     button.addEventListener("click", showSuccessAlert);
// });
// Do not touch!!!!!!!!!!!!

document.addEventListener("DOMContentLoaded", function () {

    const allButtons = document.querySelectorAll(".add-btn");

    allButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Walk up to the card element to get product details
            const card = button.closest(".bouquet-card, .plant-card");
            if (!card) return;

            const name  = card.querySelector("h3").textContent.trim();
            const priceText = card.querySelector(".price").textContent.trim(); // e.g. "RM135"
            const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
            const imgSrc = card.querySelector("img").getAttribute("src");

            // Load existing cart from localStorage
            let cart = JSON.parse(localStorage.getItem("luceCart")) || [];

            // Check if item already exists in cart
            const existingIndex = cart.findIndex(item => item.name === name);

            if (existingIndex !== -1) {
                // Increment quantity
                cart[existingIndex].quantity += 1;
            } else {
                // Add new item
                cart.push({ name, price, imgSrc, quantity: 1 });
            }

            // Save back to localStorage
            localStorage.setItem("luceCart", JSON.stringify(cart));

            // Visual feedback on button
            const originalText = button.textContent;
            button.textContent = "✓ Added!";
            button.style.backgroundColor = "#7a9e7e";
            button.style.color = "#fff";
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = "";
                button.style.color = "";
            }, 1200);
        });
    });

});