const allButtons = document.querySelectorAll(".enquire-btn");

function jumpContactUsPage () {
    document.location.href='ContactUs.html'
}

allButtons.forEach(button => {
    button.addEventListener("click", jumpContactUsPage)
});