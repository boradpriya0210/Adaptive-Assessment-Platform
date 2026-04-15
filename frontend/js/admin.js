import { utils } from './utils.js';
import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Auth & Permission Check
    utils.authGuard();
    utils.adminGuard();

    // State
    let currentQuestions = [];
    let currentUsers = [];
    let dashboardStats = {};
    let chartInstances = {}; // track Chart.js instances to destroy on re-render

    // Elements
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabTitle = document.getElementById('tab-title');
    const tabSubtitle = document.getElementById('tab-subtitle');
    const logoutBtn = document.getElementById('logout-btn');
    const questionSearch = document.getElementById('question-search');
    const topicFilter = document.getElementById('topic-filter');

    // Tab Switching Logic
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');

            // Update UI
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) content.classList.add('active');
            });

            // Update Header
            updateHeader(tabId);
            
            // Load Data
            loadTabData(tabId);
        });
    });

    function updateHeader(tabId) {
        switch (tabId) {
            case 'overview':
                tabTitle.textContent = 'Dashboard Overview';
                tabSubtitle.textContent = "Welcome back, Admin. Here's what's happening today.";
                break;
            case 'questions':
                tabTitle.textContent = 'Question Bank';
                tabSubtitle.textContent = 'Manage and organize all test questions from here.';
                break;
            case 'users':
                tabTitle.textContent = 'User Management';
                tabSubtitle.textContent = 'View and manage all registered student accounts.';
                break;
            case 'analytics':
                tabTitle.textContent = 'Analytics';
                tabSubtitle.textContent = 'Platform-wide insights, statistics, and question bank analysis.';
                break;
        }
    }

    async function loadTabData(tabId) {
        switch (tabId) {
            case 'overview':
                await fetchStats();
                await fetchRecentTests();
                break;
            case 'questions':
                await fetchQuestions();
                break;
            case 'users':
                await fetchUsers();
                break;
            case 'analytics':
                await fetchAnalyticsData();
                break;
        }
    }

    // --- Analytics ---

    async function fetchAnalyticsData() {
        try {
            // Fetch stats for KPI cards & charts
            const statsData = await api.get('/admin/stats');
            if (statsData.success) {
                dashboardStats = statsData.data;
            }

            // Fetch questions for topic breakdown
            const qData = await api.get('/admin/questions/all');
            if (qData.success) {
                currentQuestions = qData.data;
            }

            drawAnalyticsCharts();
        } catch (err) {
            console.error('Analytics fetch error:', err);
        }
    }

    function destroyChart(key) {
        if (chartInstances[key]) {
            chartInstances[key].destroy();
            delete chartInstances[key];
        }
    }

    function drawAnalyticsCharts() {
        const stats = dashboardStats;

        // --- KPI Cards ---
        document.getElementById('an-stat-questions').textContent = stats.totalQuestions ?? '—';
        document.getElementById('an-stat-users').textContent    = stats.totalUsers    ?? '—';
        document.getElementById('an-stat-tests').textContent    = stats.totalTests    ?? '—';

        // Shared Chart.js defaults
        const textSecondary = 'rgba(148,163,184,0.85)';
        Chart.defaults.color = textSecondary;
        Chart.defaults.font.family = "'Inter', 'Outfit', sans-serif";

        // ── 1. Difficulty Doughnut ──────────────────────────────────────────
        const breakdown = stats.difficultyBreakdown || {};
        const diffValues = [
            breakdown.EASY   || 0,
            breakdown.MEDIUM || 0,
            breakdown.HARD   || 0
        ];
        destroyChart('difficulty');
        chartInstances.difficulty = new Chart(
            document.getElementById('difficultyChart'),
            {
                type: 'doughnut',
                data: {
                    labels: ['Easy', 'Medium', 'Hard'],
                    datasets: [{
                        data: diffValues,
                        backgroundColor: [
                            'rgba(34,197,94,0.85)',
                            'rgba(245,158,11,0.85)',
                            'rgba(239,68,68,0.85)'
                        ],
                        borderColor: [
                            'rgba(34,197,94,1)',
                            'rgba(245,158,11,1)',
                            'rgba(239,68,68,1)'
                        ],
                        borderWidth: 2,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '68%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => ` ${ctx.label}: ${ctx.parsed} questions`
                            }
                        }
                    }
                }
            }
        );
        // Custom legend
        const legendEl = document.getElementById('difficulty-legend');
        const diffColors = ['#22c55e','#f59e0b','#ef4444'];
        const diffLabels = ['Easy','Medium','Hard'];
        legendEl.innerHTML = diffLabels.map((l, i) => `
            <div style="display:flex;align-items:center;gap:6px;font-size:0.82rem;">
                <span style="width:12px;height:12px;border-radius:3px;background:${diffColors[i]};display:inline-block;"></span>
                <span>${l}</span>
                <strong>${diffValues[i]}</strong>
            </div>
        `).join('');

        // ── 2. Platform Overview Bar ────────────────────────────────────────
        destroyChart('overview');
        chartInstances.overview = new Chart(
            document.getElementById('overviewChart'),
            {
                type: 'bar',
                data: {
                    labels: ['Questions', 'Users', 'Tests Taken'],
                    datasets: [{
                        label: 'Count',
                        data: [
                            stats.totalQuestions || 0,
                            stats.totalUsers     || 0,
                            stats.totalTests     || 0
                        ],
                        backgroundColor: [
                            'rgba(79,70,229,0.7)',
                            'rgba(236,72,153,0.7)',
                            'rgba(34,197,94,0.7)'
                        ],
                        borderColor: [
                            'rgba(79,70,229,1)',
                            'rgba(236,72,153,1)',
                            'rgba(34,197,94,1)'
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { precision: 0 }
                        }
                    }
                }
            }
        );

        // ── 3. Topic Breakdown Bar ──────────────────────────────────────────
        const topicCounts = {};
        currentQuestions.forEach(q => {
            topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
        });
        const topicLabels = Object.keys(topicCounts).sort();
        const topicValues = topicLabels.map(t => topicCounts[t]);

        const topicColors = topicLabels.map((_, i) => {
            const hues = [260, 320, 180, 40, 140, 0, 200, 280];
            const h = hues[i % hues.length];
            return `hsla(${h},70%,60%,0.75)`;
        });

        destroyChart('topicBreakdown');
        chartInstances.topicBreakdown = new Chart(
            document.getElementById('topicBreakdownChart'),
            {
                type: 'bar',
                data: {
                    labels: topicLabels.length ? topicLabels : ['No data'],
                    datasets: [{
                        label: 'Questions',
                        data: topicValues.length ? topicValues : [0],
                        backgroundColor: topicColors,
                        borderColor: topicColors.map(c => c.replace('0.75', '1')),
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { precision: 0 }
                        }
                    }
                }
            }
        );
    }

    // --- API Calls ---

    async function fetchStats() {
        try {
            const data = await api.get('/admin/stats');
            if (data.success) {
                dashboardStats = data.data;
                document.getElementById('stat-users').textContent = dashboardStats.totalUsers;
                document.getElementById('stat-questions').textContent = dashboardStats.totalQuestions;
                document.getElementById('stat-tests').textContent = dashboardStats.totalTests;
            }
        } catch (err) {
            console.error('Stats fetch error:', err);
        }
    }

    async function fetchRecentTests() {
        try {
            const data = await api.get('/admin/recent-tests');
            if (data.success) {
                renderRecentTests(data.data);
            }
        } catch (err) {
            console.error('Recent tests fetch error:', err);
        }
    }

    async function fetchQuestions() {
        try {
            const data = await api.get('/admin/questions/all');
            if (data.success) {
                currentQuestions = data.data;
                populateTopicFilter(currentQuestions);
                renderQuestions(currentQuestions);
            }
        } catch (err) {
            console.error('Questions fetch error:', err);
        }
    }

    async function fetchUsers() {
        try {
            const data = await api.get('/admin/users');
            if (data.success) {
                currentUsers = data.data;
                renderUsers(currentUsers);
            }
        } catch (err) {
            console.error('Users fetch error:', err);
        }
    }

    // --- Rendering ---

    function renderRecentTests(tests) {
        const tbody = document.querySelector('#recent-activity-table tbody');
        tbody.innerHTML = tests.map(test => `
            <tr>
                <td>${test.userId}</td>
                <td>${test.testId.substring(0, 8)}...</td>
                <td><span class="badge badge-${test.currentDifficulty.toLowerCase()}">${test.currentDifficulty}</span></td>
                <td>${test.score} / ${test.totalQuestions * 10}</td>
                <td>${utils.formatDate(test.startTime)}</td>
            </tr>
        `).join('') || '<tr><td colspan="5" style="text-align: center;">No recent activity found.</td></tr>';
    }

    function renderQuestions(questions) {
        const tbody = document.querySelector('#questions-table tbody');
        tbody.innerHTML = questions.map(q => `
            <tr>
                <td>${q.topic}</td>
                <td><span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
                <td title="${q.questionText}">${q.questionText.substring(0, 60)}${q.questionText.length > 60 ? '...' : ''}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-secondary btn-icon edit-btn" data-id="${q.questionId}">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-secondary btn-icon delete-btn" data-id="${q.questionId}" style="color: var(--error);">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" style="text-align: center;">No questions found.</td></tr>';

        // Add Event Listeners for Edit/Delete
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = () => openEditModal(btn.dataset.id);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => handleDeleteQuestion(btn.dataset.id);
        });
    }

    function populateTopicFilter(questions) {
        const topics = [...new Set(questions.map(q => q.topic))].sort();
        const currentVal = topicFilter.value;
        
        topicFilter.innerHTML = '<option value="all">All Topics</option>' + 
            topics.map(t => `<option value="${t}">${t}</option>`).join('');
        
        topicFilter.value = currentVal || 'all';
    }

    function handleFilter() {
        const term = questionSearch.value.toLowerCase();
        const selectedTopic = topicFilter.value;

        const filtered = currentQuestions.filter(q => {
            const matchesSearch = q.questionText.toLowerCase().includes(term) || q.topic.toLowerCase().includes(term);
            const matchesTopic = selectedTopic === 'all' || q.topic === selectedTopic;
            return matchesSearch && matchesTopic;
        });

        renderQuestions(filtered);
    }

    function renderUsers(users) {
        const tbody = document.querySelector('#users-table tbody');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="badge" style="background: rgba(255,255,255,0.05);">${u.role}</span></td>
                <td>${u.userId.substring(0, 8)}...</td>
            </tr>
        `).join('') || '<tr><td colspan="4" style="text-align: center;">No users found.</td></tr>';
    }

    // --- CRUD Operations ---

    const modal = document.getElementById('question-modal');
    const questionForm = document.getElementById('question-form');
    const addBtn = document.getElementById('add-question-btn');
    const closeBtns = document.querySelectorAll('.modal-close, .modal-close-btn');

    addBtn.onclick = () => {
        document.getElementById('modal-title').textContent = 'Add New Question';
        document.getElementById('edit-question-id').value = '';
        questionForm.reset();
        modal.style.display = 'flex';
    };

    closeBtns.forEach(btn => btn.onclick = () => modal.style.display = 'none');

    function openEditModal(id) {
        const q = currentQuestions.find(q => q.questionId === id);
        if (!q) return;

        document.getElementById('modal-title').textContent = 'Edit Question';
        document.getElementById('edit-question-id').value = q.questionId;
        document.getElementById('q-topic').value = q.topic;
        document.getElementById('q-difficulty').value = q.difficulty;
        document.getElementById('q-text').value = q.questionText;
        document.getElementById('q-oa').value = q.optionA;
        document.getElementById('q-ob').value = q.optionB;
        document.getElementById('q-oc').value = q.optionC;
        document.getElementById('q-od').value = q.optionD;
        document.getElementById('q-correct').value = q.correctAnswer;

        modal.style.display = 'flex';
    }

    questionForm.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-question-id').value;
        
        const questionData = {
            topic: document.getElementById('q-topic').value,
            difficulty: document.getElementById('q-difficulty').value,
            questionText: document.getElementById('q-text').value,
            optionA: document.getElementById('q-oa').value,
            optionB: document.getElementById('q-ob').value,
            optionC: document.getElementById('q-oc').value,
            optionD: document.getElementById('q-od').value,
            correctAnswer: document.getElementById('q-correct').value
        };

        try {
            let data;
            if (id) {
                data = await api.put(`/admin/questions/update/${id}`, questionData);
            } else {
                data = await api.post('/admin/questions/add', questionData);
            }

            if (data.success) {
                utils.showToast(id ? 'Question updated!' : 'Question added!', 'success');
                modal.style.display = 'none';
                fetchQuestions();
                fetchStats();
            } else {
                utils.showToast(data.message, 'error');
            }
        } catch (err) {
            utils.showToast(err.message || 'Something went wrong', 'error');
        }
    };

    async function handleDeleteQuestion(id) {
        if (!confirm('Are you sure you want to delete this question?')) return;

        try {
            const data = await api.delete(`/admin/questions/delete/${id}`);
            if (data.success) {
                utils.showToast('Question deleted', 'success');
                fetchQuestions();
                fetchStats();
            } else {
                utils.showToast(data.message, 'error');
            }
        } catch (err) {
            utils.showToast(err.message || 'Failed to delete question', 'error');
        }
    }

    // Search & Filter functionality
    questionSearch.oninput = handleFilter;
    topicFilter.onchange = handleFilter;

    // Initial Load
    loadTabData('overview');
    
    // Logout
    logoutBtn.onclick = () => utils.logout();
});

