import React, { FC } from "react"
import { FaPlay } from "react-icons/fa"

interface Props {
  onClick: () => void
  disabled: boolean
}

export const PlayButton: FC<Props> = ({ onClick, disabled }) => {
  return (
    <button className="btn-base btn-play" onClick={onClick} disabled={Boolean(disabled)}>
      <div className="btn-icon-container">
        <FaPlay className="btn-icon" />
      </div>
      <span className="btn-label">Play Now</span>
    </button>
  )
}
