export interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  uri: string
  duration_ms: number
  preview_url: string
  images: string
}

interface SpotifyArtist {
  id: string
  name: string
}

interface SpotifyAlbum {
  id: string
  name: string
  images: { height: number; width: number; url: string }[]
}

export interface SearchDropdownItem {
  value: any
  label: string
  artists: string
  image: string
}
