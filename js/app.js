class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderTasks();

        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const input = document.getElementById('taskInput');
            this.addTask(input.value);
            input.value = '';
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderTasks();
    }

    addTask(text) {
        if (!text.trim()) return;

        const task = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    priority: 'medium'
};

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    editTask(id) {
    const newText = prompt("Edit task:");

    if (!newText || !newText.trim()) return;

    this.tasks = this.tasks.map(task =>
        task.id === id ? { ...task, text: newText.trim() } : task
    );

    this.saveTasks();
    this.renderTasks();
}

    toggleComplete(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.saveTasks();
    this.renderTasks();
}

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    getFilteredTasks() {
        if (this.currentFilter === 'active') {
            return this.tasks.filter(task => !task.completed);
        }
        if (this.currentFilter === 'completed') {
            return this.tasks.filter(task => task.completed);
        }
        return this.tasks;
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();

        taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox"
                    ${task.completed ? 'checked' : ''}
                    onchange="taskManager.toggleComplete(${task.id})">
                
                <span ondblclick="taskManager.editTask(${task.id})">
    ${task.text}
</span>

                <button onclick="taskManager.deleteTask(${task.id})">
                    Delete
                </button>
            </li>
        `).join('');

        this.updateStats();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('activeTasks').textContent = total - completed;
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

const taskManager = new TaskManager();