// DOM Elements
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const dueTime = document.getElementById("dueTime");
const taskList = document.getElementById("taskList");
const showAll = document.getElementById("showAll");
const showActive = document.getElementById("showActive");
const showCompleted = document.getElementById("showCompleted");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const currentYear = document.getElementById("currentYear");

// Set current year in footer
currentYear.textContent = new Date().getFullYear();

// Initialize tasks array from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Filter state - set to 'all' by default
let filter = "all";

// Initialize the app
function init() {
    // Set active filter button style
    updateActiveFilterButton();
    renderTasks();
    updateStats();
    
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    dueDate.min = today;
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    const date = dueDate.value;
    const time = dueTime.value;
    
    if (text === "") {
        alert("Please enter a task description!");
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text,
        completed: false,
        dueDate: date || null,
        dueTime: time || null,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    
    // Clear inputs
    taskInput.value = "";
    dueDate.value = "";
    dueTime.value = "";
    taskInput.focus();
}

// Toggle task completion status
function toggleDone(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
    updateStats();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update active filter button styles
function updateActiveFilterButton() {
    // Remove active class from all buttons
    showAll.classList.remove("active");
    showActive.classList.remove("active");
    showCompleted.classList.remove("active");
    
    // Add active class to the current filter button
    switch(filter) {
        case "all":
            showAll.classList.add("active");
            break;
        case "active":
            showActive.classList.add("active");
            break;
        case "completed":
            showCompleted.classList.add("active");
            break;
    }
}

// Render tasks based on current filter
function renderTasks() {
    // Filter tasks
    let filteredTasks = [];
    switch (filter) {
        case "active":
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case "completed":
            filteredTasks = tasks.filter(task => task.completed);
            break;
        default:
            filteredTasks = [...tasks];
    }
    
    // Sort tasks: incomplete first, then by due date (soonest first), then by creation date
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        // If both have due dates
        if (a.dueDate && b.dueDate) {
            const dateA = new Date(`${a.dueDate} ${a.dueTime || "23:59"}`);
            const dateB = new Date(`${b.dueDate} ${b.dueTime || "23:59"}`);
            return dateA - dateB;
        }
        
        // If only one has a due date
        if (a.dueDate || b.dueDate) {
            return a.dueDate ? -1 : 1;
        }
        
        // Sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Render tasks
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-clipboard-list"></i>
                <p>No tasks found</p>
            </div>
        `;
        return;
    }
    
    taskList.innerHTML = "";
    
    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        
        // Format due date/time
        let dueText = "";
        if (task.dueDate) {
            const dueDate = new Date(`${task.dueDate} ${task.dueTime || "23:59"}`);
            const now = new Date();
            
            const options = { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                hour: task.dueTime ? 'numeric' : undefined,
                minute: task.dueTime ? 'numeric' : undefined
            };
            
            dueText = dueDate.toLocaleDateString('en-US', options);
            
            if (!task.completed && dueDate < now) {
                dueText = `Overdue: ${dueText}`;
            }
        }
        
        li.innerHTML = `
            <div class="task-content">
                <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
                <div class="task-actions">
                    <button class="icon-btn done-btn" onclick="toggleDone(${task.id})">
                        <i class="fa-solid ${task.completed ? "fa-rotate-left" : "fa-check"}"></i>
                    </button>
                    <button class="icon-btn delete-btn" onclick="deleteTask(${task.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.dueDate ? `
                <div class="task-due ${!task.completed && new Date(`${task.dueDate} ${task.dueTime || "23:59"}`) < new Date() ? "overdue" : ""}">
                    <i class="fa-solid fa-calendar-day"></i>
                    ${dueText}
                </div>
            ` : ""}
        `;
        
        taskList.appendChild(li);
    });
}

// Update task statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    totalTasks.textContent = `${total} ${total === 1 ? "task" : "tasks"}`;
    completedTasks.textContent = `${completed} completed`;
}

// Event listeners for filter buttons
showAll.addEventListener("click", () => {
    filter = "all";
    updateActiveFilterButton();
    renderTasks();
});

showActive.addEventListener("click", () => {
    filter = "active";
    updateActiveFilterButton();
    renderTasks();
});

showCompleted.addEventListener("click", () => {
    filter = "completed";
    updateActiveFilterButton();
    renderTasks();
});

// Allow adding task with Enter key
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Initialize the app
init();