const allButtons = document.querySelectorAll(".add-btn");

function showSuccessAlert() {
    alert("Order Added Successfully!");
}

allButtons.forEach(button => {
    button.addEventListener("click", showSuccessAlert);
});