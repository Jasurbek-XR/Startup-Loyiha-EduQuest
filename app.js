// --- MANTIQ VA DATA SAQLASH ---
const isPremium = localStorage.getItem('isPremium') === 'true';

let schedule = JSON.parse(localStorage.getItem('edu_schedule')) || [];
let homeworks = JSON.parse(localStorage.getItem('edu_homeworks')) || [];
let grades = JSON.parse(localStorage.getItem('edu_grades')) || [];
let chatMessages = JSON.parse(localStorage.getItem('edu_messages')) || [];

let userStats = JSON.parse(localStorage.getItem('edu_stats')) || {
    xp: 0,
    coins: 0,
    streak: 1,
    level: 1
};

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// --- GAMIFICATION VA ACHIEVEMENTS TIZIMI ---
function updateGamificationUI() {
    const streakEl = document.getElementById('streakCount');
    const coinEl = document.getElementById('coinCount');
    const levelEl = document.getElementById('userLevel');
    const xpTextEl = document.getElementById('xpText');
    const xpBarEl = document.getElementById('xpBar');

    const maxXp = userStats.level * 200;
    const progressPercent = Math.min((userStats.xp / maxXp) * 100, 100);

    if (streakEl) streakEl.innerText = userStats.streak;
    if (coinEl) coinEl.innerText = userStats.coins;
    if (levelEl) levelEl.innerText = `${userStats.level}-Level (Bilimdon)`;
    if (xpTextEl) xpTextEl.innerText = `${userStats.xp} / ${maxXp} XP`;
    if (xpBarEl) xpBarEl.style.width = `${progressPercent}%`;
}

window.addReward = function(xpAmount, coinAmount) {
    userStats.xp += xpAmount;
    userStats.coins += coinAmount;

    let maxXp = userStats.level * 200;
    if (userStats.xp >= maxXp) {
        userStats.xp -= maxXp;
        userStats.level += 1;
        alert(`🎉 TABRIKLAYMIZ! Siz ${userStats.level}-Level ga ko'tarildingiz!`);
    }

    saveData('edu_stats', userStats);
    updateGamificationUI();
};

// --- TASODIFIY MOTIVATSIYA BANNERI ---
const randomQuotes = [
    "🚀 <b>Xush kelibsiz!</b> Bugungi maqsadingiz sari yana bir qadam tashlang.",
    "🔥 <b>Ajoyib kun!</b> Yangi marralarni zabt etish vaqti keldi.",
    "💡 <b>Intiling!</b> Har bir kichik qadam katta muvaffaqiyatga olib boradi.",
    "⭐ <b>G'ayratli bo'ling!</b> Bugungi mehnat — ertangi g'alabangizdir.",
    "🎯 <b>Diqqatni jamlang!</b> Bugun o'rganilgan bilim — eng katta boylik.",
    "⚡ <b>Olg'a!</b> O'zingiz ustingizda ishlashdan to'xtamang.",
    "🏆 <b>Muvaffaqiyat kaliti:</b> Har kuni oz bo'lsa ham intilish!"
];

function setRandomBannerMessage() {
    const banner = document.getElementById('welcomeBanner');
    if (banner) {
        const randomIndex = Math.floor(Math.random() * randomQuotes.length);
        banner.innerHTML = randomQuotes[randomIndex];
    }
}

// --- PREMIUM MODAL VA LIMIT TIZIMI ---
function triggerPremiumLimit(reasonMessage) {
    const modal = document.getElementById('premiumModal');
    const modalText = document.getElementById('modalText');
    
    if (modalText && reasonMessage) {
        modalText.innerText = reasonMessage;
    }
    if (modal) {
        modal.classList.remove('hidden');
    } else {
        alert(reasonMessage);
    }
}

window.closePremiumModal = function() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
        modal.classList.add('hidden');
    }
};

// --- DARS JADVALI (Limit: 5) ---
const scheduleForm = document.getElementById('scheduleForm');
if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isPremium && schedule.length >= 5) {
            triggerPremiumLimit("Bepul tarifda ko'pi bilan 5 ta dars qo'shish mumkin. Premium xarid qiling!");
            return;
        }
        schedule.push({ 
            subject: document.getElementById('subjectName').value, 
            time: document.getElementById('subjectTime').value 
        });
        saveData('edu_schedule', schedule);
        renderSchedule();
        scheduleForm.reset();
    });
}

function renderSchedule() {
    const list = document.getElementById('scheduleList');
    if (!list) return;
    list.innerHTML = schedule.length === 0 ? '<li class="text-slate-500 text-xs text-center py-2">Darslar yo\'q</li>' : '';
    
    schedule.forEach((item, index) => {
        list.innerHTML += `
            <li class="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-700/60 text-xs">
                <div class="flex items-center gap-2 overflow-hidden">
                    <span class="font-medium text-slate-200 truncate">${item.subject}</span>
                    <span class="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-mono shrink-0">${item.time}</span>
                </div>
                <button onclick="window.deleteSchedule(${index})" class="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded transition text-[11px] font-medium flex items-center gap-1 shrink-0 ml-2">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </li>`;
    });
}

