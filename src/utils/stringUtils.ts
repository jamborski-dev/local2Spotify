import leven from "leven"

export function parseSongName(songName: string) {
  const artists: string[] = []
  let songTitle = ""

  const separators = [" & ", " feat. ", " ft. ", " and ", ", "]

  // Splitting by '-'
  const parts = songName.split(" - ")
  if (parts.length === 2) {
    const artistPart = parts[0]
    const titlePart = parts[1]

    // Splitting the artist part using separators
    const artistNames = artistPart.split(new RegExp(`\\s*(${separators.join("|")})\\s*`, "i"))

    artistNames.forEach(artist => {
      const trimmedArtist = artist.trim()
      if (trimmedArtist) {
        artists.push(trimmedArtist)
      }
    })

    // Remove any remaining '&' from artist names
    artists.forEach((artist, index) => {
      artists[index] = artist.replace(/&/g, "").trim()
    })

    songTitle = titlePart
  }

  return {
    artists,
    title: songTitle
  }
}

// function that will take string that is a song file name without extension and return an object with artist and song name whereas artists can be separated by ' & ', ' feat. ', ' ft. ', ' and ', ', ' and song name should be everything after ' - '. In case there is no ' - ' in the string, the song name will be the whole string and artists array should be ['Unknown artist'].
// TODO refactor, needs separating artists from title part
export function parseSongNameV2(songName: string) {
  const separators = [" & ", " feat. ", " ft. ", " and ", ", ", " ft "]
  let artists: string[] = []
  let artistPart = ""
  let titlePart = ""
  let titleSuffix = ""
  let isRemix = songName.toLowerCase().includes("remix")

  // Splitting by '-'
  const parts = songName.split(" - ")
  if (parts.length === 2) {
    artistPart = parts[0]
    titlePart = parts[1]

    // Regular expression to match the suffix within parentheses
    const regex = /\(([^)]+)\)/
    // Use the regex to extract the suffix
    const matchSuffix = regex.exec(titlePart)

    if (matchSuffix) {
      titleSuffix = matchSuffix[0]
      titlePart = titlePart.replace(titleSuffix, "").trim()
    }

    // Splitting the artist part using separators
    artists = artistPart.split(new RegExp(`\\s*(${separators.join("|")})\\s*`, "i"))

    // Remove any remaining '&' from artist names
    artists = artists.filter(artist => !separators.some(sep => artist.includes(sep)))

    // Removing any remaining 'feat.', 'ft.', 'and', ',' from the title part
    separators.forEach(separator => {
      const separatorRegex = new RegExp(`\\s*(${separator})\\s*`, "gi")
      titlePart.replace(separatorRegex, "")
    })

    // Removing any remaining '()' from the title part
    const parenthesisRegex = /\s*\(.*\)\s*/gi
    titlePart.replace(parenthesisRegex, "")

    // Removing any remaining '[]' from the title part
    const bracketsRegex = /\s*\[.*\]\s*/gi
    titlePart.replace(bracketsRegex, "")

    // Removing any remaining ' - ' from the title part
    const dashRegex = /\s*-.*\s*/gi
    titlePart.replace(dashRegex, "")

    // Removing any remaining ' - ' from the title part
    const underscoreRegex = /\s*_.*\s*/gi
    titlePart.replace(underscoreRegex, "")

    // Removing any remaining ' - ' from the title part
    const dashRegex2 = /\s*–.*\s*/gi
    titlePart.replace(dashRegex2, "")

    // Removing any remaining ' - ' from the title part
    const underscoreRegex2 = /\s*—.*\s*/gi
    titlePart.replace(underscoreRegex2, "")
  }

  return {
    artists,
    title: titlePart,
    suffix: titleSuffix,
    isRemix
  }
}

export function formatArtists(artists: string[]) {
  if (artists.length === 1) return artists[0]
  if (artists.length === 2) return `${artists[0]} and ${artists[1]}`
  if (artists.length > 2)
    return `${artists.filter((_, i) => i < artists.length - 1).join(", ")} and ${
      artists.length - 1
    } more`
  return ""
}

export const validateSearchResult = (
  title1: string,
  title2: string,
  artist1: string[],
  artist2: string[]
) => {
  let isValidArtist = false
  let isValidTitle = false
  if (
    title1.toLowerCase().includes(title2.toLowerCase()) ||
    title2.toLowerCase().includes(title1.toLowerCase())
  ) {
    isValidTitle = true
  }

  if (title1 && title2) {
    const distance = leven(title1, title2)
    if (distance < 3) {
      isValidTitle = true
    }
  }

  // Perform case-insensitive comparison of 2 artists arrays
  if (
    artist1.some(artist =>
      artist2.some(artist2Item => artist2Item.toLowerCase() === artist.toLowerCase())
    ) ||
    artist2.some(artist =>
      artist1.some(artist1Item => artist1Item.toLowerCase() === artist.toLowerCase())
    )
  ) {
    isValidArtist = true
  }

  if (artist1 && artist2) {
    const distance = leven(artist1.join(" "), artist2.join(" "))
    if (distance < 3) {
      isValidArtist = true
    }
  }

  return isValidArtist && isValidTitle
}

export const removeSpotifyTitleSuffix = (title: string) => {
  return title.split(" - ")[0]
}
