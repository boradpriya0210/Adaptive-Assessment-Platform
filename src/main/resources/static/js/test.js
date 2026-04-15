// Test Interface Logic
let testId = null;
let currentQuestion = null;
let selectedOption = null;
let timerInterval = null;
let startTime = null;
let timeRemaining = 60;

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!requireAuth()) return;

    // Start test
    initializeTest();

    // Setup event listeners
    document.getElementById('submit-btn').addEventListener('click', submitAnswer);
});

async function initializeTest() {
    showLoading(true);

    try {
        const response = await api.startTest();

        if (response.success) {
            testId = response.data.testId;
            loadQuestion(response.data);
        } else {
            alert('Failed to start test: ' + response.message);
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Error starting test: ' + error.message);
        window.location.href = 'dashboard.html';
    } finally {
        showLoading(false);
    }
}

function loadQuestion(data) {
    currentQuestion = data.nextQuestion;

    // Update question display
    document.getElementById('topic-badge').textContent = currentQuestion.topic;
    document.getElementById('difficulty-badge').textContent = currentQuestion.difficulty;
    document.getElementById('difficulty-badge').className = `difficulty-badge ${currentQuestion.difficulty.toLowerCase()}`;
    document.getElementById('question-text').textContent = currentQuestion.questionText;

    // Update stats
    document.getElementById('question-count').textContent = `${data.totalQuestions}/${20}`;
    document.getElementById('score').textContent = data.totalQuestions > 0 ?
        `${data.correctAnswers}/${data.totalQuestions}` : '0/0';

    // Update difficulty meter
    updateDifficultyMeter(data.currentDifficulty);

    // Load options
    loadOptions();

    // Reset selection
    selectedOption = null;
    document.getElementById('submit-btn').disabled = true;

    // Hide feedback
    document.getElementById('feedback').style.display = 'none';

    // Start timer
    startTimer();
}

function loadOptions() {
    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = '';

    const options = [
        { label: 'A', text: currentQuestion.optionA },
        { label: 'B', text: currentQuestion.optionB },
        { label: 'C', text: currentQuestion.optionC },
        { label: 'D', text: currentQuestion.optionD }
    ];

    options.forEach(option => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card fade-in';
        optionCard.innerHTML = `
            <div class="option-label">${option.label}</div>
            <div class="option-text">${option.text}</div>
        `;

        optionCard.addEventListener('click', () => selectOption(option.label, optionCard));
        optionsGrid.appendChild(optionCard);
    });
}

function selectOption(option, cardElement) {
    // Remove previous selection
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Mark new selection
    cardElement.classList.add('selected');
    selectedOption = option;

    // Enable submit button
    document.getElementById('submit-btn').disabled = false;
}

async function submitAnswer() {
    if (!selectedOption) return;

    // Disable submit button
    document.getElementById('submit-btn').disabled = true;

    // Stop timer
    stopTimer();

    // Calculate time taken
    const timeTaken = 60 - timeRemaining;

    showLoading(true);

    try {
        const response = await api.submitAnswer({
            testId: testId,
            questionId: currentQuestion.questionId,
            selectedOption: selectedOption,
            timeTaken: timeTaken
        });

        if (response.success) {
            // Show feedback
            showFeedback(response.data.isCorrect);

            // Wait 2 seconds before loading next question
            setTimeout(() => {
                if (response.data.testCompleted) {
                    // Test finished, redirect to results
                    window.location.href = `result.html?testId=${testId}`;
                } else {
                    // Load next question
                    loadQuestion(response.data);
                }
                showLoading(false);
            }, 2000);
        } else {
            alert('Error submitting answer: ' + response.message);
            showLoading(false);
        }
    } catch (error) {
        alert('Error submitting answer: ' + error.message);
        showLoading(false);
    }
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackText = document.getElementById('feedback-text');

    feedback.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
    feedbackIcon.textContent = isCorrect ? '✓' : '✗';
    feedbackText.textContent = isCorrect ? 'Correct! Great job!' : 'Incorrect. Keep learning!';
    feedback.style.display = 'flex';

    // Highlight the selected option
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        if (card.classList.contains('selected')) {
            card.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
    });
}

function updateDifficultyMeter(difficulty) {
    const indicator = document.getElementById('difficulty-indicator');
    indicator.className = 'difficulty-indicator';

    switch (difficulty) {
        case 'EASY':
            indicator.classList.add('easy-level');
            break;
        case 'MEDIUM':
            indicator.classList.add('medium-level');
            break;
        case 'HARD':
            indicator.classList.add('hard-level');
            break;
    }
}

function startTimer() {
    timeRemaining = 60;
    startTime = Date.now();
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopTimer();
            // Auto-submit with no answer
            submitAnswer();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const timerValue = document.getElementById('timer-value');
    const timerCircle = document.getElementById('timer-circle');

    timerValue.textContent = timeRemaining;

    // Update circle progress (283 is the circumference for r=45)
    const progress = (timeRemaining / 60) * 283;
    timerCircle.style.strokeDashoffset = 283 - progress;

    // Update color based on time remaining
    timerCircle.classList.remove('warning', 'danger');
    if (timeRemaining <= 10) {
        timerCircle.classList.add('danger');
    } else if (timeRemaining <= 30) {
        timerCircle.classList.add('warning');
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
}
