import {contentAndDelButton, toDoRepresentation} from './elements'

const renderFactory = function(doc,pList, storage){
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

    const selectFirst = (div, index) => {
        if(index === 0 ) div.querySelector("div").classList.add("selected")
        return div
    }
    const removeSelected = (container) => () => Array
        .from(container.querySelectorAll("*"))
        .forEach(child => child.classList.remove("selected"))
    const removeSelectedProject = removeSelected(projectContainer)
    const removeSelectedToDo = removeSelected(toDoContainer)

    const getSelected = (container) => () => Array.from(container.querySelectorAll("*")).find(child => child.classList.contains("selected")).id
    const getSelectedProject = getSelected(projectContainer)
    const getSelectedToDo = getSelected(toDoContainer)

    const renderProjects = () => {
        emptyProjects()
        pList.projects        
        .map((project,index) => contentAndDelButton(project.title, `project-${index}`))
        .map(selectFirst)
        .forEach(div => projectContainer.appendChild(div))
    }  

    const renderToDo = (index) => {
        emptyToDo()
        pList.projects[index].toDos
        .map((toDo, toDoIndex) => toDoRepresentation(toDo.title, `todo-${index}-${toDoIndex}`, toDo.getPriority(), toDo.getDueDate()))
        .map(selectFirst)
        .forEach(div => toDoContainer.appendChild(div))
    }

    const renderNotes = (projecIndex, toDoIndex) => {
        emptyNotes()
        pList.projects[projecIndex].toDos[toDoIndex].notes
        .map((note, noteIndex) => contentAndDelButton(note.content, `note-${projecIndex}-${toDoIndex}-${noteIndex}`))
        .forEach(div => notesContainer.appendChild(div))
    }    

    ///
    const showToDosInProject = (index,e) => {
        removeSelectedProject()
        e.target.classList.add("selected")
        renderToDo(index)
    }

    const delProject = (index) => {
        pList.delProject(index)
        storage.saveProjects()
        renderProjects()
    }

    //////

    const showNotesInToDo = (index,e) => {
        removeSelectedToDo()
        e.target.classList.add("selected")
        renderNotes(index[0],index[1])
    }

    const delToDo = (index) => {
        pList.projects[index[0]].delToDo(index[1])
        storage.saveProjects()
        renderToDo(index[0])
    }

    const setDueDate = (index,e) => {
        pList.projects[index[0]].toDos[index[1]].setDueDate(e.target.value)
        storage.saveProjects()
        renderToDo(index[0])
    }

    const setPriority = (index,e) => {
        pList.projects[index[0]].toDos[index[1]].setPriority(e.target.value)
        storage.saveProjects()
        renderToDo(index[0])
    }

    /////
    const delNote = (index) => {
        pList.projects[index[0]].toDos[index[1]].delNote(index[2])
        storage.saveProjects()
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
        del: delProject
    })

    const toDoClickHandler = genericHandlerWithMethods({
        show: showNotesInToDo,
        del: delToDo
    })

    const toDoChangeHandler = genericHandlerWithMethods({
        date: setDueDate,
        pr: setPriority
    })

    const notesClickHandler = genericHandlerWithMethods({
        del: delNote
    })

    //listeners
    projectContainer.addEventListener('click', projectClickHandler)
    toDoContainer.addEventListener('click', toDoClickHandler)
    toDoContainer.addEventListener('change', toDoChangeHandler)
    notesContainer.addEventListener('click', notesClickHandler)
    
    //forms
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
    
}

export default renderFactory