window.deleteSchedule = function(index) {
    schedule.splice(index, 1);
    saveData('edu_schedule', schedule);
    renderSchedule();
};

// --- UY VAZIFALARI (Limit: 3) ---
const hwForm = document.getElementById('hwForm');
if (hwForm) {
    hwForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isPremium && homeworks.length >= 3) {
            triggerPremiumLimit("Bepul tarifda ko'pi bilan 3 ta aktiv uy vazifasi qo'shish mumkin. Premium xarid qiling!");
            return;
        }
        homeworks.push({ 
            title: document.getElementById('hwTitle').value, 
            dueDate: document.getElementById('hwDueDate').value, 
            done: false 
        });
        saveData('edu_homeworks', homeworks);
        renderHomeworks();
        hwForm.reset();
    });
}

function renderHomeworks() {
    const list = document.getElementById('hwList');
    const stats = document.getElementById('hwStats');
    if (!list) return;

    list.innerHTML = homeworks.length === 0 ? '<li class="text-slate-500 text-xs text-center py-2">Uy vazifalari yo\'q</li>' : '';
    let completedCount = 0;

    homeworks.forEach((item, index) => {
        if (item.done) completedCount++;
        list.innerHTML += `
            <li class="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-700/60 text-xs gap-2">
                <span class="${item.done ? 'line-through text-slate-500' : 'text-slate-200'} truncate">${item.title} (${item.dueDate})</span>
                <div class="flex items-center gap-2 shrink-0">
                    <button onclick="window.toggleHomework(${index})" class="text-xs px-2 py-1 rounded transition ${item.done ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}">
                        ${item.done ? 'Bajarildi' : 'Bajarish'}
                    </button>
                    <button onclick="window.deleteHomework(${index})" class="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded transition flex items-center">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </li>`;
    });
    if (stats) stats.innerText = `${completedCount}/${homeworks.length} bajarildi`;
}

window.toggleHomework = function(index) {
    homeworks[index].done = !homeworks[index].done;
    if (homeworks[index].done) {
        addReward(20, 5);
    }
    saveData('edu_homeworks', homeworks);
    renderHomeworks();
};

window.deleteHomework = function(index) {
    homeworks.splice(index, 1);
    saveData('edu_homeworks', homeworks);
    renderHomeworks();
};

// --- BAHOLAR KUZATUVI (Limit: 5) ---
const gradeForm = document.getElementById('gradeForm');
if (gradeForm) {
    gradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!isPremium && grades.length >= 5) {
            triggerPremiumLimit("Bepul tarifda ko'pi bilan 5 ta baho qo'shish mumkin. Premium xarid qiling!");
            return;
        }

        grades.push({
            subject: document.getElementById('gradeSubject').value,
            score: document.getElementById('gradeValue').value
        });
        saveData('edu_grades', grades);
        renderGrades();
        gradeForm.reset();
    });
}

function renderGrades() {
    const list = document.getElementById('gradeList');
    const avgText = document.getElementById('avgGrade');
    if (!list) return;

    list.innerHTML = grades.length === 0 ? '<li class="text-slate-500 text-xs text-center py-2">Baholar yo\'q</li>' : '';
    let totalScore = 0;

    grades.forEach((item, index) => {
        totalScore += parseFloat(item.score) || 0;
        list.innerHTML += `
            <li class="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-700/60 text-xs">
                <div class="flex items-center gap-2 overflow-hidden">
                    <span class="font-medium text-slate-200 truncate">${item.subject}</span>
                    <span class="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold shrink-0">${item.score}</span>
                </div>
                <button onclick="window.deleteGrade(${index})" class="text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-1 rounded transition flex items-center">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </li>`;
    });
    if (avgText) {
        avgText.innerText = grades.length > 0 ? (totalScore / grades.length).toFixed(1) : '0.0';
    }
}

window.deleteGrade = function(index) {
    grades.splice(index, 1);
    saveData('edu_grades', grades);
    renderGrades();
};

// --- SINFDOSHLAR DOSHTASI (CHAT) ---
const noteForm = document.getElementById('noteForm');
if (noteForm) {
    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!isPremium) {
            triggerPremiumLimit("Sinfdoshlar doshtasiga xabar yozish faqat Premium foydalanuvchilar uchun ruxsat etilgan!");
            return;
        }

        const nameInput = document.getElementById('noteAuthor').value;
        const msgInput = document.getElementById('noteText').value;

        if (nameInput && msgInput) {
            chatMessages.push({ name: nameInput, message: msgInput });
            saveData('edu_messages', chatMessages);
            renderChat();
            document.getElementById('noteText').value = '';
        }
    });
}

