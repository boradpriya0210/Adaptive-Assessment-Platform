import { api } from './api.js';
import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    utils.authGuard();

    const user = utils.getUser();
    if (user) {
        setupUserUI(user);
    }

    // Set current date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString(undefined, dateOptions);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            utils.logout();
        });
    }

    try {
        const response = await api.get('/performance');
        
        if (response.success) {
            const data = response.data;
            updateDashboard(data);
        } else {
            utils.showToast(response.message || 'Failed to load performance data', 'error');
        }
    } catch (error) {
        utils.showToast(error.message || 'Error loading dashboard', 'error');
    }
});

function setupUserUI(user) {
    const welcomeEl = document.getElementById('welcome-msg');
    if (welcomeEl) welcomeEl.textContent = `Welcome back, ${user.name}!`;

    // Set initials safely
    const initialsEl = document.getElementById('user-initials');
    if (initialsEl && user && user.name) {
        const names = user.name.split(' ');
        const initials = names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
        initialsEl.textContent = initials;
    }

    // Set role badge safely
    const roleBadge = document.getElementById('user-role-badge');
    if (roleBadge && user && user.role) {
        roleBadge.textContent = user.role;
        roleBadge.className = `badge ${user.role === 'ADMIN' ? 'badge-hard' : 'badge-medium'}`;
    }
}

function updateDashboard(data) {
    // Top Hero Stats
    const accuracy = (data.overallAccuracy || 0).toFixed(1);
    document.getElementById('overall-accuracy').textContent = `${accuracy}%`;

    // Update Performance Summary Text
    const summaryText = document.getElementById('performance-summary');
    if (summaryText) {
        if (accuracy >= 80) {
            summaryText.innerHTML = `You're performing <span style="color: var(--success); font-weight: 600;">excellently</span>! Keep up the great work.`;
        } else if (accuracy >= 50) {
            summaryText.innerHTML = `You're making <span style="color: var(--warning); font-weight: 600;">good progress</span>. Consistent practice will get you higher.`;
        } else {
            summaryText.innerHTML = `Focus on your <span style="color: var(--error); font-weight: 600;">weak areas</span> to improve your mastery.`;
        }
    }
    
    // Update Hero Progress Bar
    const progressFill = document.getElementById('hero-progress-fill');
    const percentText = document.getElementById('progress-percent');
    if (progressFill && percentText) {
        setTimeout(() => {
            progressFill.style.width = `${accuracy}%`;
            percentText.textContent = `${accuracy}%`;
        }, 300);
    }

    // Grid Stats
    document.getElementById('avg-time').textContent = `${data.avgTime.toFixed(1)}s`;
    
    const strengthEl = document.getElementById('strengths-count');
    if (data.strengths && data.strengths.length > 0) {
        strengthEl.textContent = `${data.strengths.length} Areas`;
        strengthEl.style.color = 'var(--success)';
    } else {
        strengthEl.textContent = 'None yet';
        strengthEl.style.color = 'var(--text-secondary)';
    }

    // Update Weak Topics List
    const weakList = document.getElementById('weak-topics-list');
    weakList.innerHTML = '';
    
    if (data.weakTopics && data.weakTopics.length > 0) {
        data.weakTopics.forEach(topic => {
            const topicDiv = document.createElement('div');
            topicDiv.className = 'fade-in';
            topicDiv.style.cssText = `
                display: flex; 
                align-items: center; 
                justify-content: space-between; 
                padding: 14px 18px; 
                background: rgba(239, 68, 68, 0.05); 
                border: 1px solid rgba(239, 68, 68, 0.15); 
                border-radius: 12px;
                transition: all 0.2s;
            `;
            topicDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span class="activity-dot error"></span>
                    <span style="font-weight: 500; font-size: 0.95rem;">${topic}</span>
                </div>
                <i class="fa fa-chevron-right" style="font-size: 0.7rem; color: var(--text-secondary);"></i>
            `;
            weakList.appendChild(topicDiv);
        });
    } else {
        weakList.innerHTML = `
            <div style="padding: 30px; text-align: center; background: rgba(34, 197, 94, 0.05); border: 1px dashed var(--success); border-radius: 12px;">
                <i class="fa fa-rocket" style="font-size: 1.5rem; color: var(--success); margin-bottom: 10px;"></i>
                <p style="color: var(--text-primary); font-weight: 500;">Peak Performance!</p>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">No weak areas detected in your recent tests.</p>
            </div>
        `;
    }

    // Initialize Chart
    initChart(data.topicAccuracy);
}

function initChart(topicAccuracy) {
    const canvas = document.getElementById('topicChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Destroy previous chart if it exists (relevant if we add real-time updates)
    if (window.myDashboardChart) {
        window.myDashboardChart.destroy();
    }

    const labels = topicAccuracy && Object.keys(topicAccuracy).length > 0 ? Object.keys(topicAccuracy) : [];
    // Backend returns percentages (e.g. 33.3) — use directly and clamp to 0-100
    const accuracyData = labels.length > 0 ? Object.values(topicAccuracy).map(v => Math.max(0, Math.min(100, Number(v)))) : [];

    if (labels.length === 0) {
        // Render an empty chart with placeholder text
        if (window.myDashboardChart) window.myDashboardChart.destroy();
        canvas.parentElement.querySelector('div')?.remove?.();
        const placeholder = document.createElement('div');
        placeholder.style.padding = '40px';
        placeholder.style.textAlign = 'center';
        placeholder.style.color = 'var(--text-secondary)';
        placeholder.textContent = 'No topic accuracy data yet. Take tests to generate insights.';
        canvas.parentElement.appendChild(placeholder);
        return;
    }

    // Create Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.8)');
    gradient.addColorStop(1, 'rgba(236, 72, 11, 0.1)');

    window.myDashboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mastery %',
                data: accuracyData,
                backgroundColor: gradient,
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2,
                borderRadius: 10,
                barThickness: 25,
                hoverBackgroundColor: 'rgba(79, 70, 229, 1)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { 
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#94a3b8',
                        padding: 10,
                        callback: value => value + '%'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: '#94a3b8',
                        padding: 10
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    cornerRadius: 8,
                    displayColors: false
                }
            }
        }
    });
}
