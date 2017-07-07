import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton';


const App = () =>
	<MuiThemeProvider>
		<div>
			<h1>hi</h1>
			<RaisedButton label="Default" />
		</div>
	</MuiThemeProvider>

export default App