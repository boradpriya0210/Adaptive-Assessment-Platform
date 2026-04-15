import { api } from './api.js';
import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    utils.authGuard();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    try {
        const response = await api.get('/performance/history');
        
        if (response.success) {
            renderHistory(response.data);
        } else {
            utils.showToast(response.message || 'Failed to load history', 'error');
            document.getElementById('history-container').innerHTML = `<div class="empty-history" style="grid-column: 1 / -1;"><i class="fa fa-exclamation-triangle" style="color: var(--error);"></i><h2>Failed to load history</h2></div>`;
        }
    } catch (error) {
        utils.showToast(error.message || 'Error loading history', 'error');
        document.getElementById('history-container').innerHTML = `<div class="empty-history" style="grid-column: 1 / -1;"><i class="fa fa-exclamation-triangle" style="color: var(--error);"></i><h2>Error loading history</h2></div>`;
    }
});

function renderHistory(historyData) {
    const container = document.getElementById('history-container');
    container.innerHTML = '';

    if (!historyData || historyData.length === 0) {
        container.innerHTML = `
            <div class="empty-history" style="grid-column: 1 / -1; margin-top: 50px;">
                <i class="fa fa-folder-open mb-4" style="color: var(--primary); opacity: 0.5;"></i>
                <h2>No tests taken yet</h2>
                <p style="color: var(--text-secondary); margin-top: 10px; margin-bottom: 20px;">Start a test to see your history here.</p>
                <a href="test.html" class="btn btn-primary" style="display: inline-flex;">Take a Test</a>
            </div>
        `;
        return;
    }

    historyData.forEach((test, index) => {
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const testDate = new Date(test.startTime).toLocaleDateString(undefined, dateOptions);
        
        const accuracy = (test.accuracy || 0).toFixed(1);
        
        const card = document.createElement('div');
        card.className = 'glass-panel history-card fade-in';
        card.style.animationDelay = `${(index % 10) * 0.05}s`;

        let difficultyClass = '';
        if (test.currentDifficulty === 'EASY') difficultyClass = 'color: var(--success);';
        else if (test.currentDifficulty === 'MEDIUM') difficultyClass = 'color: var(--warning);';
        else if (test.currentDifficulty === 'HARD') difficultyClass = 'color: var(--error);';
        else difficultyClass = 'color: var(--primary);';

        card.innerHTML = `
            <div class="score-badge">${accuracy}%</div>
            
            <h3 class="text-xl font-bold" style="padding-right: 60px; margin-top: 5px;">
                ${test.topic || 'General Assessment'}
            </h3>
            
            <div class="history-meta mt-2">
                <i class="fa fa-calendar-alt"></i>
                <span>${testDate}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--glass-border);">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">SCORE</span>
                    <span style="font-weight: bold; font-size: 1.1rem; color: var(--text-primary);">${test.score || 0}</span>
                </div>
                
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">CORRECT</span>
                    <span style="font-weight: bold; font-size: 1.1rem; color: var(--text-primary);">${test.correctAnswers || 0} / ${test.totalQuestions || 0}</span>
                </div>

                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">DIFFICULTY</span>
                    <span style="font-weight: bold; font-size: 0.9rem; ${difficultyClass}">${test.currentDifficulty || 'N/A'}</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}
