// Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!requireAuth()) return;

    // Load user data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const nameEl = document.getElementById('user-name');
        if (nameEl) nameEl.textContent = `Hello, ${user.name}!`;
        const initialsEl = document.getElementById('user-initials');
        if (initialsEl && user.name) {
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
            initialsEl.textContent = initials;
        }
    }

    // Load dashboard data
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        const response = await api.getPerformance();

        if (response.success && response.data) {
            updateDashboardStats(response.data);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Show placeholder data
        document.getElementById('total-tests').textContent = '0';
        document.getElementById('avg-score').textContent = '0%';
        document.getElementById('best-score').textContent = '0%';
    }
}

function updateDashboardStats(data) {
    // Update stats (simplified - you can expand based on actual API response)
    const accuracy = data.overallAccuracy || 0;
    document.getElementById('avg-score').textContent = `${accuracy.toFixed(1)}%`;

    // You can add more logic here to track total tests, best score, etc.
    // For now, showing placeholder values
}
