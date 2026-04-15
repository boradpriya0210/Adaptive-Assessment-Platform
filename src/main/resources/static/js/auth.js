// Authentication Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            try {
                const response = await api.login({ email, password });

                if (response.success) {
                    // Store token and user data
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));

                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.textContent = response.message || 'Login failed';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                errorMessage.textContent = error.message || 'Login failed. Please try again.';
                errorMessage.style.display = 'block';
            }
        });
    }

    // Register Form Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            const successMessage = document.getElementById('success-message');

            try {
                const response = await api.register({ name, email, password });

                if (response.success) {
                    successMessage.textContent = 'Registration successful! Redirecting to login...';
                    successMessage.style.display = 'block';
                    errorMessage.style.display = 'none';

                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    errorMessage.textContent = response.message || 'Registration failed';
                    errorMessage.style.display = 'block';
                    successMessage.style.display = 'none';
                }
            } catch (error) {
                errorMessage.textContent = error.message || 'Registration failed. Please try again.';
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
            }
        });
    }
});
