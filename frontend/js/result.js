import { api } from './api.js';
import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    utils.authGuard();

    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId');

    if (!testId) {
        utils.showToast('Test result not found', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }

    try {
        const response = await api.get(`/result/${testId}`);
        
        if (response.success) {
            updateResultUI(response.data);
        } else {
            utils.showToast(response.message || 'Failed to load test results', 'error');
        }
    } catch (error) {
        utils.showToast(error.message || 'Error loading results', 'error');
    }
});

function updateResultUI(data) {
    // Backend returns accuracy as percentage (0-100). Normalize where needed.
    const accuracyPct = data.accuracy != null ? data.accuracy : 0; // e.g. 75.0

    // Animate accuracy ring (stroke-dashoffset expects 0..1 portion)
    const ring = document.getElementById('accuracy-ring');
    const ringOffset = 283 * (1 - (accuracyPct / 100));
    ring.style.strokeDashoffset = ringOffset;

    // Update labels
    document.getElementById('accuracy-text').textContent = `${accuracyPct.toFixed(1)}%`;
    document.getElementById('final-score').textContent = `${data.score}/100`;
    document.getElementById('correct-count').textContent = `${data.correctAnswers}/${data.totalQuestions}`;
    document.getElementById('total-time').textContent = `${data.timeTaken}s`;
    
    // Difficulty breakdown
    document.getElementById('easy-questions').textContent = data.easyQuestions || 0;
    document.getElementById('medium-questions').textContent = data.mediumQuestions || 0;
    document.getElementById('hard-questions').textContent = data.hardQuestions || 0;

    // Visual color change for ring based on performance
    if (accuracyPct >= 80) {
        ring.style.stroke = 'var(--success)';
    } else if (accuracyPct >= 50) {
        ring.style.stroke = 'var(--warning)';
    } else {
        ring.style.stroke = 'var(--error)';
    }
}
