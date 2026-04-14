document.addEventListener('DOMContentLoaded', function () {
    const bookButtons = document.querySelectorAll('.btn-outline');


    bookButtons.forEach(button => {
        button.addEventListener('click', function () {
            window.location.href = '/form';
        });
    });
});
