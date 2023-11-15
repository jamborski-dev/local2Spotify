import { SingleValueProps, components } from "react-select"

export const TrackSearchDropdownSingleValue = (
  props: SingleValueProps<{ value: string; label: string; artists: string; image: string }>
) => {
  return (
    <components.SingleValue {...props}>
      <div className="songList">
        <img className="trackImage" src={props.data.image} />
        <div>
          <p className="trackName">{props.data.label}</p>
          <p className="trackArtist">{props.data.artists}</p>
        </div>
      </div>
    </components.SingleValue>
  )
}