function renderChat() {
    const list = document.getElementById('noteList');
    if (!list) return;

    list.innerHTML = chatMessages.length === 0 ? '<div class="text-slate-500 text-xs text-center py-2">Xabarlar yo\'q</div>' : '';

    chatMessages.forEach((item) => {
        list.innerHTML += `
            <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-700/60 mb-2">
                <div class="text-xs font-bold text-indigo-400 mb-1">${item.name}</div>
                <div class="text-xs text-slate-300">${item.message}</div>
            </div>`;
    });
}

// --- POMODORO TAYMERI ---
let pomodoroTimer = null;
let pomodoroTimeLeft = 25 * 60;
let isPomodoroRunning = false;

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;
    const minutes = Math.floor(pomodoroTimeLeft / 60);
    const seconds = pomodoroTimeLeft % 60;
    timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// --- GEMINI AI INTEGRATSIYASI ---
const GEMINI_API_KEY = "AQ.Ab8RN6KP-1hArvDdvaS5RAWCgZpZHjabBg7QBVCoYHPy6IYOCg"; 

function setupGeminiAI() {
    const aiToggleBtn = document.getElementById('aiToggleBtn');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const aiChatBox = document.getElementById('aiChatBox');
    const aiForm = document.getElementById('aiForm');
    const aiInput = document.getElementById('aiInput');
    const aiMessages = document.getElementById('aiMessages');

    if (aiToggleBtn && aiChatBox) {
        aiToggleBtn.addEventListener('click', () => aiChatBox.classList.toggle('hidden'));
        aiCloseBtn.addEventListener('click', () => aiChatBox.classList.add('hidden'));
    }

    if (aiForm) {
        aiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userMsg = aiInput.value.trim();
            if (!userMsg) return;

            aiMessages.innerHTML += `
                <div class="bg-indigo-600 text-white p-2.5 rounded-lg ml-auto max-w-[80%] text-right font-medium">
                    ${userMsg}
                </div>`;
            aiInput.value = '';
            aiMessages.scrollTop = aiMessages.scrollHeight;

            const loadingId = `loading-${Date.now()}`;
            aiMessages.innerHTML += `
                <div id="${loadingId}" class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700 text-slate-400 italic">
                    AI o'ylanmoqda...
                </div>`;
            aiMessages.scrollTop = aiMessages.scrollHeight;

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-goog-api-key': GEMINI_API_KEY
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: `Siz EduQuest platformasining o'quvchilarga yordam beradigan AI yordamchisiz. Javobni qisqa, tushunarli va o'zbek tilida bering. Savol: ${userMsg}` }]
                        }]
                    })
                });

                const data = await response.json();
                document.getElementById(loadingId)?.remove();

                if (data.error) {
                    throw new Error(data.error.message || "API xatoligi");
                }

                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                    const aiReply = data.candidates[0].content.parts[0].text;
                    aiMessages.innerHTML += `
                        <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700 text-slate-200">
                            ${aiReply.replace(/\n/g, '<br>')}
                        </div>`;
                } else {
                    throw new Error("Javob olinmadi");
                }
            } catch (err) {
                document.getElementById(loadingId)?.remove();
                aiMessages.innerHTML += `
                    <div class="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg">
                        ⚠️ Xatolik: ${err.message}
                    </div>`;
            }
            aiMessages.scrollTop = aiMessages.scrollHeight;
        });
    }
}

// SAHIFA YUKLANGANDA BARCHA TIZIMLARNI ISHGA TUSHIRISH
document.addEventListener('DOMContentLoaded', () => {
    setRandomBannerMessage();
    renderSchedule();
    renderHomeworks();
    renderGrades();
    renderChat();
    updateGamificationUI();
    updateTimerDisplay();
    setupGeminiAI();

    const startBtn = document.getElementById('startTimerBtn');
    const pauseBtn = document.getElementById('pauseTimerBtn');
    const resetBtn = document.getElementById('resetTimerBtn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (!isPomodoroRunning) {
                isPomodoroRunning = true;
                pomodoroTimer = setInterval(() => {
                    if (pomodoroTimeLeft > 0) {
                        pomodoroTimeLeft--;
                        updateTimerDisplay();
                    } else {
                        clearInterval(pomodoroTimer);
                        isPomodoroRunning = false;
                        addReward(30, 10);
                        alert("⏰ Vaqt tugadi! Mukofot olindi (+30 XP, +10 Coin). Biroz dam oling.");
                        pomodoroTimeLeft = 25 * 60;
                        updateTimerDisplay();
                    }
                }, 1000);
            }
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            clearInterval(pomodoroTimer);
            isPomodoroRunning = false;
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            clearInterval(pomodoroTimer);
            isPomodoroRunning = false;
            pomodoroTimeLeft = 25 * 60;
            updateTimerDisplay();
        });
    }
});