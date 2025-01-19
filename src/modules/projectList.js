const projectListFactory = function() {
    const projects = []
    
    const delAllProjects = () => projects.forEach(() => projects.pop())
    const addProject = (title) => projects.push(project(title))
    const delProject = (index) => projects.splice(index, 1)
    
    return {
        projects,
        addProject,
        delProject,
        delAllProjects
    }    
}

function project (title) {
    const toDos = []

    const addToDo = (title, description, dueDate, priority) => toDos.push(toDo(title, description, dueDate, priority))
    const delToDo = (index) => toDos.splice(index,1)
    
    return {
        title,
        toDos,
        addToDo,
        delToDo,
    }
}

function toDo (title, description, dueDateValue, priorityValue) {
    const notes = []
    const checklist = []

    let priority = priorityValue
    let dueDate = dueDateValue

    const addNote = (content) => notes.push(note(content))
    const delNote = (index) => notes.splice(index, 1)
    const setDueDate = (value) => dueDate = value
    const getDueDate = () => dueDate
    const setPriority = (value) => priority = value
    const getPriority = () => priority

    const toJSON = () => ({
            title,
            description,
            dueDate: getDueDate(),
            priority: getPriority(),
            notes,
            checklist
        })

    return {
        title,
        description,
        getDueDate,
        getPriority,
        notes,
        checklist,
        addNote,
        delNote,
        setDueDate,
        setPriority,
        toJSON
    }
}

const note = (content) => ({content})

export default projectListFactory