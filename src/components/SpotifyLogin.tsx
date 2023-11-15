"use client"

import { FC, useEffect, useState } from "react"
import { authorize } from "../services/auth"
import { BsPersonCheckFill, BsPersonFillSlash } from "react-icons/bs"

export const SpotifyLogin: FC<{ code?: string; token?: string }> = ({ code, token }) => {
  const text = {
    noAuth: "Authorize with Spotify",
    auth: "You're Authorized!"
  }
  const [authText, setAuthText] = useState(text.noAuth)

  const handleLogin = async () => {
    if (!code || !token) {
      await authorize()
    }
  }

  useEffect(() => {
    if (!token) {
      setAuthText(text.noAuth)
      return
    }

    setAuthText(text.auth)
  }, [code, token])

  return (
    <button className="btn-base" onClick={handleLogin} disabled={Boolean(code)}>
      {token ? (
        <BsPersonCheckFill className="btn-icon" />
      ) : (
        <BsPersonFillSlash className="btn-icon" />
      )}
      {authText}
    </button>
  )
}
