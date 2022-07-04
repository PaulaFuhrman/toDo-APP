const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const newTaskForm = document.querySelector('.new-task-form')
const todoList = document.querySelector('.todo-list')

const newTaskInput = document.querySelector('#task-name')
const newTaskTextarea = document.querySelector('#task-note')

const popupName = document.querySelector('#edit-name')
const popupNote = document.querySelector('#edit-note')

const popupEdit = document.querySelector('.popup-edit')
const popupDelete = document.querySelector('.popup-delete')
const error = document.querySelector('.error')

const taskList = []

const attachListeners = () => {
    document.querySelector('#list-categories').addEventListener('click', handleCategoryChange)
    document.querySelector('#form-categories').addEventListener('click', handleCategoryChangeForm)
    document.querySelector('#add-task').addEventListener('click', openNewTaskForm)
    document.querySelector('#go-back').addEventListener('click', closeNewTaskForm)
    document.querySelector('#btn-add').addEventListener('click', createNewTask)
    document.querySelector('#close-edit-task').addEventListener('click', closePopupEdit)
    document.querySelector('#btn-no').addEventListener('click', closePopupDelete)
    document.querySelector('#btn-yes').addEventListener('click', deleteTask)
}

const handleCategoryChange = (event) => {
    const buttonElement = event.target.closest('button')

    if (buttonElement) {
        const category = buttonElement.dataset.category

        todoList
            .querySelectorAll('.categories button')
            .forEach((element) => element.classList.remove('active'))

        todoList
            .querySelectorAll('.tasks > div')
            .forEach((element) => element.classList.remove('active'))

        buttonElement.classList.add('active')
        todoList.querySelector(`.tasks [data-category="${category}"]`).classList.add('active')
    }
}

const handleCategoryChangeForm = (event) => {
    const buttonElementForm = event.target.closest('button')

    if (buttonElementForm) {
        newTaskForm
            .querySelectorAll('.categories button')
            .forEach((element) => element.classList.remove('active'))

        buttonElementForm.classList.add('active')
    }
}

const openNewTaskForm = () => {
    newTaskForm.classList.add('visible')
    todoList.classList.add('hidden')
    document.querySelector('#add-task').classList.add('hidden')
}

const closeNewTaskForm = () => {
    newTaskForm.classList.remove('visible')
    todoList.classList.remove('hidden')
    document.querySelector('#add-task').classList.remove('hidden')
    clearForm()
}

const clearForm = () => {
    newTaskInput.value = ""
    newTaskTextarea.value = ""

    newTaskForm
        .querySelectorAll('.categories button')
        .forEach((element) => element.classList.remove('active'))
}

const createNewTask = () => {
    errorAlert()

    if (newTaskInput.value !== "") {
        const activeButton = newTaskForm.querySelector('button.active')

        if (activeButton) {
            const selectedCategory = activeButton.dataset.category.replace('-tasks', '')
   
            taskList.push({
                name: newTaskInput.value,
                note: newTaskTextarea.value,
                category: selectedCategory,
                finished: false
            })

            renderTasks()
            closeNewTaskForm()
        }
    }
}

const renderTasks = () => {
    document.querySelectorAll('.tasks ul').forEach(element => {
        element.innerHTML = ''
    })

    taskList.forEach((task, idx) => {
        const newTask = document.createElement('li')

        newTask.setAttribute('data-idx', `${idx}`)
        newTask.innerHTML = `
                <div class="task-element">
                    <div class="note-name">
                        <p>${task.name}</p>
                        <button type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample${idx}" aria-expanded="false"     aria-controls="multiCollapseExample${idx}"><i class="fa-solid fa-comment-dots icon"></i></button>
                    </div>
                    <div class="tools">
                        <button class="complete" onclick="completeTask(${idx})">
                            <i class="fas fa-check icon"></i>
                        </button>
                        <button class="edit" onclick="editTask(${idx})">
                            <i class="fa-solid fa-pen-to-square icon"></i>
                        </button>
                        <button class="delete" onclick="showPopupDeleteTask(${idx})">
                            <i class="fa-solid fa-trash icon"></i>
                        </button>
                    </div>
                </div>
    
                <div class="collapse multi-collapse" id="multiCollapseExample${idx}">${task.note}
                </div>

                `

        todoList.querySelector(`.tasks [data-category="${task.category}-tasks"] ul`).appendChild(newTask)

        if (task.finished === true) {
            newTask.classList.add('completed')
        }
    })
}

const completeTask = (idx) => {
    const taskDone = taskList[idx]
    taskDone.finished = !taskDone.finished

    renderTasks()
}

const editTask = (idx) => {
    popupEdit.style.display = "flex"
    todoList.classList.add('blur')

    const editTaskElement = taskList[idx]

    popupName.value = editTaskElement.name
    popupNote.value = editTaskElement.note

    document.querySelector('#update').addEventListener('click', function updateListener() {
        editTaskElement.name = popupName.value
        editTaskElement.note = popupNote.value

        document.querySelector('#update').removeEventListener('click', updateListener)
        closePopupEdit()
        renderTasks()
    })
}

const closePopupEdit = () => {
    popupEdit.style.display = "none"
    todoList.classList.remove('blur')
}

const showPopupDeleteTask = () => {
    popupDelete.style.display = "flex"
    todoList.classList.add('blur')
}

const deleteTask = (idx) => {
    const deleteIdx = taskList[idx]

    taskList.splice(deleteIdx, 1)

    popupDelete.style.display = "none"
    todoList.classList.remove('blur')

    renderTasks()
}

const closePopupDelete = () => {
popupDelete.style.display = "none"
todoList.classList.remove('blur')
}

const errorAlert = () => {
    const activeBtn = newTaskForm.querySelector('button.active')

    if (newTaskInput.value === "") {
        error.textContent = "Enter a name for the task!"
    } else if (!activeBtn) {
        error.textContent = "Select a category!"
    } else {
        error.textContent = ""
    }
}

attachListeners()