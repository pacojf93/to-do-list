const elementFactory = (selector) => (text,id,classes) =>{
    const element = document.createElement(selector)
    element.textContent = text
    element.id = id
    classes?classes.forEach(cl => element.classList.add(cl)):false
    return element
}
const createButton = elementFactory("button")
const createDiv = elementFactory("div")
const createInput = elementFactory("input")
const createSelect = elementFactory("select")
const createOption = (value) => {
    const option = elementFactory("option")(value,'')
    option.value = value
    return option
}
const createDatePicker = (value,id,classes) => {
    const input = createInput('',`date-${id}`,classes)
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

const projectContainer = (title,id) => {
    const div = createDiv('',`project-${id}`,['container','project'])
    const delButton = createButton('del', `del-${id}`,['button','delete','text'])
    const contentDiv = createDiv(title,`show-${id}`,['title','text'])
    div.appendChild(delButton)
    div.appendChild(contentDiv)
    return div
}

const toDoContainer = (content, id, priorityValue, dueDateValue) => {
    const div = createDiv('',`todo-${id}`,['container','todo'])
    const delButton = createButton('del', `del-${id}`,['button','delete','text'])
    const contentDiv = createDiv('',`show-${id}`,['content','text'])
    const titleDiv = createDiv(content,'',['title','text'])
    const infoDiv = createDiv('','',['info','text'])
    const date = createDatePicker(dueDateValue,id,['date','text'])
    const priority = prioritySelector(priorityValue,id,['priority','text'])

    infoDiv.appendChild(date)
    infoDiv.appendChild(priority)
    contentDiv.appendChild(titleDiv)
    contentDiv.appendChild(infoDiv)

    div.appendChild(delButton)
    div.appendChild(contentDiv)
    return div
}

const noteContainer = (content,id) => {
    const div = createDiv('',`note-${id}`,['container','note'])
    const delButton = createButton('del', `del-${id}`,['button','delete','text'])
    const contentDiv = createDiv(content,`show-${id}`,['content','text'])
    div.appendChild(delButton)
    div.appendChild(contentDiv)
    return div
}

export {projectContainer, toDoContainer, noteContainer}