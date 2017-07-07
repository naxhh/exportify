import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import { Route, Link } from 'react-router-dom'


const Home = () =>
	<div>
		<nav>
			<Link to='/test'>Test</Link>
		</nav>
		<div>
			<h1>hi</h1>
			<RaisedButton label="Default" />
		</div>
	</div>

const Test = () =>
	<h1>Hi and all</h1>


const App = () =>
	<MuiThemeProvider>
		<div>
			<Route exact path='/' component={Home} />
			<Route path='/test' component={Test} />
		</div>
	</MuiThemeProvider>

export default App