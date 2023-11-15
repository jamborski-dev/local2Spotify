"use client"
import { AppLogo } from "@/components/AppLogo"
import { FileListItem } from "@/components/FileListItem"
import { SpotifyLogin } from "@/components/SpotifyLogin"
import { getToken } from "@/services/auth"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { BsFillGridFill } from "react-icons/bs"
import { FaThList } from "react-icons/fa"
import { HiRefresh } from "react-icons/hi"
import SpotifyPlayer from "react-spotify-web-playback"
import FolderSelectButton from "../components/FolderSelectButton"
import "./page.css"

// import { useRefreshToken } from "@/hooks/useRefreshToken"

const AUDIO_EXTENSIONS = [".mp3", ".m4a", ".flac", ".wav", ".ogg"]

export default function Home() {
  const [files, setFiles] = useState<File[] | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [expiresIn, setExpiresIn] = useState<number | null>(null)
  const [folderSelectionError, setFolderSelectionError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTrackUri, setCurrentTrackUri] = useState<string>("")

  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  const handleFileChange = (event: any) => {
    setFolderSelectionError(null)
    const _files = event.target.files
    if (!_files.length) {
      setFolderSelectionError("No files in selected folder")
      return
    }

    const musicFiles = [..._files].filter((file: File) =>
      AUDIO_EXTENSIONS.some(ext => file.webkitRelativePath.includes(ext))
    )

    if (!musicFiles.length) {
      setFolderSelectionError("No music files found in selected folder")
      return
    }
    setFiles(musicFiles)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
  }

  const handleGetToken = async () => {
    if (!code) return
    const { access_token, refresh_token, expires_in } = await getToken(code)
    setAccessToken(access_token)
    setRefreshToken(refresh_token)
    setExpiresIn(expires_in)
  }

  useEffect(() => {
    handleGetToken()
  }, [code])

  const playerStyles = {
    bgColor: "#ffffff1c",
    color: "#ffffff",
    sliderColor: "#1cb954",
    sliderHandleColor: "whitesmoke",
    trackArtistColor: "#ffffff",
    trackNameColor: "#fff",
    width: "50vw",
    padding: "1rem",
    borderRadius: "1rem"
  }

  return (
    <main className="main">
      <form onSubmit={handleSubmit}>
        <section>
          <div className="page-header">
            <AppLogo />
            {accessToken ? (
              <SpotifyPlayer
                token={accessToken}
                play={isPlaying}
                initialVolume={0.65}
                styles={playerStyles}
                uris={[currentTrackUri]}
              />
            ) : (
              <div className="player-skeleton">You have to get authorized to enable player</div>
            )}
          </div>
          <div className="btn-group">
            <button className="btn-base btn-secondary" onClick={() => (window.location.href = "/")}>
              <HiRefresh className="btn-icon" />
              Refresh Page
            </button>
            <SpotifyLogin code={code ?? undefined} token={accessToken ?? undefined} />
            <FolderSelectButton
              handleFileChange={handleFileChange}
              isDisabled={!accessToken}
              containerClass="btn-select-folder"
            />
          </div>
        </section>
        <section>
          {/* @ts-ignore */}
          {folderSelectionError && <div className="error">{folderSelectionError}</div>}
          {files && (
            <>
              <header className="file-list-header">
                <h2>Files</h2>
                <div className="flex-row file-list-header__tools">
                  <div className="file-count">{files.length} files</div>
                  <div className="flex-row file-list-view-toggles">
                    <button className="btn-icon-only">
                      <FaThList className="btn-icon" />
                    </button>
                    <button className="btn-icon-only">
                      <BsFillGridFill className="btn-icon" />
                    </button>
                  </div>
                </div>
              </header>
              <ul>
                {files.map((file, id) => (
                  <FileListItem
                    key={id}
                    file={file}
                    token={accessToken as string}
                    setIsPlaying={setIsPlaying}
                    setCurrentTrackUri={setCurrentTrackUri}
                  />
                ))}
              </ul>
            </>
          )}
        </section>
      </form>
    </main>
  )
}
