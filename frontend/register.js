document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Clear previous error messages
        errorMessageDiv.textContent = '';

        // Get form data
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                // Registration successful
                alert('Registration successful! Please login.');
                window.location.href = '/login/'; // Redirect to the login page
            } else {
                // Handle errors
                const errorData = await response.json();
                // A simple way to display multiple errors
                let errors = [];
                for (const key in errorData) {
                    errors.push(`${key}: ${errorData[key].join(', ')}`);
                }
                errorMessageDiv.textContent = errors.join(' | ');
            }
        } catch (error) {
            console.error('Registration error:', error);
            errorMessageDiv.textContent = 'An unexpected error occurred. Please try again.';
        }
    });
});