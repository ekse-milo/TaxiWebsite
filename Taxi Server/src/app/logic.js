document.addEventListener('DOMContentLoaded', function () {
    const bookButtons = document.querySelectorAll('.btn-outline');
    const whatsappNumber = "910000000000";

    bookButtons.forEach(button => {
        button.addEventListener('click', function () {
            let message = "Hi, I'm interested in booking a ride with Goa Rides!";

            const card = button.closest('.car-card, .package-card');
            if (card) {
                const title = card.querySelector('h3');
                if (title) {
                    message = `Hi, I'm interested in booking the ${title.innerText} package/car with Goa Rides!`;
                }
            }

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
        });
    });
});
