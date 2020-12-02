import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import TaskManager from '../components/task_manager'

const App = props =>
  <TaskManager />

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
