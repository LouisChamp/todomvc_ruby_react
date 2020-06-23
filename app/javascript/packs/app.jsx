import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import TasksManager from './tasks_manager'

const App = props =>
  <TasksManager />

App.defaultProps = {
}

App.propTypes = {
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div')),
  )
})
