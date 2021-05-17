import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TaskManager = props => {
	const tasks = [
		{ id: 1, title: 'Task A', completed: true },
		{ id: 2, title: 'Task B', completed: false },
		{ id: 3, title: 'Task C', completed: true },
	]

	const pendingTasks = tasks.filter(task => !task.completed)

	return (
		<>
			<section className="todoapp">
				<header className="header">
					<h1>todos</h1>
					<input className="new-todo" placeholder="What needs to be done?" autoFocus />
				</header>

				<section className="main">
					<input id="toggle-all" className="toggle-all" type="checkbox" />
					<label htmlFor="toggle-all">Mark all as complete</label>
					<ul className="todo-list">
						{tasks.map(task => (
							<li className={classNames({ completed: task.completed })} key={task.id}>
								<div className="view">
									<input className="toggle" type="checkbox" checked={task.completed} onChange={() => { }} />
									<label>{task.title}</label>
									<button className="destroy"></button>
								</div>
								<input className="edit" value="Create a TodoMVC template" onChange={() => { }} />
							</li>
						))}
					</ul>
				</section>

				<footer className="footer">
					<span className="todo-count"><strong>{pendingTasks.length}</strong> item{
						pendingTasks.length === 1 ? '' : 's'
					} left</span>
					<ul className="filters">
						<li>
							<a className="selected" href="#/">All</a>
						</li>
						<li>
							<a href="#/active">Active</a>
						</li>
						<li>
							<a href="#/completed">Completed</a>
						</li>
					</ul>
					<button className="clear-completed">Clear completed</button>
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
