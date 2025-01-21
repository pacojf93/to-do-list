const storageFactory = function (pList){
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
    const deleteProjects = () => localStorage.removeItem('projectList')
    return {
        saveProjects,
        restorePorjects,
        deleteProjects
    }
}

export default storageFactory