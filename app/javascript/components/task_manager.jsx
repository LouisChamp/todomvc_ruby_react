import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes, { element } from "prop-types";
import className from "classnames";
import classNames from "classnames";
import axios from "axios";

const TaskManager = (props) => {
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState("All");
  const newTaskTitleRef = useRef(null);
  const taskEditTitleInputs = useRef({});

  useEffect(() => {
    axios
      .get("api/v1/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch(console.log);
  }, []);

  const handleTaskDestroy = (task) => (event) => {
    if (confirm(`Are you sure you want to delete task ${task.title}`)) {
      axios
        .delete(`/api/v1/tasks/${task.id}`)
        .then((_response) => {
          setTasks((previousTasks) =>
            previousTasks.filter((tsk) => tsk.id !== task.id)
          );
        })
        .catch(console.log);
    }
  };

  const handleTaskStatusUpdate = (task) => (event) => {
    const completed = event.target.checked;

    axios
      .put(`/api/v1/tasks/${task.id}`, { completed })
      .then((_response) => {
        setTasks((previousTasks) =>
          previousTasks.map((tsk) =>
            tsk.id === task.id ? { ...tsk, completed } : tsk
          )
        );
      })
      .catch(console.log);
  };

  const handleNewTaskKeyDown = (event) => {
    const key = event.key;

    switch (key) {
      case "Enter":
        _addTask();
        break;
      case "Escape":
        newTaskTitleRef.current.value = "";
        break;
      default:
    }
  };

  const handleNewTaskBlur = (event) => {
    _addTask();
  };

  const handleChangeFilter = (filter) => (event) => {
    event.preventDefault();
    setTaskFilter(filter);
  };

  const handleClickToEditTask = (task) => (event) => {
    event.target.parentElement.parentElement.className = classNames(
      { completed: task.completed },
      { editing: true }
    );
    taskEditTitleInputs.current[task.id].focus();
  };

  const handleEditTask = (task) => (event) => {
    const title = event.target.value;

    axios
      .put(`/api/v1/tasks/${task.id}`, { title })
      .then((_response) => {
        setTasks((previousTasks) =>
          previousTasks.map((tsk) =>
            tsk.id === task.id ? { ...tsk, title } : tsk
          )
        );
      })
      .catch(console.log);
  };

  const handleFinishEditTask = (task) => (event) => {
    _finishEditingTask(event, task);
  };

  const handleFinishEditTaskKeyDown = (task) => (event) => {
    const key = event.key;

    switch (key) {
      case "Enter":
        _finishEditingTask(event, task);
        break;
      case "Escape":
        _finishEditingTask(event, task);
        break;
      default:
    }
  };

  const handleClearCompletedTasks = (_event) => {
    if (confirm("Are you sure you want to delete all completed tasks?")) {
      const ids = completedTasks.map((task) => task.id);

      axios
        .post("/api/v1/tasks/destroy_completed", { ids })
        .then((_response) => {
          setTasks(pendingTasks);
        });
    }
  };

  const handleTaskBundleUpdate = (event) => {
    const completed = event.target.checked;

    axios
      .post("/api/v1/tasks/batch_update_completed", { completed })
      .then((_response) => {
        setTasks((previousTasks) =>
          previousTasks.map((tsk) => ({ ...tsk, completed }))
        );
      })
      .catch(console.log);
  };

  const _addTask = () => {
    const title = newTaskTitleRef.current.value;

    if (title !== "") {
      axios
        .post("/api/v1/tasks", { title })
        .then((response) => {
          setTasks((previousTasks) => previousTasks.concat(response.data));

          newTaskTitleRef.current.value = "";
        })
        .catch(console.log);
    }
  };

  const _finishEditingTask = (event, task) => {
    event.target.parentElement.className = classNames(
      { completed: task.completed },
      { editing: false }
    );
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  let tasksFiltered;

  switch (taskFilter) {
    case "All":
      tasksFiltered = tasks;
      break;
    case "Active":
      tasksFiltered = pendingTasks;
      break;
    case "Completed":
      tasksFiltered = completedTasks;
      break;
    default:
      throw `Unexpected value for tasksFiltered [${taskFilter}]`;
  }

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            ref={newTaskTitleRef}
            onKeyDown={handleNewTaskKeyDown}
            onBlur={handleNewTaskBlur}
          />
        </header>

        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleTaskBundleUpdate}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {tasksFiltered.map((task) => (
              <li
                className={classNames(
                  { completed: task.completed },
                  { editing: false }
                )}
                key={task.id}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleTaskStatusUpdate(task)}
                  />
                  <label onDoubleClick={handleClickToEditTask(task)}>
                    {task.title}
                  </label>
                  <button
                    className="destroy"
                    onClick={handleTaskDestroy(task)}
                  ></button>
                </div>
                <input
                  className="edit"
                  value={task.title}
                  onChange={handleEditTask(task)}
                  onBlur={handleFinishEditTask(task)}
                  onKeyDown={handleFinishEditTaskKeyDown(task)}
                  ref={(el) => {
                    taskEditTitleInputs.current[task.id] = el;
                  }}
                />
              </li>
            ))}
          </ul>
        </section>

        <footer className="footer">
          <span className="todo-count">
            <strong>{pendingTasks.length}</strong> item
            {pendingTasks.length === 1 ? "" : "s"} left
          </span>
          <ul className="filters">
            {tasks.length > 0 && (
              <li>
                <a
                  className={classNames({ selected: taskFilter === "All" })}
                  href="#"
                  onClick={handleChangeFilter("All")}
                >
                  All
                </a>
              </li>
            )}
            {pendingTasks.length > 0 && (
              <li>
                <a
                  className={classNames({
                    selected: taskFilter === "Active",
                  })}
                  href="#"
                  onClick={handleChangeFilter("Active")}
                >
                  Active
                </a>
              </li>
            )}
            {completedTasks.length > 0 && (
              <li>
                <a
                  className={classNames({
                    selected: taskFilter === "Completed",
                  })}
                  href="#"
                  onClick={handleChangeFilter("Completed")}
                >
                  Completed
                </a>
              </li>
            )}
          </ul>
          {completedTasks.length > 0 && (
            <button
              className="clear-completed"
              onClick={handleClearCompletedTasks}
            >
              Clear completed
            </button>
          )}
        </footer>
      </section>

      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
        </p>
        <p>
          Created by <a href="http://todomvc.com">you</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
};

TaskManager.defaultProps = {};

TaskManager.propTypes = {};

export default TaskManager;
