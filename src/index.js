import "./styles.css";
import storageFactory from "./modules/storage";
import populateFactory from "./modules/populate";
import renderFactory from "./modules/render";
import projectListFactory from "./modules/projectList";

const projectList = projectListFactory();
const storage = storageFactory(projectList);
const render = renderFactory(document, projectList, storage);

if (!localStorage.getItem("projectList")) {
  projectList.addProject("this is an empty project");
  projectList.addProject("this is a project with a to-do");

  projectList.projects[1].addToDo(
    "this is a to-do whit a note",
    "description",
    "2025-1-19",
    "med",
  );
  projectList.projects[1].toDos[0].addNote("this is a note inside a to-do");
} else storage.restorePorjects();

render.renderProjects();
