function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    if (taskInput.value.trim() !== "") {
        // Create a new list item
        const li = document.createElement("li");

        // Task text
        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.innerText = taskInput.value;

        // Mark as Done (Tick) button
        const doneButton = document.createElement("button");
        doneButton.classList.add("icon-btn", "done-btn");
        doneButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
        doneButton.onclick = () => toggleDone(taskText, doneButton);

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("icon-btn", "delete-btn");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        deleteButton.onclick = () => deleteTask(li);

        // Append elements to the list item
        li.appendChild(taskText);
        li.appendChild(doneButton);
        li.appendChild(deleteButton);

        // Append the list item to the task list
        taskList.appendChild(li);

        // Clear input field
        taskInput.value = "";
    } else {
        alert("Please enter a task!");
    }
}

function toggleDone(taskText, doneButton) {
    // Toggle the "completed" class for strikethrough effect
    taskText.classList.toggle("completed");

    // Toggle the icon between check and undo
    if (taskText.classList.contains("completed")) {
        doneButton.innerHTML = `<i class="fa-solid fa-rotate-left"></i>`; // Undo icon
    } else {
        doneButton.innerHTML = `<i class="fa-solid fa-check"></i>`; // Tick icon
    }
}

function deleteTask(taskItem) {
    // Remove the task item
    taskItem.remove();
}
