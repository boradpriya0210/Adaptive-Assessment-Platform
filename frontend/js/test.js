import { api } from './api.js';
import { utils } from './utils.js';

let currentTestId = null;
let currentQuestion = null;
let timer = 30;
let timerInterval = null;
let selectedOption = null;
let questionCount = 0;
const TOTAL_QUESTIONS = 10; // Assuming 10 questions per test

let selectedTopic = 'All';
let selectedDifficulty = 'EASY';

document.addEventListener('DOMContentLoaded', async () => {
    utils.authGuard();
    initConfigScreen();

    document.getElementById('submit-answer-btn').addEventListener('click', submitAnswer);
});

function initConfigScreen() {
    // Topic Selection
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedTopic = card.dataset.topic;
        });
    });

    // Difficulty Selection
    document.querySelectorAll('.diff-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedDifficulty = card.dataset.diff;
        });
    });

    // Begin Test Button
    document.getElementById('begin-test-btn').addEventListener('click', () => {
        document.getElementById('test-config').style.display = 'none';
        document.getElementById('loader').style.display = 'flex';
        startTest(selectedTopic, selectedDifficulty);
    });
}

async function startTest(topic, difficulty) {
    try {
        const response = await api.post('/test/start', { topic, difficulty });
        
        if (response.success) {
            currentTestId = response.data.testId;
            showQuestion(response.data);
            document.getElementById('loader').style.display = 'none';
            document.getElementById('test-content').style.display = 'block';
        } else {
            utils.showToast(response.message || 'Failed to start test', 'error');
            setTimeout(() => window.location.href = 'dashboard.html', 2000);
        }
    } catch (error) {
        utils.showToast(error.message || 'Error initializing test', 'error');
        setTimeout(() => window.location.reload(), 2000);
    }
}

function showQuestion(data) {
    if (data.testCompleted) {
        const tid = data.testId || currentTestId;
        window.location.href = `result.html?testId=${tid}`;
        return;
    }

    currentQuestion = data.nextQuestion;
    questionCount++;
    
    // Update Progress
    const progress = (questionCount / TOTAL_QUESTIONS) * 100;
    document.getElementById('progress-bar-fill').style.width = `${progress}%`;

    // Update Difficulty
    const diffContainer = document.getElementById('difficulty-container');
    const diff = data.currentDifficulty || 'MEDIUM';
    diffContainer.innerHTML = `<span class="difficulty-badge difficulty-${diff.toLowerCase()}">${diff}</span>`;

    // Update Question
    document.getElementById('question-text').textContent = currentQuestion.questionText;

    // Update Options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    selectedOption = null;
    document.getElementById('submit-answer-btn').disabled = true;

    // Assuming options are in an object or array in QuestionDTO
    // Let's assume QuestionDTO has: optionA, optionB, optionC, optionD
    const options = [
        { key: 'A', text: currentQuestion.optionA },
        { key: 'B', text: currentQuestion.optionB },
        { key: 'C', text: currentQuestion.optionC },
        { key: 'D', text: currentQuestion.optionD }
    ];

    options.forEach((opt, index) => {
        const card = document.createElement('div');
        card.className = 'glass-panel option-card';
        card.innerHTML = `
            <div class="option-indicator">${opt.key}</div>
            <div style="font-weight: 500;">${opt.text}</div>
        `;
        
        card.onclick = () => selectOption(card, opt.key);
        optionsContainer.appendChild(card);
    });

    startTimer();
}

function selectOption(card, key) {
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedOption = key;
    document.getElementById('submit-answer-btn').disabled = false;
}

function startTimer() {
    clearInterval(timerInterval);
    timer = 30;
    updateTimerUI();

    timerInterval = setInterval(() => {
        timer--;
        updateTimerUI();
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            submitAnswer(); // Auto-submit on timeout
        }
    }, 1000);
}

function updateTimerUI() {
    const text = document.getElementById('timer-text');
    const circle = document.getElementById('timer-circle-progress');
    
    text.textContent = timer;
    
    // Calculate dashoffset (283 is the circumference for r=45)
    // offset = circumference * (1 - portion)
    const offset = 283 * (1 - timer / 30);
    circle.style.strokeDashoffset = offset;

    // Change color on low time
    if (timer <= 10) {
        circle.style.stroke = 'var(--error)';
        text.style.color = 'var(--error)';
    } else {
        circle.style.stroke = 'var(--primary)';
        text.style.color = 'var(--text-primary)';
    }
}

async function submitAnswer() {
    clearInterval(timerInterval);
    document.getElementById('submit-answer-btn').disabled = true;
    
    const payload = {
        testId: currentTestId,
        questionId: currentQuestion.questionId,
        selectedOption: selectedOption || 'NONE', // Handle timeout
        timeTaken: (30 - timer)
    };

    try {
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('test-content').style.display = 'none';

        const response = await api.post('/test/submit-answer', payload);
        
        if (response.success) {
            // Provide visual feedback if backend says isCorrect
            if (response.data.isCorrect) {
                utils.showToast('Correct!', 'success', 1000);
            } else {
                utils.showToast('Wrong answer', 'error', 1000);
            }

            // Small delay for feedback before next question
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
                document.getElementById('test-content').style.display = 'block';
                showQuestion(response.data);
            }, 1000);
        } else {
            utils.showToast(response.message || 'Error submitting answer', 'error');
            document.getElementById('loader').style.display = 'none';
            document.getElementById('test-content').style.display = 'block';
            document.getElementById('submit-answer-btn').disabled = false;
        }
    } catch (error) {
        utils.showToast(error.message || 'Network error', 'error');
        document.getElementById('loader').style.display = 'none';
        document.getElementById('test-content').style.display = 'block';
        document.getElementById('submit-answer-btn').disabled = false;
    }
}
