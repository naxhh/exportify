import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import { Switch, Route, Link } from 'react-router-dom'

import Home from './Home'
import SpotifyPlaylists from './SpotifyPlaylists'
import SpotifyExportPlaylist from './SpotifyExportPlaylist'

const App = () =>
  <MuiThemeProvider>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/spotify-login' component={SpotifyPlaylists} />
      <Route exact path='/spotify/export' component={SpotifyExportPlaylist} />
    </Switch>
  </MuiThemeProvider>

export default App