import ReactDOM from 'react-dom'
import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import App from './components/App'

//Needed for material-ui
injectTapEventPlugin()

ReactDOM.render(
	<App />,
	document.getElementById('root')
)