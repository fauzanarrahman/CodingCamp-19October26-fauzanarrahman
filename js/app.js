// ============================================================
// Life Dashboard (Dasbor Kehidupan) — Vanilla JavaScript
// ============================================================

const KEYS = {
    tasks: 'ld_tasks',
    links: 'ld_links',
    theme: 'ld_theme',
    sort: 'ld_sort_mode'
};
const FOCUS_SECONDS = 25 * 60;
const SORT_MODES = ['creation', 'status'];
const THEMES = ['light', 'dark'];

const $ = (id) => document.getElementById(id);

// ============================================================
// Greeting
// ============================================================
function pad2(n) { return String(n).padStart(2, '0'); }

function formatTime(date) {
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

function formatDate(date) {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return 'Selamat pagi';
    if (hour >= 12 && hour < 15) return 'Selamat siang';
    if (hour >= 15 && hour < 19) return 'Selamat sore';
    return 'Selamat malam';
}

function updateGreeting() {
    const now = new Date();
    $('clock').textContent = formatTime(now);
    $('date').textContent = formatDate(now);
    $('greeting-text').textContent = getGreeting(now.getHours());
}

// ============================================================
// Timer
// ============================================================
function formatTimer(totalSeconds) {
    return `${pad2(Math.floor(totalSeconds / 60))}:${pad2(totalSeconds % 60)}`;
}

const timer = { remaining: FOCUS_SECONDS, intervalId: null, endTime: 0 };

function renderTimer() {
    $('timer').textContent = formatTimer(timer.remaining);
}

function stopTimer() {
    if (timer.intervalId === null) return; // not running: no change
    clearInterval(timer.intervalId);
    timer.intervalId = null;
}

function startTimer() {
    if (timer.intervalId !== null || timer.remaining <= 0) return;
    $('timer-message').hidden = true;
    timer.endTime = Date.now() + timer.remaining * 1000;
    timer.intervalId = setInterval(() => {
        timer.remaining = Math.max(0, Math.round((timer.endTime - Date.now()) / 1000));
        renderTimer();
        if (timer.remaining === 0) {
            stopTimer();
            $('timer-message').hidden = false;
        }
    }, 250);
}

function resetTimer() {
    stopTimer();
    timer.remaining = FOCUS_SECONDS;
    $('timer-message').hidden = true;
    renderTimer();
}

// ============================================================
// Storage
// ============================================================
// Returns { ok, value } so callers can show an error when storage fails.
function storageRead(key) {
    try {
        return { ok: true, value: localStorage.getItem(key) };
    } catch (e) {
        return { ok: false, value: null };
    }
}

function storageWrite(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        return false;
    }
}

function loadList(key) {
    const res = storageRead(key);
    if (!res.ok || res.value === null) return [];
    try {
        const parsed = JSON.parse(res.value);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

// ============================================================
// To-Do
// ============================================================
let tasks = loadList(KEYS.tasks).filter(
    (t) => t && typeof t.id === 'string' && typeof t.text === 'string'
).map((t) => ({ id: t.id, text: t.text, done: t.done === true }));

let editingId = null;
let sortMode = 'creation';

function newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function normalizeText(text) { return text.trim().toLowerCase(); }

function isDuplicate(text, ignoreId) {
    const key = normalizeText(text);
    return tasks.some((t) => t.id !== ignoreId && normalizeText(t.text) === key);
}

function addTask(text) {
    const clean = text.trim();
    if (!clean) return { ok: false, reason: 'empty' };
    if (isDuplicate(clean, null)) return { ok: false, reason: 'duplicate' };
    tasks.push({ id: newId(), text: clean, done: false });
    return { ok: true };
}

function editTask(id, text) {
    const clean = text.trim();
    if (!clean) return { ok: false, reason: 'empty' };
    if (isDuplicate(clean, id)) return { ok: false, reason: 'duplicate' };
    const task = tasks.find((t) => t.id === id);
    if (task) task.text = clean;
    return { ok: true };
}

// ============================================================
// Quick Links
// ============================================================
let links = loadList(KEYS.links).filter(
    (l) => l && typeof l.id === 'string' && typeof l.name === 'string' && /^https?:\/\//i.test(l.url)
);

function validateLink(name, url) {
    if (!name.trim()) return 'Nama tautan tidak boleh kosong.';
    if (!url.trim()) return 'URL tidak boleh kosong.';
    if (!/^https?:\/\//i.test(url.trim())) return 'URL harus diawali http:// atau https://';
    return null;
}

// ============================================================
// Theme
// ============================================================
let theme = 'light';

function normalizeTheme(value) {
    return THEMES.includes(value) ? value : 'light';
}

function applyTheme(next) {
    theme = next;
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('theme-toggle');
    btn.textContent = theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap';
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
}

// ============================================================
// Sort
// ============================================================
function sortedTasks() {
    const list = tasks.slice();
    if (sortMode === 'status') {
        // Array.prototype.sort is stable, so creation order is kept within each group
        list.sort((a, b) => Number(a.done) - Number(b.done));
    }
    return list;
}

// ============================================================
// Controllers
// ============================================================
function showError(id, message) {
    const el = $(id);
    el.textContent = message;
    el.hidden = !message;
}

function persistTasks() {
    const ok = storageWrite(KEYS.tasks, JSON.stringify(tasks));
    if (!ok) showError('task-error', 'Gagal menyimpan ke Local Storage. Perubahan hanya bertahan selama sesi ini.');
    return ok;
}

function button(label, className, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `btn btn-small ${className}`;
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
}

function renderTasks() {
    const ul = $('task-list');
    ul.innerHTML = '';
    const list = sortedTasks();

    if (list.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty';
        li.textContent = 'Belum ada tugas.';
        ul.appendChild(li);
        return;
    }

    list.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' done' : '');

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = task.done;
        cb.setAttribute('aria-label', `Tandai selesai: ${task.text}`);
        cb.addEventListener('change', () => {
            task.done = cb.checked;
            persistTasks();
            renderTasks();
        });
        li.appendChild(cb);

        if (editingId === task.id) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.maxLength = 120;
            input.setAttribute('aria-label', 'Edit tugas');

            const commit = () => {
                const result = editTask(task.id, input.value);
                if (!result.ok) {
                    input.classList.add('invalid');
                    showError('task-error', result.reason === 'duplicate'
                        ? 'Deskripsi tugas duplikat dengan tugas yang sudah ada.'
                        : 'Deskripsi tugas tidak boleh kosong.');
                    return; // stay in edit state
                }
                editingId = null;
                showError('task-error', '');
                persistTasks();
                renderTasks();
            };
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') { editingId = null; showError('task-error', ''); renderTasks(); }
            });
            li.appendChild(input);
            li.appendChild(button('Simpan', '', commit));
            setTimeout(() => input.focus(), 0);
        } else {
            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;
            li.appendChild(span);
            li.appendChild(button('Edit', 'btn-secondary', () => {
                editingId = task.id;
                showError('task-error', '');
                renderTasks();
            }));
        }

        li.appendChild(button('Hapus', 'btn-danger', () => {
            tasks = tasks.filter((t) => t.id !== task.id);
            if (editingId === task.id) editingId = null;
            persistTasks();
            renderTasks();
        }));
        ul.appendChild(li);
    });
}

