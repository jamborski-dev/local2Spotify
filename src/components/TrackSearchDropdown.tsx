import { SpotifyTrack } from "@/types/spotify"
import { formatArtists } from "@/utils/stringUtils"
import { FC } from "react"
import Select, { StylesConfig } from "react-select"
import { TrackSearchDropdownOption } from "./TrackSearchDropdownOption"
import { TrackSearchDropdownSingleValue } from "./TrackSearchDropdownSingleValue"

export const TrackSearchDropdown: FC<{
  list: SpotifyTrack[]
  topResult: SpotifyTrack | null
  isSearchValid: boolean
}> = ({ list, topResult, isSearchValid }) => {
  const customStyles: StylesConfig = {
    container: provided => ({
      ...provided,
      width: "100%"
    }),
    control: provided => ({
      ...provided,
      backgroundColor: "var(--spotify-black)",
      color: "white",
      border: "none"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#333" : "var(--spotify-black)",
      color: state.isSelected ? "white" : "inherit",
      ":hover": {
        backgroundColor: "#333"
      }
    }),
    menuList: provided => ({
      ...provided,
      border: "none",
      backgroundColor: "var(--spotify-green)"
    }),
    singleValue: provided => ({
      ...provided,
      color: "white",
      padding: "0.5rem"
    })
  }

  const options = list.map((track: SpotifyTrack) => ({
    value: track.id,
    label: `${track.name}`,
    artists: formatArtists(track.artists.map(a => a.name)),
    image: track.album.images[0].url
  }))

  const defaultValue = topResult
    ? {
        value: topResult.id,
        label: topResult.name,
        artists: formatArtists(topResult.artists.map(a => a.name)),
        image: topResult.album.images[0].url
      }
    : options[0]

  // TODO move above to state to be dependent on props
  // If no result or error show 'Manual Search' button
  return (
    <Select
      options={options}
      defaultValue={defaultValue}
      isSearchable={true}
      isClearable={true}
      placeholder="Select a track"
      // @ts-ignore
      styles={customStyles}
      onChange={selectedOption => {
        console.log("Selected:", selectedOption)
      }}
      components={{
        Option: TrackSearchDropdownOption,
        SingleValue: TrackSearchDropdownSingleValue
      }}
    />
  )
}
