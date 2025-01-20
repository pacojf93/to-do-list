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
    const div = createDiv('', `show-${id}`,['project-container'])
    const contentDiv = createDiv(content,`cont-${id}`)
    const delButton = createButton('del', `del-${id}`,['delete-button'])
    div.appendChild(contentDiv)
    div.appendChild(delButton)
    return div
}
const toDoRepresentation = (content, id, priorityValue, dueDateValue) => {
    const div = contentAndDelButton(content, id)
    const date = createDatePicker(dueDateValue,id)
    const priority = prioritySelector(priorityValue,id)
    div.appendChild(date)
    div.appendChild(priority)
    return div
}
const delButtonAndContainer = (content,id) => {
    const div = createDiv('',`project-${id}`,['container'])
    const delButton = createButton('del', `del-${id}`,['delete-button'])
    const contentDiv = createDiv('','',['content'])
    contentDiv.appendChild(content)
    div.appendChild(delButton)
    div.appendChild(contentDiv)
    return div
}

const projectContainer = (title,id) => {
    const div = createDiv('',`project-${id}`,['container','project'])
    const delButton = createButton('del', `del-${id}`,['button','delete'])
    const contentDiv = createDiv(title,`show-${id}`,['content'])
    div.appendChild(delButton)
    div.appendChild(contentDiv)
    return div
}

const toDoContainer = (content, id, priorityValue, dueDateValue) => {
    const div = createDiv('',`todo-${id}`,['container','todo'])
    const delButton = createButton('del', `del-${id}`,['button','delete'])
    const contentDiv = createDiv('',`show-${id}`,['content'])
    const titleDiv = createDiv(content,'',['title'])
    const infoDiv = createDiv('','',['info'])
    const date = createDatePicker(dueDateValue,id)
    const priority = prioritySelector(priorityValue,id)

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
    const delButton = createButton('del', `del-${id}`,['button','delete'])
    const contentDiv = createDiv(content,`show-${id}`,['content'])
    div.appendChild(delButton)
    div.appendChild(contentDiv)
    return div
}

export {contentAndDelButton, toDoRepresentation, delButtonAndContainer, projectContainer, toDoContainer, noteContainer}