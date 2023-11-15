import { useEffect } from "react"
import { getToken, refreshSpotifyToken } from "@/services/auth"
import { SetState } from "@/types/utils"

export const useRefreshToken = (
  code: string,
  refreshToken: string,
  expiresIn: number,
  setAccessToken: SetState<string | null>,
  setRefreshToken: SetState<string | null>,
  setExpiresIn: SetState<number | null>
) => {
  const fetchToken = async () => {
    let response = await getToken(code)
    setRefreshToken(response.refresh_token)
    setAccessToken(response.access_token)
    setExpiresIn(response.expires_in)
    sessionStorage.setItem("access_token", response.access_token)
  }

  const refreshTokenFn = async () => {
    let response = await refreshSpotifyToken(refreshToken)
    setAccessToken(response.access_token)
    setExpiresIn(response.expires_in)
    sessionStorage.setItem("access_token", response.access_token)
  }

  useEffect(() => {
    fetchToken()
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return

    const interval = setInterval(() => {
      refreshTokenFn()
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])
}
