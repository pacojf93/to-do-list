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
const toDoRepresentation = (content, id, priorityValue, dueDateValue) => {
    const div = contentAndDelButton(content, id)
    const date = createDatePicker(dueDateValue,id)
    const priority = prioritySelector(priorityValue,id)
    div.appendChild(date)
    div.appendChild(priority)
    return div
}

export {contentAndDelButton, toDoRepresentation}