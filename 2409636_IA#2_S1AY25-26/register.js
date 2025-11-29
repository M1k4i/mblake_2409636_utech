document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registerForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const userData = {
            username: document.getElementById('username').value.trim(),
            fullname: document.getElementById('fullname').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };

        localStorage.setItem('registeredUser', JSON.stringify(userData));

        alert('Registration successful! You may now log in.');

        window.location.href = 'login.html';
    });
});
