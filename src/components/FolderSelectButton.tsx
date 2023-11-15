import React, { useRef, FC } from "react"
import { RiUploadLine } from "react-icons/ri" // Import an icon from react-icons library

interface Props {
  handleFileChange: (event: any) => void
  isDisabled: boolean
  containerClass: string
}

const FileUploadButton: FC<Props> = ({ handleFileChange, isDisabled, containerClass }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click() // Trigger the file input when the button is clicked
    }
  }

  return (
    <div className={`file-upload-container ${containerClass ?? ""}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        // @ts-ignore
        directory=""
        // @ts-ignore
        webkitdirectory=""
        style={{ display: "none" }} // Hide the actual file input
        disabled={isDisabled}
      />
      <button className="btn-base" onClick={handleClick} disabled={isDisabled}>
        <RiUploadLine className="btn-icon" /> Choose Folder
      </button>
    </div>
  )
}

export default FileUploadButton
