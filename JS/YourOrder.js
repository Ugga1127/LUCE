document.addEventListener("DOMContentLoaded", function () {
    // Summary
    const subtotalElement = document.getElementById("summary-subtotal");
    const deliveryElement = document.getElementById("summary-delivery");
    const totalElement = document.getElementById("summary-total");

    // left
    const deliveryOptions = document.querySelectorAll('input[name="delivery_method"]');
    const addressCardBox = document.getElementById("address-card-box");
    const shippingAddressInput = document.getElementById("shipping-address-input");

    // calculate
    function calculateOrder() {
        let subtotal = 0; 
        let deliveryFee = 0;
        let selectedMethod = "";
        
        deliveryOptions.forEach(radio => {
            if (radio.checked) {
                deliveryFee = parseFloat(radio.getAttribute("data-fee"));
                selectedMethod = radio.value; // record value（standard/sameday/pickup)
                radio.parentElement.classList.add("active");
            } else {
                radio.parentElement.classList.remove("active");
            }
        });

        if (selectedMethod === "pickup") {
            // pickup
            if (shippingAddressInput) {
                shippingAddressInput.removeAttribute("required"); 
                shippingAddressInput.value = "";
                shippingAddressInput.disabled = true;
            }
            if (addressCardBox) {
                addressCardBox.style.opacity = "0.3";
                addressCardBox.style.transition = "opacity 0.3s ease";
            }
        } else {
            // standard or same-day
            if (shippingAddressInput) {
                shippingAddressInput.setAttribute("required", "true");
                shippingAddressInput.disabled = false;
            }
            if (addressCardBox) {
                addressCardBox.style.opacity = "1";
            }
        }

        // calculate total
        let grandTotal = subtotal + deliveryFee;

        // paste
        subtotalElement.textContent = `RM ${subtotal.toFixed(2)}`;
        deliveryElement.textContent = `RM ${deliveryFee.toFixed(2)}`;
        totalElement.textContent = `RM ${grandTotal.toFixed(2)}`;
    }

    // look
    deliveryOptions.forEach(radio => {
        radio.addEventListener("change", calculateOrder);
    });

    // when refresh, run again
    calculateOrder();
});