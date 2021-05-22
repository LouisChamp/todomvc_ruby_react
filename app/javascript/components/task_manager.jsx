import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes, { element } from 'prop-types'
import className from 'classnames'
import classNames from 'classnames'
import axios from 'axios'

const TaskManager = props => {
	
		const [tasks, setTasks] = useState([])
		const [taskFilter, setTaskFilter] = useState('All')
		const newTaskTilteRef = useRef(null)
		// const taskClassRef = useRef({})

		useEffect(() => {
			axios.get('api/v1/tasks')
			.then(response => {
				setTasks(response.data)
			})
			.catch(console.log)
		}, [])	

		const handleTaskDestroy = task => event => {
			if(confirm(`Are you sure you want to delete task ${task.title}`)) {
				axios.delete(`/api/v1/tasks/${task.id}`)
				.then(response => {
				setTasks(
					previousTasks => previousTasks.filter(tsk => tsk.id !== task.id)
					)
				})
				.catch(console.log)
			}
		}

		const handleTaskStatusUpdate = task => event => {
			const completed = event.target.checked

			axios.put(`/api/v1/tasks/${task.id}`, { completed })
			.then(response => {
				setTasks(
					previousTasks => previousTasks.map(tsk => 
						tsk.id === task.id ? {...tsk, completed} : tsk
					)
				)
			})
			.catch(console.log)
		}

		const handleNewTaskKeyDown = event => {
			const key = event.key

			switch(key) {
				case 'Enter':
					_addTask()
				break
				case 'Escape':
					newTaskTilteRef.current.value = ''
				break
				default:
			}
			
		}

		const handleNewTaskBlur = event => {
			_addTask()
		}

		const handleChangeFilter = filter => event => {
			event.preventDefault()
			setTaskFilter(filter)
		}

		const handleTaskEdit = task => event => {
			// taskClassRef[task.id].current.className = classNames({completed: task.completed} , {editing: true})
		}

		const handleClearCompletedTasks = _event => { 
			if (confirm('Are you sure you want to delete all completed tasks?')) {
				const ids = tasksComplete.map(task => task.id)
				
				axios.post('/api/v1/tasks/destroy_completed', { ids })
				.then(_response => {
					setTasks(
						tasksIncomplete
					)
				})
			}
		}

		const _addTask = () => {
			const title = newTaskTilteRef.current.value

			if (title !== '') {
				axios.post('/api/v1/tasks', { title })
				.then(response => {
					setTasks(previousTasks => previousTasks.concat(response.data))

					newTaskTilteRef.current.value = ''
				})
				.catch(console.log)
			}
		}

		const tasksIncomplete = tasks.filter(task => !task.completed)
		const tasksComplete = tasks.filter(task => task.completed)

		let tasksFiltered
		
		switch(taskFilter) {
			case 'All':
				tasksFiltered = tasks
			break
			case 'Active':
				tasksFiltered = tasksIncomplete
			break
			case 'Completed':
				tasksFiltered = tasksComplete
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
				ref={newTaskTilteRef}
				onKeyDown={handleNewTaskKeyDown} 
				onBlur={handleNewTaskBlur}
				/>
  		</header>

  		<section className="main">
  			<input id="toggle-all" className="toggle-all" type="checkbox" />
  			<label htmlFor="toggle-all">Mark all as complete</label>
  			<ul className="todo-list">
					{
						tasksFiltered.map(task => (
  				<li 
					className={classNames({completed: task.completed} , {editing: false})} 
					key={task.id} 
					// ref={taskClassRef[task.id]}
					>
  					<div className="view">
  						<input className="toggle" type="checkbox" checked={task.completed} onChange={handleTaskStatusUpdate(task)} />
  						<label onDoubleClick={handleTaskEdit(task)}>{task.title}</label>
  						<button className="destroy" onClick={ handleTaskDestroy(task)}></button>
  					</div>
  					<input className="edit" value={task.title} onChange={() => {}} />
  				</li>
						))
					}
  			</ul>
  		</section>

  		<footer className="footer">
  			<span className="todo-count"><strong>{tasksIncomplete.length}</strong> item{tasksIncomplete.length === 1 ? '' : 's'} left</span>
  			<ul className="filters">
  				<li>
  					<a className={classNames({selected: taskFilter === 'All'})} href='#' onClick={ handleChangeFilter('All')}>All</a>
  				</li>
  				<li>
  					<a className={classNames({selected: taskFilter === 'Active'})} href='#' onClick={ handleChangeFilter('Active')}>Active</a>
  				</li>
  				<li>
  					<a className={classNames({selected: taskFilter === 'Completed'})} href='#' onClick={ handleChangeFilter('Completed')}>Completed</a>
  				</li>
  			</ul>
  			{ tasksComplete.length > 0 && 
					<button className="clear-completed" onClick={handleClearCompletedTasks}>Clear completed</button>
				}
  		</footer>
  	</section>

  	<footer className="info">
  		<p>Double-click to edit a todo</p>
        <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
  		<p>Created by <a href="http://todomvc.com">you</a></p>
  		<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  	</footer>
  </>
	)
}

TaskManager.defaultProps = {
}

TaskManager.propTypes = {
}

export default TaskManager
