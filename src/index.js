import './styles.css'
import storageFactory from './modules/storage'
import populateFactory from './modules/populate'
import renderFactory from './modules/render'
import projectListFactory from './modules/projectList'

const projectList = projectListFactory()
const storage = storageFactory(projectList)
const render = renderFactory(document, projectList, storage)
const populate = populateFactory(projectList)

storage.restorePorjects()    
//storage.saveProjects()

render.renderProjects()
render.renderToDo(0)
render.renderNotes(0,0)





