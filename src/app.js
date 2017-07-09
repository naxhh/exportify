import ReactDOM from 'react-dom'
import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'

// Needed for material-ui
injectTapEventPlugin()

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
