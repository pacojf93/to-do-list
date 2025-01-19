//import storage from './modules/storage'
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
    const priorityValues = {
        LOW: "LOW",
        MEDIUM: "MEDIUM",
        HIGHG: "HIGH"
    }

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
        delNote,
        priorityValues
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

const render = (function(doc,pList){
    const projectContainer = doc.getElementById("projects-list")
    const toDoContainer = doc.getElementById("to-do-list")
    const notesContainer = doc.getElementById("notes-list")

    const emptyContainer = (container) => () => Array
    .from(container.querySelectorAll("*"))
    .forEach(child => child.remove())
    const emptyProjects = emptyContainer(projectContainer)
    const emptyToDo = emptyContainer(toDoContainer)
    const emptyNotes = emptyContainer(notesContainer)

    const createElementWithContentAndId = (selector) => (text,id) =>{
        const element = document.createElement(selector)
        element.textContent = text
        element.id = id
        return element
    }
    const createButton = createElementWithContentAndId("button")
    const createDiv = createElementWithContentAndId("div")
    const contentAndDelButton = (content,id) => {
        const div = createDiv('', '')
        const contentDiv = createDiv(content, `show-${id}`)
        const delButton = createButton('del', `del-${id}`)

        div.appendChild(contentDiv)
        div.appendChild(delButton) 

        return div
    }
    const contentDelButtonAndAddButton = (content, id) => {
        const div = contentAndDelButton(content, id)
        const addButton = createButton('add', `add-${id}`)
        div.appendChild(addButton)
        return div
    }

    const renderProjects = () => {
        emptyProjects()
        pList.projects.map(
            (project,index) => contentDelButtonAndAddButton(project.title, `project-${index}`)
        ).forEach(div => projectContainer.appendChild(div))
    }  

    const renderToDo = (index) => {
        emptyToDo()
        pList.projects[index].toDos.map(
            (toDo, toDoIndex) => contentDelButtonAndAddButton(toDo.title, `todo-${index}-${toDoIndex}`)
        ).forEach(div => toDoContainer.appendChild(div))
    }

    const renderNotes = (projecIndex, toDoIndex) => {
        emptyNotes()
        pList.projects[projecIndex].toDos[toDoIndex].notes.map(
            (note, noteIndex) => contentAndDelButton(note.content, `note-${projecIndex}-${toDoIndex}-${noteIndex}`)
        ).forEach(div => notesContainer.appendChild(div))
    }

    const showToDosInProject = (index) => {
        renderToDo(index)
    }

    const delProject = (index) => {
        pList.delProject(index)
        renderProjects()
    }

    const addToDo = (index) => {
        pList.projects[index].addToDo(
            'this is a new to do',
            'this is the description of the new to do',
            0,
            0
        )
        showToDosInProject(index)
    }

    const showNotesInToDo = (index) => {
        renderNotes(index[0],index[1])
    }

    const delToDo = (index) => {
        pList.projects[index[0]].delToDo(index[1])
        renderToDo(index[0])
    }

    const addNote = (index) => {
        pList.projects[index[0]].toDos[index[1]].addNote(
            'this is the content of a new note',
        )
        showNotesInToDo(index)
    }    

    const delNote = (index) => {
        pList.projects[index[0]].toDos[index[1]].delNote(index[2])
        renderNotes(index[0],index[1])
    }

    const clickHandlerWithMethods = (methods) => (e) => {
        let key = e.target.id.match(/\w+/)[0]
        let index = e.target.id.match(/\d+/g)
        console.log('',key,index)
        if(methods.hasOwnProperty(key)) methods[key](index)         
    }

    const projectClickHandler = clickHandlerWithMethods({
        show: showToDosInProject,
        del: delProject,
        add: addToDo
    })

    const toDoClickHandler = clickHandlerWithMethods({
        show: showNotesInToDo,
        del: delToDo,
        add: addNote
    })

    const notesClickHandler = clickHandlerWithMethods({
        del: delNote
    })

    projectContainer.addEventListener('click', projectClickHandler)
    toDoContainer.addEventListener('click', toDoClickHandler)
    notesContainer.addEventListener('click', notesClickHandler)    
    
    return {
        renderProjects,
        renderToDo,
        renderNotes,
    }
    
})(document,projectList)

const storage = (function (pList){
    const saveProjects = () => localStorage.projectList = JSON.stringify(pList)
    const restorePorjects = () => {
        const savedProjects = JSON.parse(localStorage.projectList)
        
        savedProjects.projects.forEach((project, projectIndex) => {
            pList.addProject(project.title)
            
            project.toDos.forEach((toDo, toDoIndex) => {
                pList.projects[projectIndex].addToDo(
                    toDo.title,
                    toDo.description,
                    toDo.dueDate,
                    toDo.priority
                )

                toDo.notes.forEach((note) => {
                    pList.projects[projectIndex].toDos[toDoIndex].addNote(note.content)
                })

            })

        })
    }
    return {
        saveProjects,
        restorePorjects
    }
})(projectList)

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





