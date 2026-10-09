
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const count = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const filters = document.querySelector(".filters");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("portfolio-tasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch {
    tasks = [];
}

let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("portfolio-tasks", JSON.stringify(tasks));
}

function renderTasks() {
    list.replaceChildren();

    const visibleTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    visibleTasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task";
        if (task.completed) item.classList.add("completed");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.dataset.action = "toggle";
        checkbox.dataset.id = task.id;
        checkbox.setAttribute("aria-label", `Complete ${task.text}`);

        const text = document.createElement("span");
        text.textContent = task.text;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = task.id;
        editButton.setAttribute("aria-label", `Edit ${task.text}`);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = task.id;
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

        item.append(checkbox, text, editButton, deleteButton);
        list.append(item);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    count.textContent =
        `${tasks.length} tasks · ${remaining} remaining`;

    emptyMessage.hidden = visibleTasks.length > 0;

    if (visibleTasks.length === 0) {
        emptyMessage.textContent = tasks.length === 0
            ? "No tasks yet. Add your first task!"
            : "No tasks match this filter.";
    }

    filters.querySelectorAll("button").forEach(button => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.filter === currentFilter)
        );
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    tasks.push({
        id: crypto.randomUUID(),
        text,
        completed: false
    });

    saveTasks();
    input.value = "";
    currentFilter = "all";
    renderTasks();
    input.focus();
});

filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;

    currentFilter = button.dataset.filter;
    renderTasks();
});

list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const task = tasks.find(task => task.id === button.dataset.id);
    if (!task) return;

    if (button.dataset.action === "delete") {
        tasks = tasks.filter(item => item.id !== task.id);
    }

    if (button.dataset.action === "edit") {
        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText === null) return;

        if (!updatedText.trim()) {
            alert("Task cannot be empty.");
            return;
        }

        task.text = updatedText.trim().slice(0, 200);
    }

    saveTasks();
    renderTasks();
});

list.addEventListener("change", event => {
    const checkbox = event.target.closest(
        'input[data-action="toggle"]'
    );
    if (!checkbox) return;

    const task = tasks.find(task => task.id === checkbox.dataset.id);
    if (!task) return;

    task.completed = checkbox.checked;
    saveTasks();
    renderTasks();
});

renderTasks();
