import React, { Component } from 'react'
import { GridList, GridTile } from 'material-ui/GridList'
import Subheader from 'material-ui/Subheader'
import IconButton from 'material-ui/IconButton'
import ImportExport from 'material-ui/svg-icons/communication/import-export'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 800,
    height: 800,
    overflowY: 'auto',
  },
}

// TODO: move http logic out of the component
// use redux? for state manager, keeping auth code, etc
// TODO handle rejection.

const spotifyHeaders = (accessToken) => {
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${accessToken}`)

  return headers
}

// TODO: pagination
const fetchSpotifyPlaylists = accessToken =>
  fetch('https://api.spotify.com/v1/me/playlists', { headers: spotifyHeaders(accessToken)}).then(r => r.json())

const mapSpotifyPlaylists = httpResponse =>
  httpResponse.items.map(playlist => ({
    name: playlist.name,
    url: playlist.external_urls.spotify,
    img: playlist.images[0].url,
    tracks: playlist.tracks.total,
    apiTracks: playlist.tracks.href
  }))

const getSpotifyPlaylists = (accessToken) =>
  fetchSpotifyPlaylists(accessToken).then(mapSpotifyPlaylists)


class SpotifyPlaylists extends Component {
  constructor (props) {
    super(props)

    this.state = {playlists: []}

    const { location } = this.props

    /**
     * Hash params from the spotify auth.
     * Keys:
     *  access_token
     *. token_type
     *. expires_in
     */
    this._hashParams = this.props.location.hash.replace('#', '').split('&').reduce((acc, next) => {
      const [key, value] = next.split('=')
      acc[key] = value
      return acc
    }, {})
  }
  
  componentDidMount () {
    getSpotifyPlaylists(this._hashParams['access_token']).then(playlists => {
      this.setState({ playlists })
    })
  }

  _renderPlaylist = playlist =>
    <GridTile
      key={playlist.url}
      title={`${playlist.name}: ${playlist.tracks} tracks`}
      actionIcon={<IconButton
        tooltip='Export tracks'
        href={`/spotify/export#access_token=${this._hashParams['access_token']}&api_tracks=${playlist.apiTracks}`}
        >
          <ImportExport color='white' />
        </IconButton>}
    >
      <img src={playlist.img} alt={playlist.name} />
    </GridTile>

  render () {
    return (
      <div style={styles.root}>
        <GridList cellHeight={180} style={styles.gridList}>
          <Subheader>Your playlists</Subheader>
          {this.state.playlists.map(this._renderPlaylist)}
        </GridList>
      </div>
    )
  }
}

export default SpotifyPlaylists