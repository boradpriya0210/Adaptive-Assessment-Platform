// Result Page Logic
document.addEventListener('DOMContentLoaded', () => {
    // Get test ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId');

    if (!testId) {
        alert('No test ID provided');
        window.location.href = 'dashboard.html';
        return;
    }

    loadResults(testId);
});

async function loadResults(testId) {
    try {
        const response = await api.getResult(testId);

        if (response.success) {
            displayResults(response.data);
        } else {
            alert('Failed to load results: ' + response.message);
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Error loading results: ' + error.message);
        window.location.href = 'dashboard.html';
    }
}

function displayResults(data) {
    // Update basic stats
    document.getElementById('correct-answers').textContent = data.correctAnswers;
    document.getElementById('total-questions').textContent = data.totalQuestions;
    document.getElementById('final-score').textContent = data.score;
    document.getElementById('time-taken').textContent = formatTime(data.timeTaken);

    // Update accuracy
    const accuracy = data.accuracy || 0;
    document.getElementById('accuracy-percent').textContent = `${accuracy.toFixed(1)}%`;

    // Animate score circle
    animateScoreCircle(accuracy);

    // Update difficulty breakdown
    document.getElementById('easy-count').textContent = data.easyQuestions || 0;
    document.getElementById('medium-count').textContent = data.mediumQuestions || 0;
    document.getElementById('hard-count').textContent = data.hardQuestions || 0;
}

function animateScoreCircle(accuracy) {
    const circle = document.getElementById('score-circle-progress');
    const circumference = 2 * Math.PI * 90; // r = 90
    const offset = circumference - (accuracy / 100) * circumference;

    // Add gradient definition to SVG
    const svg = circle.closest('svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#6366f1');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#8b5cf6');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }

    // Animate
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 100);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
}
