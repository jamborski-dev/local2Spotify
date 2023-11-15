import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ test: "test" })
}

// const state = generateRandomString(16)
// const scope = "user-read-private user-read-email"

// res.redirect(
//   "https://accounts.spotify.com/authorize?" +
//     querystring.stringify({
//       response_type: "code",
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     })
// )
