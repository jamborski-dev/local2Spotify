const BASEURL = `https://api.spotify.com/v1`

export const getTracks = async (searchQuery: string, token: string) => {
  // const token = sessionStorage.getItem("access_token")
  try {
    const response = await fetch(
      `${BASEURL}/search?q=${searchQuery}&type=track,album,playlist,artist&limit=4`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )

    return response.json()
  } catch (err) {
    console.log(err)
  }
}
