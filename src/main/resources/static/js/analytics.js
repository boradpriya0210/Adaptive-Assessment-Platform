// Analytics Page Logic
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!requireAuth()) return;

    loadAnalytics();
});

async function loadAnalytics() {
    try {
        const response = await api.getPerformance();

        if (response.success && response.data) {
            displayAnalytics(response.data);
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function displayAnalytics(data) {
    // Overall stats
    const accuracy = data.overallAccuracy || 0;
    const avgTime = data.avgTime || 0;

    document.getElementById('overall-accuracy').textContent = `${accuracy.toFixed(1)}%`;
    document.getElementById('avg-time').textContent = `${avgTime.toFixed(1)}s`;

    // Weak topics
    if (data.weakTopics && data.weakTopics.length > 0) {
        const weakTopicsContainer = document.getElementById('weak-topics');
        weakTopicsContainer.innerHTML = '';

        data.weakTopics.forEach(topic => {
            const tag = document.createElement('div');
            tag.className = 'topic-tag topic-weak';
            tag.textContent = topic;
            weakTopicsContainer.appendChild(tag);
        });
    }

    // Strengths
    if (data.strengths && data.strengths.length > 0) {
        const strengthsContainer = document.getElementById('strengths');
        strengthsContainer.innerHTML = '';

        data.strengths.forEach(topic => {
            const tag = document.createElement('div');
            tag.className = 'topic-tag topic-strong';
            tag.textContent = topic;
            strengthsContainer.appendChild(tag);
        });
    }
}
