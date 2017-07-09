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

const textareaStyle = {width: '100%', height:'200px'}

const spotifyHeaders = (accessToken) => {
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${accessToken}`)

  return headers
}

const fetchSpotifyTracks = (accessToken, apiUrl) =>
  fetch(apiUrl, { headers: spotifyHeaders(accessToken) }).then(r => r.json())

const mapSpotifyTracks = httpResponse =>
  httpResponse.items.map(song => ({
    id: song.track.id,
    album: song.track.album.name,
    albumImage: song.track.album.images[2], // url, height, width
    name: song.track.name
  }))

const getSpotifyTracks = (accessToken, apiUrl) =>
  fetchSpotifyTracks(accessToken, apiUrl).then(mapSpotifyTracks)

const fetchYoutubeLink = track =>
  fetch(`https://www.googleapis.com/youtube/v3/search?part=id&q=${track.name}%20-%20${track.album}&key=AIzaSyBFUrzlhVrfOfNGbq8oUe115i3GCoIzbQ4`)
    .then(r => r.json())

// TODO: return more ids so user can choose a better link
const mapYoutubeLink = trackId => httpResponse => httpResponse.items.length === 0
  ? [trackId, 'no-matches']
  : [trackId, httpResponse.items[0].id.videoId]

const getYoutubeLink = track =>
  fetchYoutubeLink(track).then(mapYoutubeLink(track.id))

// Current idea is to fetch 10 links, update status with CB and fetch 10 more until finish
const updateYoutubeLinks = (tracks, cb) => {
  const chunkSize = 10
  const chunksN = Math.ceil(tracks.length / 10)

  const chunks = Array.apply(null, Array(chunksN)).map(
    (_, i) => tracks.slice(i * chunkSize, chunkSize * (i + 1))
  )

  chunks.reduce((previousPromise, next) => {
    return previousPromise
      .then(_ => {
        return Promise.all(next.map(getYoutubeLink))
      })
      .then(cb)
  }, Promise.resolve())
}


class SpotifyExportPlaylist extends Component {
  constructor (props) {
    super(props)

    this.state = {tracks: [], links: {}}

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
      .then(tracks => {
        this.setState({ tracks })
        updateYoutubeLinks(tracks, mapping => {
          const links = mapping.reduce((acc, item) => {
            const [spotifyKey, youtubeId] = item
            acc[spotifyKey] = youtubeId ? youtubeId : 'unknown error :('
            
            return acc
          }, this.state.links)

          this.setState({ links })
        })
      })
  }

  _renderYoutubeUrl = youtubeId => youtubeId === 'unknown error :(' || youtubeId === 'no-matches'
    ? 'we where not able to find this one'
    : `https://www.youtube.com/watch?v=${youtubeId}`

  _renderYoutubeField = trackId => !this.state.links[trackId]
    ? <CircularProgress />
    : this._renderYoutubeUrl(this.state.links[trackId])

  _renderTrack = (track, index) =>
    <TableRow key={index}>
      <TableRowColumn>{track.name}</TableRowColumn>
      <TableRowColumn>{track.album}</TableRowColumn>
      <TableRowColumn>{this._renderYoutubeField(track.id)}</TableRowColumn>
    </TableRow>

  _renderLinks = track => !this.state.links[track.id]
    ? ''
    : this._renderYoutubeUrl(this.state.links[track.id])

  render () {
    return (
      <div>
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
        <textarea
          value={this.state.tracks.map(this._renderLinks).filter(x => x !== 'we where not able to find this one').join('\n')}
          style={textareaStyle}
        />
      </div>
    )
  }
}

export default SpotifyExportPlaylist
