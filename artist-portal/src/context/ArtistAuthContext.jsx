import React, { Children, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

const ArtistAuthContext = createContext();

const ArtistAuthProvider = ({ children }) => {
  const [isArtistAuthenticated, setIsArtistAuthenticated] = useState(false);
  const [artist, setArtist] = useState(null);
  const [loadingArtist, setloadingArtist] = useState();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsArtistAuthenticated(true);
      setArtist({ token });
      setloadingArtist(false);
    } else {
      setIsArtistAuthenticated(false);
      setloadingArtist(false);
    }
  }, []);

  const artistLogin =(artistData) => {
    setIsArtistAuthenticated(true);
    setArtist(artistData)
  }

  return(
    <ArtistAuthContext.Provider
      value={{
        isArtistAuthenticated,
        artistLogin,
        artist,
        loadingArtist,
      }}
    >
      {children}
    </ArtistAuthContext.Provider>
  )

};

export { ArtistAuthContext, ArtistAuthProvider };