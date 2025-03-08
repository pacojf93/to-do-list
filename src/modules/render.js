import { projectContainer, toDoContainer, noteContainer } from "./elements";

const renderFactory = function (doc, pList, storage) {
  const projectListContainer = doc.getElementById("projects-list");
  const toDoListContainer = doc.getElementById("to-do-list");
  const notesContainer = doc.getElementById("notes-list");
  const newProjectForm = doc.getElementById("new-project-form");
  const newToDoForm = doc.getElementById("new-to-do-form");
  const newNoteForm = doc.getElementById("new-note-form");
  const newProjectButton = doc.getElementById("add-project-button");
  const newToDoButton = doc.getElementById("add-to-do-button");
  const newNotetButton = doc.getElementById("add-note-button");

  const emptyContainer = (container) => () =>
    Array.from(container.querySelectorAll("*")).forEach((child) =>
      child.remove(),
    );
  const emptyProjects = emptyContainer(projectListContainer);
  const emptyToDo = emptyContainer(toDoListContainer);
  const emptyNotes = emptyContainer(notesContainer);

  const selectFirst = (div, index) => {
    if (index === 0) div.classList.add("selected");
    return div;
  };
  const removeSelected = (container) => () =>
    Array.from(container.querySelectorAll("*")).forEach((child) =>
      child.classList.remove("selected"),
    );
  const removeSelectedProject = removeSelected(projectListContainer);
  const removeSelectedToDo = removeSelected(toDoListContainer);

  const getSelected = (container) => () =>
    Array.from(container.querySelectorAll("*")).find((child) =>
      child.classList.contains("selected"),
    ).id;
  const getSelectedProject = getSelected(projectListContainer);
  const getSelectedToDo = getSelected(toDoListContainer);

  const renderProjects = () => {
    emptyProjects();
    emptyToDo();
    emptyNotes();
    pList.projects
      .map((project, index) =>
        projectContainer(project.title, `project-${index}`),
      )
      .map((project) => {
        project.addEventListener("click", projectClickHandler);
        return project;
      })
      .forEach((div) => projectListContainer.appendChild(div));
  };

  const renderToDo = (index) => {
    emptyToDo();
    emptyNotes();
    pList.projects[index].toDos
      .map((toDo, toDoIndex) =>
        toDoContainer(
          toDo.title,
          `todo-${index}-${toDoIndex}`,
          toDo.getPriority(),
          toDo.getDueDate(),
        ),
      )
      .map((toDo) => {
        toDo.addEventListener("click", toDoClickHandler);
        return toDo;
      })
      .map((toDo) => {
        toDo.addEventListener("change", toDoChangeHandler);
        return toDo;
      })
      .forEach((div) => toDoListContainer.appendChild(div));
  };

  const renderNotes = (projecIndex, toDoIndex) => {
    emptyNotes();
    pList.projects[projecIndex].toDos[toDoIndex].notes
      .map((note, noteIndex) =>
        noteContainer(
          note.content,
          `note-${projecIndex}-${toDoIndex}-${noteIndex}`,
        ),
      )
      .map((note) => {
        note.addEventListener("click", notesClickHandler);
        return note;
      })
      .forEach((div) => notesContainer.appendChild(div));
  };

  ///
  const showToDosInProject = (index) => {
    renderToDo(index);
  };

  const delProject = (index) => {
    pList.delProject(index);
    storage.saveProjects();
    renderProjects();
  };

  //////
  const showNotesInToDo = (index) => {
    renderNotes(index[0], index[1]);
  };

  const delToDo = (index) => {
    pList.projects[index[0]].delToDo(index[1]);
    storage.saveProjects();
    renderToDo(index[0]);
  };

  const setDueDate = (index, e) => {
    pList.projects[index[0]].toDos[index[1]].setDueDate(e.target.value);
    storage.saveProjects();
    renderToDo(index[0]);
  };

  const setPriority = (index, e) => {
    pList.projects[index[0]].toDos[index[1]].setPriority(e.target.value);
    storage.saveProjects();
    renderToDo(index[0]);
  };

  /////
  const delNote = (index) => {
    pList.projects[index[0]].toDos[index[1]].delNote(index[2]);
    storage.saveProjects();
    renderNotes(index[0], index[1]);
  };

  const genericHandlerWithMethods = (methods) => (e) => {
    let key = e.target.id.match(/\w+/)[0];
    let index = e.currentTarget.id.match(/\d+/g);
    if (methods.hasOwnProperty(key)) {
      console.log("", key, index);
      methods[key](index, e);
    }
  };

  const genericHandlerWithMethodsAndItems =
    (methods, selectedRemover) => (e) => {
      let key = e.target.id ? e.target.id.match(/\w+/)[0] : "";
      let index = e.currentTarget.id.match(/\d+/g);
      if (!e.currentTarget.classList.contains("selected")) {
        selectedRemover();
        e.currentTarget.classList.add("selected");
        methods["show"](index);
      } else if (methods.hasOwnProperty(key)) {
        console.log("", key, index);
        methods[key](index, e);
      }
    };

  const projectClickHandler = genericHandlerWithMethodsAndItems(
    {
      show: showToDosInProject,
      del: delProject,
    },
    removeSelectedProject,
  );

  const toDoClickHandler = genericHandlerWithMethodsAndItems(
    {
      show: showNotesInToDo,
      del: delToDo,
    },
    removeSelectedToDo,
  );

  const toDoChangeHandler = genericHandlerWithMethods({
    date: setDueDate,
    pr: setPriority,
  });

  const notesClickHandler = genericHandlerWithMethods({
    del: delNote,
  });

  //forms
  newProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(newProjectForm);

    const title = formData.get("title");
    pList.addProject(title);
    renderProjects();

    newProjectForm.reset();
    storage.saveProjects();
  });
  newToDoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(newToDoForm);

    const title = formData.get("title");
    const description = formData.get("description");
    const dueDateValue = formData.get("due-date");
    const priorityValue = formData.get("priority");

    const projectId = getSelectedProject();
    const index = projectId.match(/\d+/g);
    pList.projects[index[0]].addToDo(
      title,
      description,
      dueDateValue,
      priorityValue,
    );
    renderToDo(index[0]);

    newProjectForm.reset();
    storage.saveProjects();
  });
  newNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(newNoteForm);

    const title = formData.get("content");
    const toDoId = getSelectedToDo();
    const index = toDoId.match(/\d+/g);
    pList.projects[index[0]].toDos[index[1]].addNote(title);
    renderNotes(index[0], index[1]);

    newProjectForm.reset();
    storage.saveProjects();
  });

  newProjectButton.addEventListener("click", () => {
    newProjectForm.style.display = "grid";
  });

  newToDoButton.addEventListener("click", () => {
    newToDoForm.style.display = "grid";
  });

  newNotetButton.addEventListener("click", () => {
    newNoteForm.style.display = "grid";
  });

  return {
    renderProjects,
    renderToDo,
    renderNotes,
  };
};

export default renderFactory;
