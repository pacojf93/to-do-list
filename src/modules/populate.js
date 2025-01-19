const populateFactory = (projectList) => () => {
    for(let i = 0; i < 3; i++) {
        projectList.addProject(`project number ${i}`)
        for(let j = 0; j < 3; j++) {
            projectList.projects[i].addToDo(
                `toDo nº ${j} from project nº ${i}`,
                `this is toDo nº ${j} from project nº ${i}`,
                '2025-01-19',
                'med'
            )
            for(let k = 0; k < 3; k++) {
                projectList.projects[i].toDos[j].addNote(`this is note nº ${k} from toDo nº ${j} from project nº ${i}`)
            }
        }
    }  
}

export default populateFactory