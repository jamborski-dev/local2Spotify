import { getTracks } from "@/services/spotify"
import { SpotifyTrack } from "@/types/spotify"
import { SetState } from "@/types/utils"
import {
  parseSongNameV2,
  removeSpotifyTitleSuffix,
  validateSearchResult,
  formatArtists
} from "@/utils/stringUtils"
import leven from "leven"
import { FC, useState, useEffect } from "react"
import { PlayButton } from "./PlayButton"
import { TrackSearchDropdown } from "./TrackSearchDropdown"

interface FileListItemProps {
  file: File
  token: string
  setIsPlaying: SetState<boolean>
  setCurrentTrackUri: SetState<string>
}

// TODO use 'leven' package to find closest match within the search results and handle if difference is too high
export const FileListItem: FC<FileListItemProps> = ({
  file,
  token,
  setIsPlaying,
  setCurrentTrackUri
}) => {
  const lastSlashIndex = file.webkitRelativePath.lastIndexOf("/")
  const directory = file.webkitRelativePath.slice(0, lastSlashIndex + 1)
  const filenameNoExt = file.webkitRelativePath.slice(lastSlashIndex + 1, -4)
  const { artists, title } = parseSongNameV2(filenameNoExt)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([])
  const [topResult, setTopResult] = useState<SpotifyTrack | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSearchValid, setIsSearchValid] = useState<boolean>(false)

  const handleSearch = async () => {
    if (!token) return
    setSearchResults([])
    setIsLoading(true)
    const response = await getTracks([...artists, title].join(" "), token)
    if (!response || response.error) {
      setError("Search error occurred")
      setIsLoading(false)
      return
    }
    console.log(response)
    const topTrack = response.tracks.items.reduce((prev: SpotifyTrack, curr: SpotifyTrack) => {
      const currentFile = `${artists.join(" ")} ${title}`

      const prevTrack = `${prev.artists.map(a => a.name).join(" ")} ${removeSpotifyTitleSuffix(
        prev.name
      )}`
      const currTrack = `${curr.artists.map(a => a.name).join(" ")} ${removeSpotifyTitleSuffix(
        curr.name
      )}`

      const isTitleMatching =
        currTrack.toLowerCase().includes(currentFile.toLowerCase()) ||
        currentFile.toLowerCase().includes(currTrack.toLowerCase())

      if (isTitleMatching) return curr

      const prevTrackDiff = leven(prevTrack, currentFile)
      const currTrackDiff = leven(currTrack, currentFile)

      return prevTrackDiff < currTrackDiff ? prev : curr
    })

    if (topTrack) {
      setTopResult(topTrack)
    }

    setSearchResults(response.tracks.items)
    setIsLoading(false)
  }

  const handlePlay = () => {
    setIsPlaying(true)
    if (!searchResults.length) {
      setError("No search results for this item")
      return
    }
    setCurrentTrackUri(searchResults[0].uri)
  }

  useEffect(() => {
    handleSearch()
  }, [token])

  useEffect(() => {
    if (!searchResults.length || isLoading || !topResult) return

    const isTopTrackValid = validateSearchResult(
      topResult.name,
      title,
      topResult.artists.map(a => a.name),
      artists
    )

    setIsSearchValid(isTopTrackValid)
  }, [isLoading, topResult])

  return (
    <li className={`file-list-item ${!isSearchValid ? "-item-search-invalid" : ""}`}>
      <div className="file-meta">
        <div className="file-name">
          {title && artists.length > 0 ? (
            <>
              <strong>{title}</strong> <span className="by">by</span> {formatArtists(artists)}
            </>
          ) : (
            <>{filenameNoExt}</>
          )}
        </div>
        <div className="file-path">
          File: <span className="file-path__dir">{directory}</span>
          <span className="file-path__filename">{file.name}</span>
        </div>
      </div>
      <div className="spotify-search">
        {!searchResults.length ? (
          isLoading && !error ? (
            <span>Loading track...</span>
          ) : !error ? (
            <span>No results</span>
          ) : (
            <div className="error">{error}</div>
          )
        ) : (
          <TrackSearchDropdown
            list={searchResults}
            topResult={topResult}
            isSearchValid={isSearchValid}
          />
        )}
      </div>
      <div className="spotify-player">
        <PlayButton onClick={handlePlay} disabled={Boolean(error)} />
      </div>
    </li>
  )
}
