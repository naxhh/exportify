import React from 'react'

const Home = () =>
  <div>
    <p>
      <a href="https://accounts.spotify.com/authorize?client_id=d641e329e9094c3aa69d93fdbe251627&response_type=token&redirect_uri=http://localhost:3000/spotify-login&scope=playlist-read-private%20playlist-read-collaborative">
        Login with spotify
      </a>
    </p>
  </div>

export default Home