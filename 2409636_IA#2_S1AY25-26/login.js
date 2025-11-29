document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const enteredEmail = document.getElementById('loginEmail').value.trim();
        const enteredPassword = document.getElementById('loginPassword').value;

        const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

        if (!savedUser) {
            alert('No registered user found. Please register first.');
            return;
        }

        if (enteredEmail.toLowerCase() === savedUser.email.toLowerCase() &&
            enteredPassword === savedUser.password) {
            alert('Login successful!');
            window.location.href = 'mainpage.html';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });
});
