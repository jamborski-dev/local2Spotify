"use client"

import { getToken } from "@/services/auth"
import React, { createContext, useState, useEffect, FC, ReactNode } from "react"

const AuthContext = createContext({})

export const AuthProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
  const [code, setCode] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [codeVerifier, setCodeVerifier] = useState<string>()

  useEffect(() => {
    const code_verifier = sessionStorage.getItem("code_verifier")
    if (code_verifier) setCodeVerifier(code_verifier)
  }, [])

  useEffect(() => {
    if (code) {
      const tokenRes = getToken(code)
      console.log(tokenRes)
    }
  }, [code])

  return <AuthContext.Provider value={{ code }}>{children}</AuthContext.Provider>
}
