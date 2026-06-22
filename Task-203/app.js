// Initialize state manager from storage cache or clean arrays
let tasks = JSON.parse(localStorage.getItem('portfolio_tasks')) || [];
let currentFilter = 'all';

// Component elements references mapping
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const filterBtns = document.querySelectorAll('.filter-btn');

// Save tracking data changes to persistent local environment browser layer
function saveStateToStorage() {
    localStorage.setItem('portfolio_tasks', JSON.stringify(tasks));
    renderTasksEngine();
}

// Global Core State Application Render Interface Processing Loop
function renderTasksEngine() {
    todoList.innerHTML = '';
    
    // Process filtering mechanics without mutating actual list entries
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    // Loop array layout parsing structure instantiation
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="todo-item-left">
                <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''} aria-label="Toggle execution checkpoint status for ${task.text}">
                <span class="todo-text">${escapeHtml(task.text)}</span>
            </div>
            <button class="delete-btn" aria-label="Permanently delete item trace row ${task.text}">&times;</button>
        `;

        // Event listener hooks: Checkbox state toggles execution metrics
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveStateToStorage();
        });

        // Event listener hooks: Button processing tracking removal
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveStateToStorage();
        });

        todoList.appendChild(li);
    });

    // Real-time badge counter updating logic calculation execution
    const activeCount = tasks.filter(t => !t.completed).length;
    itemsLeft.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`;
}

// Input data sanitation function parsing security protection mechanisms
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Form Submission Event hook engine parsing
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (!taskText) return;

    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    todoInput.value = '';
    saveStateToStorage();
});

// Event controls filter layout configuration buttons binding maps loop processing
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle semantic selection status tracking states profiles
        filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        
        currentFilter = btn.getAttribute('data-filter');
        renderTasksEngine();
    });
});

// Primary initial system loading sequence startup instantiation script
document.addEventListener('DOMContentLoaded', () => {
    renderTasksEngine();
});
