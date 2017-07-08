import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'

// TODO: use react, so we can also provide the album info here from the state
// and we don't have to pass everything from params... meh

const spotifyHeaders = (accessToken) => {
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${accessToken}`)

  return headers
}

const fetchSpotifyTracks = (accessToken, apiUrl) =>
  fetch(apiUrl, { headers: spotifyHeaders(accessToken) }).then(r => r.json())

const mapSpotifyTracks = httpResponse =>
  httpResponse.items.map(song => ({
    album: song.track.album.name,
    albumImage: song.track.album.images[2], // url, height, width
    name: song.track.name
  }))

const getSpotifyTracks = (accessToken, apiUrl) =>
  fetchSpotifyTracks(accessToken, apiUrl).then(mapSpotifyTracks)


class SpotifyExportPlaylist extends Component {
  constructor (props) {
    super(props)

    this.state = {tracks: []}

    const { location } = this.props

    /**
     * Hash params from the spotify auth.
     * Keys:
     *  access_token
     *  api_tracks
     */
    this._hashParams = this.props.location.hash.replace('#', '').split('&').reduce((acc, next) => {
      const [key, value] = next.split('=')
      acc[key] = value
      return acc
    }, {})
  }

  componentDidMount () {
    getSpotifyTracks(this._hashParams['access_token'], this._hashParams['api_tracks'])
      .then(tracks => this.setState({ tracks }))
  }

  _renderTrack = track =>
    <TableRow>
      <TableRowColumn>{track.name}</TableRowColumn>
      <TableRowColumn>{track.album}</TableRowColumn>
      <TableRowColumn><CircularProgress /></TableRowColumn>
    </TableRow>

  render () {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Song</TableHeaderColumn>
            <TableHeaderColumn>Album</TableHeaderColumn>
            <TableHeaderColumn>Youtube link</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.state.tracks.map(this._renderTrack)}
        </TableBody>
      </Table>
    )
  }
}

export default SpotifyExportPlaylist
