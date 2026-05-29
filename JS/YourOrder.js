document.addEventListener("DOMContentLoaded", function () {

    // ── Element refs ──────────────────────────────────────────────
    const cartItemsList    = document.querySelector(".cart-items-list");
    const summaryItemsList = document.querySelector(".summary-items-list");
    const subtotalEl       = document.getElementById("summary-subtotal");
    const deliveryEl       = document.getElementById("summary-delivery");
    const totalEl          = document.getElementById("summary-total");
    const deliveryOptions  = document.querySelectorAll('input[name="delivery_method"]');
    const addressCardBox   = document.getElementById("address-card-box");
    const addressInputs    = addressCardBox ? addressCardBox.querySelectorAll("input, select, textarea") : [];

    // ── Render cart items ─────────────────────────────────────────
    function renderCart() {
        const cart = JSON.parse(localStorage.getItem("luceCart")) || [];

        // --- Cart Items column ---
        cartItemsList.innerHTML = "";

        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="cart-empty-state">
                    <div class="empty-icon">🛒</div>
                    <p class="empty-text">Your cart is currently empty.</p>
                    <a href="P&S.html" class="shop-now-link">Go to Shop</a>
                </div>`;
        } else {
            cart.forEach((item, index) => {
                const row = document.createElement("div");
                row.classList.add("cart-item-row");
                row.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.imgSrc}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">RM${item.price.toFixed(2)}</p>
                        <div class="cart-item-qty">
                            <button class="qty-btn minus-btn" data-index="${index}">−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn plus-btn" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" data-index="${index}" title="Remove item">✕</button>`;
                cartItemsList.appendChild(row);
            });

            // Quantity & remove listeners
            cartItemsList.querySelectorAll(".plus-btn").forEach(btn => {
                btn.addEventListener("click", () => changeQty(parseInt(btn.dataset.index), 1));
            });
            cartItemsList.querySelectorAll(".minus-btn").forEach(btn => {
                btn.addEventListener("click", () => changeQty(parseInt(btn.dataset.index), -1));
            });
            cartItemsList.querySelectorAll(".remove-btn").forEach(btn => {
                btn.addEventListener("click", () => removeItem(parseInt(btn.dataset.index)));
            });
        }

        // --- Order Summary column ---
        summaryItemsList.innerHTML = "";

        if (cart.length === 0) {
            summaryItemsList.innerHTML = `<p style="color:#C08552;font-size:14px;text-align:center;padding:10px 0;">No items selected</p>`;
        } else {
            cart.forEach(item => {
                const p = document.createElement("div");
                p.classList.add("summary-item-row");
                p.innerHTML = `
                    <span class="summary-item-name">${item.name} × ${item.quantity}</span>
                    <span class="summary-item-subtotal">RM${(item.price * item.quantity).toFixed(2)}</span>`;
                summaryItemsList.appendChild(p);
            });
        }

        updateTotals();
    }

    // ── Quantity helpers ──────────────────────────────────────────
    function changeQty(index, delta) {
        const cart = JSON.parse(localStorage.getItem("luceCart")) || [];
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        localStorage.setItem("luceCart", JSON.stringify(cart));
        renderCart();
    }

    function removeItem(index) {
        const cart = JSON.parse(localStorage.getItem("luceCart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("luceCart", JSON.stringify(cart));
        renderCart();
    }

    // ── Totals ────────────────────────────────────────────────────
    function updateTotals() {
        const cart = JSON.parse(localStorage.getItem("luceCart")) || [];

        let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let deliveryFee = 0;
        let selectedMethod = "";

        deliveryOptions.forEach(radio => {
            if (radio.checked) {
                deliveryFee    = parseFloat(radio.getAttribute("data-fee"));
                selectedMethod = radio.value;
                radio.parentElement.classList.add("active");
            } else {
                radio.parentElement.classList.remove("active");
            }
        });

        // Grey-out address box for pickup
        if (selectedMethod === "pickup") {
            if (addressCardBox) {
                addressCardBox.style.opacity    = "0.4";
                addressCardBox.style.transition = "opacity 0.3s ease";
                addressCardBox.style.pointerEvents = "none";
            }
            addressInputs.forEach(el => {
                el.removeAttribute("required");
                el.disabled = true;
            });
        } else {
            if (addressCardBox) {
                addressCardBox.style.opacity = "1";
                addressCardBox.style.pointerEvents = "";
            }
            addressInputs.forEach(el => {
                el.setAttribute("required", "true");
                el.disabled = false;
            });
        }

        subtotalEl.textContent = `RM${subtotal.toFixed(2)}`;
        deliveryEl.textContent = `RM${deliveryFee.toFixed(2)}`;
        totalEl.textContent    = `RM${(subtotal + deliveryFee).toFixed(2)}`;
    }

    // ── Inject cart data into form before submit ──────────────────
    const addressForm = document.getElementById("addressform");
    if (addressForm) {
        addressForm.addEventListener("submit", function (e) {
            const cart = JSON.parse(localStorage.getItem("luceCart")) || [];

            // Block submit if cart is empty
            if (cart.length === 0) {
                e.preventDefault();
                alert("Your cart is empty. Please add at least one item before placing an order.");
                return;
            }

            // Remove any previously injected hidden inputs
            addressForm.querySelectorAll(".cart-hidden").forEach(el => el.remove());

            // Inject cart items as hidden inputs
            cart.forEach((item, i) => {
                const fields = { name: item.name, price: item.price.toFixed(2), qty: item.quantity };
                Object.entries(fields).forEach(([key, val]) => {
                    const input = document.createElement("input");
                    input.type  = "hidden";
                    input.name  = `cart[${i}][${key}]`;
                    input.value = val;
                    input.classList.add("cart-hidden");
                    addressForm.appendChild(input);
                });
            });

            // Inject subtotal, delivery fee, grand total
            const subtotal    = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let deliveryFee   = 0;
            let deliveryMethod = "standard";
            deliveryOptions.forEach(radio => {
                if (radio.checked) {
                    deliveryFee    = parseFloat(radio.getAttribute("data-fee"));
                    deliveryMethod = radio.value;
                }
            });

            const hiddenTotals = {
                subtotal:        subtotal.toFixed(2),
                delivery_fee:    deliveryFee.toFixed(2),
                grand_total:     (subtotal + deliveryFee).toFixed(2),
                delivery_method: deliveryMethod
            };
            Object.entries(hiddenTotals).forEach(([key, val]) => {
                const input = document.createElement("input");
                input.type  = "hidden";
                input.name  = key;
                input.value = val;
                input.classList.add("cart-hidden");
                addressForm.appendChild(input);
            });

            // Clear cart from localStorage after successful injection
            // (PHP will redirect back; we clear on the way out)
            localStorage.removeItem("luceCart");
        });
    }

    // ── Event listeners ───────────────────────────────────────────
    deliveryOptions.forEach(radio => {
        radio.addEventListener("change", updateTotals);
    });

    // ── Init ──────────────────────────────────────────────────────
    renderCart();
});