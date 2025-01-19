import './styles.css'

const projectList = (function() {
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
})()

function project (title) {
    const toDos = []

    const addToDo = (title, description, dueDate, priority) => {
        toDos.push(toDo(title, description, dueDate, priority))
    }
    const delToDo = (index) => toDos.splice(index,1)

    return {
        title,
        toDos,
        addToDo,
        delToDo,
    }
}

function toDo (title, description, dueDate, priority) {
    const notes = []
    const checklist = []

    const addNote = (content) => {
        const id = 0
        notes.push(note(content, id))
    }

    const delNote = (index) => notes.splice(index, 1)

    return {
        title,
        description,
        dueDate,
        priority,
        notes,
        checklist,
        addNote,
        delNote
    }
}

function note (content, id) {
    return {
        content,
        id
    }
}

function delChild (father) {
    return (index) => father.splice(index,1) 
}

const render = (function(doc){
    const projectContainer = doc.getElementById("projects-list")
    const toDoContainer = doc.getElementById("to-do-list")
    const notesContainer = doc.getElementById("notes-list")

    const renderProjects = () => {
        projectList.projects.map(
            (project,index) => {
                const div = document.createElement("div")
                div.id = `project-${index}`
                div.textContent = project.title
                return div
        }).forEach(div => projectContainer.appendChild(div))
    }  

    const renderToDo = (index) => {
        projectList.projects[index].toDos.map((toDo, toDoIndex) => {
            const div = document.createElement("div")
            div.id = `todo-${index}-${toDoIndex}`
            div.textContent = toDo.title
            return div
        }).forEach(div => toDoContainer
            .appendChild(div))
    }

    const renderNotes = (projecIndex, toDoIndex) => {
        projectList.projects[projecIndex].toDos[toDoIndex].notes.map((note, noteIndex) => {
            const div = document.createElement("div")
            div.id = `note-${projecIndex}-${toDoIndex}-${noteIndex}`
            div.textContent = note.content
            return div
        }).forEach(div => notesContainer.appendChild(div))
    }

    const emptyContainer = (container) => () => Array
    .from(container.querySelectorAll("*"))
    .forEach(child => child.remove())
    const emptyProjects = emptyContainer(projectContainer)
    const emptyToDo = emptyContainer(toDoContainer)
    const emptyNotes = emptyContainer(notesContainer)

    projectContainer.addEventListener('click', (e) => {
        let index = e.target.id.replace('project-','')
        emptyToDo()
        renderToDo(index)
    })
    
    return {
        renderProjects,
        renderToDo,
        renderNotes,
        emptyProjects,
        emptyToDo,
        emptyNotes
    }
    
})(document)

const storage = (function (){
    const saveProjects = () => localStorage.projectList = JSON.stringify(projectList)
    const restorePorjects = () => {
        const savedProjects = JSON.parse(localStorage.projectList)
        
        savedProjects.projects.forEach((project, projectIndex) => {
            projectList.addProject(project.title)
            
            project.toDos.forEach((toDo, toDoIndex) => {
                projectList.projects[projectIndex].addToDo(
                    toDo.title,
                    toDo.description,
                    toDo.dueDate,
                    toDo.priority
                )

                toDo.notes.forEach((note, noteIndex) => {
                    projectList.projects[projectIndex].toDos[toDoIndex].addNote(note.content)
                })

            })

        })
    }
    return {
        saveProjects,
        restorePorjects
    }
})()

/* for(let i = 0; i < 10; i++) {
    projectList.addProject(`project number ${i}`)
    for(let j = 0; j < 10; j++) {
        projectList.projects[i].addToDo(
            `toDo nº ${j} from project nº ${i}`,
            `this is toDo nº ${j} from project nº ${i}`,
            0,
            0
        )
        for(let k = 0; k < 10; k++) {
            projectList.projects[i].toDos[j].addNote(`this is note nº ${k} from toDo nº ${j} from project nº ${i}`)
        }
    }
} */

storage.restorePorjects()    
//storage.saveProjects()

render.renderProjects()
render.renderToDo(0)
render.renderNotes(0,0)





