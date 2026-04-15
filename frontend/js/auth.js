import { api } from './api.js';
import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    utils.authGuard();

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        const loginButton = loginForm.querySelector('button[type="submit"]');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            utils.setLoading(loginButton, true, 'Signing in...');

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                const response = await api.post('/auth/login', { email, password });
                if (response.success) {
                    const { token, user } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    utils.showToast('Login successful!', 'success');
                    setTimeout(() => {
                        window.location.href = user.role === 'ADMIN' ? 'admin.html' : 'dashboard.html';
                    }, 800);
                } else {
                    utils.showToast(response.message || 'Login failed', 'error');
                }
            } catch (error) {
                utils.showToast(error.message || 'An error occurred during login', 'error');
            } finally {
                utils.setLoading(loginButton, false);
            }
        });
    }

    if (registerForm) {
        const registerButton = registerForm.querySelector('button[type="submit"]');

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            utils.setLoading(registerButton, true, 'Creating account...');

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                const response = await api.post('/auth/register', { name, email, password });
                if (response.success) {
                    utils.showToast('Registration successful! Redirecting to login...', 'success');
                    setTimeout(() => window.location.href = 'login.html', 1200);
                } else {
                    utils.showToast(response.message || 'Registration failed', 'error');
                }
            } catch (error) {
                utils.showToast(error.message || 'An error occurred during registration', 'error');
            } finally {
                utils.setLoading(registerButton, false);
            }
        });
    }
});