function persistLinks() {
    const ok = storageWrite(KEYS.links, JSON.stringify(links));
    if (!ok) showError('link-error', 'Gagal menyimpan ke Local Storage. Perubahan hanya bertahan selama sesi ini.');
    return ok;
}

function renderLinks() {
    const box = $('link-list');
    box.innerHTML = '';
    if (links.length === 0) {
        const p = document.createElement('div');
        p.className = 'empty';
        p.textContent = 'Belum ada tautan.';
        box.appendChild(p);
        return;
    }
    links.forEach((link) => {
        const wrap = document.createElement('div');
        wrap.className = 'link-item';

        const a = document.createElement('a');
        a.className = 'link-btn';
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.name;

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'link-remove';
        del.textContent = '✕';
        del.setAttribute('aria-label', `Hapus tautan ${link.name}`);
        del.addEventListener('click', () => {
            links = links.filter((l) => l.id !== link.id);
            persistLinks();
            renderLinks();
        });

        wrap.appendChild(a);
        wrap.appendChild(del);
        box.appendChild(wrap);
    });
}

function bindEvents() {
    $('timer-start').addEventListener('click', startTimer);
    $('timer-stop').addEventListener('click', stopTimer);
    $('timer-reset').addEventListener('click', resetTimer);

    $('task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('task-input');
        const result = addTask(input.value);
        if (!result.ok) {
            input.classList.add('invalid'); // keep the text in the field
            showError('task-error', result.reason === 'duplicate'
                ? 'Deskripsi tugas duplikat dengan tugas yang sudah ada.'
                : 'Deskripsi tugas tidak boleh kosong.');
            return;
        }
        input.classList.remove('invalid');
        input.value = '';
        showError('task-error', '');
        persistTasks();
        renderTasks();
    });
    $('task-input').addEventListener('input', () => {
        $('task-input').classList.remove('invalid');
        showError('task-error', '');
    });

    $('sort-select').addEventListener('change', (e) => {
        sortMode = SORT_MODES.includes(e.target.value) ? e.target.value : 'creation';
        if (!storageWrite(KEYS.sort, sortMode)) {
            showError('task-error', 'Gagal menyimpan mode urutan. Pilihan hanya berlaku selama sesi ini.');
        }
        renderTasks();
    });

    $('link-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('link-name').value;
        const url = $('link-url').value;
        const error = validateLink(name, url);
        if (error) { showError('link-error', error); return; }
        links.push({ id: newId(), name: name.trim(), url: url.trim() });
        $('link-name').value = '';
        $('link-url').value = '';
        showError('link-error', '');
        persistLinks();
        renderLinks();
    });

    $('theme-toggle').addEventListener('click', () => {
        applyTheme(theme === 'dark' ? 'light' : 'dark');
        storageWrite(KEYS.theme, theme); // on failure the active theme stays applied
    });
}

// ============================================================
// init
// ============================================================
function init() {
    applyTheme(normalizeTheme(storageRead(KEYS.theme).value));

    const savedSort = storageRead(KEYS.sort).value;
    sortMode = SORT_MODES.includes(savedSort) ? savedSort : 'creation';
    $('sort-select').value = sortMode;

    updateGreeting();
    setInterval(updateGreeting, 1000);
    renderTimer();
    renderTasks();
    renderLinks();
    bindEvents();
}

init();
