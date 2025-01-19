//import storage from './modules/storage'
import './styles.css'

const projectList = (function() {
    const projects = []
    
    const delAllProjects = () => projects.forEach(() => projects.pop())
    const addProject = (title) => {
        projects.push(project(title))
        storage.saveProjects()
    }
    const delProject = (index) => {
        projects.splice(index, 1)
        storage.saveProjects()
    }
    
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
        storage.saveProjects()
    }
    const delToDo = (index) => {
        toDos.splice(index,1)
        storage.saveProjects()
    }

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

    const addNote = (content) => {
        notes.push(note(content))
        storage.saveProjects()
    }

    const delNote = (index) => {
        notes.splice(index, 1)
        storage.saveProjects()
    }

    const setDueDate = (value) => {
        console.log(`setDueDate Called with value: ${value}`)
        dueDate = value
        storage.saveProjects()
    }

    const getDueDate = () => dueDate

    const setPriority = (value) => {
        priority = value
        storage.saveProjects()
    }
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

function note (content) {
    return {
        content
    }
}

function delChild (father) {
    return (index) => father.splice(index,1) 
}

const render = (function(doc,pList){
    const projectContainer = doc.getElementById("projects-list")
    const toDoContainer = doc.getElementById("to-do-list")
    const notesContainer = doc.getElementById("notes-list")
    const newProjectForm = doc.getElementById("new-project-form")
    const newToDoForm = doc.getElementById("new-to-do-form")
    const newNoteForm = doc.getElementById("new-note-form")

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
    const createInput = createElementWithContentAndId("input")
    const createSelect = createElementWithContentAndId("select")
    const createOption = (value) => {
        const option = createElementWithContentAndId("option")(value,'')
        option.value = value
        return option
    }

    const createDatePicker = (value,id) => {
        const input = createInput('',`date-${id}`)
        input.type = "date"
        input.value = value
        return input
    }

    const prioritySelector = (value,id) => {
        const select = createSelect('',`pr-${id}`)        
        const low = createOption('low')
        const med = createOption('med')
        const high = createOption('high')
        select.appendChild(low)
        select.appendChild(med)
        select.appendChild(high)
        select.value = value
        return select
    }

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

    const toDoRepresentation = (content, id, priorityValue, dueDateValue) => {
        const div = contentDelButtonAndAddButton(content, id)
        const date = createDatePicker(dueDateValue,id)
        const priority = prioritySelector(priorityValue,id)
        div.appendChild(date)
        div.appendChild(priority)
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
            (toDo, toDoIndex) => {
                console.log(`rendering todo-${index}-${toDoIndex} with priority: ${toDo.getPriority()}`)
                return toDoRepresentation(toDo.title, `todo-${index}-${toDoIndex}`, toDo.getPriority(), toDo.getDueDate())
            }
        ).forEach(div => toDoContainer.appendChild(div))
    }

    const renderNotes = (projecIndex, toDoIndex) => {
        emptyNotes()
        pList.projects[projecIndex].toDos[toDoIndex].notes.map(
            (note, noteIndex) => contentAndDelButton(note.content, `note-${projecIndex}-${toDoIndex}-${noteIndex}`)
        ).forEach(div => notesContainer.appendChild(div))
    }

    const removeSelected = (container) => () => Array
        .from(container.querySelectorAll("*"))
        .forEach(child => child.classList.remove("selected"))
    const removeSelectedProject = removeSelected(projectContainer)
    const removeSelectedToDo = removeSelected(toDoContainer)

    const showToDosInProject = (index,e) => {
        removeSelectedProject()
        e.target.classList.add("selected")
        renderToDo(index)
    }

    const delProject = (index) => {
        pList.delProject(index)
        renderProjects()
    }

    //////

    const addToDo = (index) => {
        pList.projects[index].addToDo(
            'this is a new to do',
            'this is the description of the new to do',
            0,
            'med'
        )
        showToDosInProject(index)
    }

    const showNotesInToDo = (index,e) => {
        removeSelectedToDo()
        e.target.classList.add("selected")
        renderNotes(index[0],index[1])
    }

    const delToDo = (index) => {
        pList.projects[index[0]].delToDo(index[1])
        renderToDo(index[0])
    }

    const setDueDate = (index,e) => {
        pList.projects[index[0]].toDos[index[1]].setDueDate(e.target.value)
    }

    const setPriority = (index,e) => {
        pList.projects[index[0]].toDos[index[1]].setPriority(e.target.value)
        renderToDo(index[0])
    }

    /////

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

    const genericHandlerWithMethods = (methods) => (e) => {
        let key = e.target.id.match(/\w+/)[0]
        let index = e.target.id.match(/\d+/g)        
        if(methods.hasOwnProperty(key)) {
            console.log('',key,index)
            methods[key](index,e)
        }         
    }

    const projectClickHandler = genericHandlerWithMethods({
        show: showToDosInProject,
        del: delProject,
        add: addToDo
    })

    const toDoClickHandler = genericHandlerWithMethods({
        show: showNotesInToDo,
        del: delToDo,
        add: addNote
    })

    const toDoChangeHandler = genericHandlerWithMethods({
        date: setDueDate,
        pr: setPriority
    })

    const notesClickHandler = genericHandlerWithMethods({
        del: delNote
    })

    projectContainer.addEventListener('click', projectClickHandler)
    toDoContainer.addEventListener('click', toDoClickHandler)
    toDoContainer.addEventListener('change', toDoChangeHandler)
    notesContainer.addEventListener('click', notesClickHandler)
    
    const getSelected = (container) => () => Array.from(container.querySelectorAll("*")).find(child => child.classList.contains("selected")).id
    const getSelectedProject = getSelected(projectContainer)
    const getSelectedToDo = getSelected(toDoContainer)

    newProjectForm.addEventListener('submit',(e) => {
        e.preventDefault()
        const formData = new FormData(newProjectForm)
        const title = formData.get("title")
        newProjectForm.reset()
        pList.addProject(title)
        storage.saveProjects()
        renderProjects()
    })
    newToDoForm.addEventListener('submit',(e) => {
        e.preventDefault()
        const formData = new FormData(newToDoForm)
        const title = formData.get("title")
        const description = formData.get("description")
        const dueDateValue = formData.get("due-date")
        const priorityValue = formData.get("priority")
        newProjectForm.reset()

        const projectId = getSelectedProject()
        const index = projectId.match(/\d+/g)
        pList.projects[index[0]].addToDo(title, description, dueDateValue, priorityValue)
        storage.saveProjects()
        renderToDo(index[0])
    }) 
    newNoteForm.addEventListener('submit',(e) => {
        e.preventDefault()
        const formData = new FormData(newNoteForm)
        const title = formData.get("content")
        newProjectForm.reset()

        const toDoId = getSelectedToDo()
        const index = toDoId.match(/\d+/g)
        pList.projects[index[0]].toDos[index[1]].addNote(title)
        storage.saveProjects()
        renderNotes(index[0],index[1])
    })

    return {
        renderProjects,
        renderToDo,
        renderNotes,
    }
    
})(document,projectList)

const storage = (function (pList){
    const saveProjects = () => {
        localStorage.setItem('projectList', JSON.stringify(pList))
    }
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
            '2025-01-19',
            'med'
        )
        for(let k = 0; k < 10; k++) {
            projectList.projects[i].toDos[j].addNote(`this is note nº ${k} from toDo nº ${j} from project nº ${i}`)
        }
    }
}  */

storage.restorePorjects()    
//storage.saveProjects()

render.renderProjects()
render.renderToDo(0)
render.renderNotes(0,0)





