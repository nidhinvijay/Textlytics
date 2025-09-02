document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        errorMessageDiv.textContent = '';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                
                // IMPORTANT: Store the tokens in localStorage
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                
                // Redirect to the main application page
                window.location.href = '/app/';
            } else {
                const errorData = await response.json();
                errorMessageDiv.textContent = errorData.detail || 'Invalid username or password.';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessageDiv.textContent = 'An unexpected error occurred. Please try again.';
        }
    });
});