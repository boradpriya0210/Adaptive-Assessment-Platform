import { api } from './api.js';
import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    utils.authGuard();

    const user = utils.getUser();
    if (user) {
        populateProfile(user);
    }

    try {
        const response = await api.get('/users/profile');
        if (response.success) {
            populateProfile(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } else {
            utils.showToast(response.message || 'Failed to load profile', 'error');
        }
    } catch (error) {
        handleAuthError(error);
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const saveButton = profileForm.querySelector('button[type="submit"]');
            utils.setLoading(saveButton, true, 'Saving...');

            const name = document.getElementById('profile-name').value.trim();
            const password = document.getElementById('profile-password').value.trim();

            const payload = { name };
            if (password) payload.password = password;

            try {
                const response = await api.put('/users/profile', payload);
                if (response.success) {
                    utils.showToast('Profile updated successfully!', 'success');
                    populateProfile(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                } else {
                    utils.showToast(response.message || 'Update failed', 'error');
                }
            } catch (error) {
                handleAuthError(error);
            } finally {
                utils.setLoading(saveButton, false);
            }
        });
    }
});

function handleAuthError(error) {
    const message = error?.message?.toLowerCase() || '';
    if (message.includes('token') || message.includes('unauthorized') || message.includes('no token')) {
        utils.logout();
        return;
    }
    utils.showToast(error.message || 'Error loading profile', 'error');
}

function populateProfile(user) {
    if (!user) return;
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'US';
    document.getElementById('profile-initials').textContent = initials;
    document.getElementById('profile-name-title').textContent = user.name || 'Your Name';
    document.getElementById('profile-email-title').textContent = user.email || 'email@example.com';
    document.getElementById('profile-name').value = user.name || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-role-badge').textContent = user.role || 'User';
}
