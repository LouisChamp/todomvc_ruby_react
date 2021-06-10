import React, { useState, useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import PropTypes, { element } from "prop-types"
import className from "classnames"
import classNames from "classnames"
import axios from "axios"

const TaskManager = props => {
  // React Hooks

  const [tasks, setTasks] = useState([])
  const [taskFilter, setTaskFilter] = useState("All")
  const newTaskTitleRef = useRef(null)
  const taskEditTitleInputs = useRef({})
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = "http://localhost:3001"

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/v1/tasks`)
      .then(response => {
        setTasks(response.data)
      })
      .catch(console.log)
  }, [])

  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  // Handling Methods

  const handleTaskDestroy = task => event => {
    if (confirm(`Are you sure you want to delete task ${task.title}`)) {
      axios
        .delete(`${API_BASE_URL}/api/v1/tasks/${task.id}`)
        .then(_response => {
          setTasks(previousTasks =>
            previousTasks.filter(tsk => tsk.id !== task.id)
          )
        })
        .catch(console.log)
    }
  }

  const handleTaskStatusUpdate = task => event => {
    const completed = event.target.checked

    axios
      .put(`${API_BASE_URL}/api/v1/tasks/${task.id}`, { completed })
      .then(_response => {
        setTasks(previousTasks =>
          previousTasks.map(tsk =>
            tsk.id === task.id ? { ...tsk, completed } : tsk
          )
        )
      })
      .catch(console.log)
  }

  const handleNewTaskKeyDown = event => {
    const key = event.key

    switch (key) {
      case "Enter":
        _addTask()
        break
      case "Escape":
        newTaskTitleRef.current.value = ""
        break
      default:
    }
  }

  const handleNewTaskBlur = event => {
    _addTask()
  }

  const _addTask = () => {
    const title = newTaskTitleRef.current.value

    if (title !== "") {
      axios
        .post(`${API_BASE_URL}/api/v1/tasks`, { title })
        .then(response => {
          setTasks(previousTasks => previousTasks.concat(response.data))

          newTaskTitleRef.current.value = ""
        })
        .catch(console.log)
    }
  }

  const handleChangeFilter = filter => event => {
    event.preventDefault()
    setTaskFilter(filter)
  }

  const handleClickToEditTask = task => _event => {
    setEditingTaskId(task.id)

    setTimeout(() => {
      taskEditTitleInputs.current[task.id].focus()
    }, 0)
  }

  const handleFinishEditingTaskBlur = task => _event => {
    _editTask(task)
  }

  const handleFinishEditingTaskKeyDown = task => event => {
    const key = event.key
    const taskTitleInput = taskEditTitleInputs.current[task.id]

    switch (key) {
      case "Enter":
        taskTitleInput.blur()
        break
      case "Escape":
        taskTitleInput.value = task.title
        break
      default:
    }
  }

  const _editTask = task => {
    const title = taskEditTitleInputs.current[task.id].value

    if (title !== "" && title !== task.title) {
      setLoading(true)

      axios
        .put(`${API_BASE_URL}/api/v1/tasks/${task.id}`, { title })
        .then(response => {
          setTasks(previousTasks =>
            previousTasks.map(tsk => (task.id === tsk.id ? response.data : tsk))
          )

          setEditingTaskId(null)
        })
        .catch(console.log)
        .finally(() => {
          setLoading(false)
        })
    } else {
      setEditingTaskId(null)
    }
  }

  const handleClearCompletedTasks = _event => {
    if (confirm("Are you sure you want to delete all completed tasks?")) {
      const ids = completedTasks.map(task => task.id)

      axios
        .post(`${API_BASE_URL}/api/v1/tasks/destroy_completed`, { ids })
        .then(_response => {
          setTasks(pendingTasks)
        })
    }
  }

  const handleTaskBundleUpdate = event => {
    const completed = event.target.checked
    const ids = (completed ? pendingTasks : completedTasks).map(task => task.id)

    axios
      .put(`${API_BASE_URL}/api/v1/tasks/batch_update_completed`, {
        ids,
        completed,
      })
      .then(_response => {
        setTasks(previousTasks =>
          previousTasks.map(task =>
            ids.includes(task.id)
              ? { ...task, completed: !task.completed }
              : task
          )
        )
      })
      .catch(console.log)
  }

  let tasksFiltered

  switch (taskFilter) {
    case "All":
      tasksFiltered = tasks
      break
    case "Active":
      tasksFiltered = pendingTasks
      break
    case "Completed":
      tasksFiltered = completedTasks
      break
    default:
      throw `Unexpected value for tasksFiltered [${taskFilter}]`
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
            {tasksFiltered.map(task => (
              <li
                className={classNames(
                  { completed: task.completed },
                  { editing: task.id === editingTaskId }
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
                  defaultValue={task.title}
                  onBlur={handleFinishEditingTaskBlur(task)}
                  onKeyDown={handleFinishEditingTaskKeyDown(task)}
                  ref={el => {
                    taskEditTitleInputs.current[task.id] = el
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

      {loading && <p>Loading...</p>}

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
  )
}

TaskManager.defaultProps = {}

TaskManager.propTypes = {}

export default TaskManager
