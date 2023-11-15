import { OptionProps, components } from "react-select"

export const TrackSearchDropdownOption = (
  props: OptionProps<{ value: string; label: string; artists: string; image: string }>
) => {
  return (
    <components.Option {...props}>
      <div className="songList">
        <img className="trackImage" src={props.data.image} />
        <div>
          <p className="trackName">{props.data.label}</p>
          <p className="trackArtist">{props.data.artists}</p>
        </div>
      </div>
    </components.Option>
  )
}
