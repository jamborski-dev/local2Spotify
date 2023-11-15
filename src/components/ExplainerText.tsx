import React from "react"

export const ExplainerText = () => {
  return (
    <header className="main-header">
      <p>
        If you grew up in the 90's or early 2000's I bet you have at least some music in the form of
        MP3 files somewhere on your devices. Nowadays, in the era of streaming platforms I very
        rarely find myself needing to play my favorite songs using physical files - its ALL out
        there. Now, the problem arise when your music library is rather large - it would take ages
        to transition into exclusively using streaming platform.
      </p>
      <p>
        <strong>Local2Spotify</strong> will enable you to do just that - simply select a folder and
        it will generate a Spotify playlist for you. You will be able to{" "}
        <strong>preview tracks</strong>, tick to <strong>accept</strong> or choose a{" "}
        <strong>different item</strong> for each found track, <strong>edit playlist name</strong>{" "}
        and once list is complied <strong>Save to Process</strong>.
      </p>
      <p>
        <span className="hint">
          The only caveat is - your library must be neat, meaning - file names should have nice
          formatting so the algorithm is able to dissect it into parts and perform search in the
          Spotify database.
        </span>
      </p>
    </header>
  )
}
