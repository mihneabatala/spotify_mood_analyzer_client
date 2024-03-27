import React, { useEffect, useState } from "react";
import "../styles/library.css";
import playlistImage from "/images/playlist_image.jpg";
import axios from "axios";

const Library = ({ token }) => {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoadingPlaylists(true);
    axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.items.length != 0) {
          setPlaylists(
            res.data.items.map((playlist) => {
              const smallestImage = playlist.images
                ? playlist.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image;
                    return smallest;
                  }, playlist.images[0])
                : null;

              return {
                name: playlist.name,
                id: playlist.id,
                imgURL: smallestImage ? smallestImage.url : null,
              };
            })
          );
        }
        setLoadingPlaylists(false);
      })
      .catch((err) => {
        alert("Playlist doesn't have image");
        console.log(err);
      });
  }, []);

  const selectPlaylist = (id, name) => {
    setLoadingTracks(true);
    setPlaylistName(name);

    axios
      .get(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTracks(
          res.data.items.map((track) => {
            const smallestImage = track.track.album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image;
                return smallest;
              },
              track.track.album.images[0]
            );
            return {
              title: track.track.name,
              artist: track.track.artists[0].name,
              imgURL: smallestImage.url,
            };
          })
        );
        setLoadingTracks(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="library">
      <div className="playlists-component">
        <h1 className="playlists-title">Playlists</h1>
        <hr className="line" />
        <p className="delete-info">
          For managing playlists, such as editing or deleting, please access
          Spotify!
        </p>
        {playlists.length == 0 && !loadingPlaylists ? (
          <p className="playlists-empty">
            There are no playlists available. Create one!
          </p>
        ) : (
          <div className="playlists-container">
            {playlists.map((playlist, index) => (
              <div
                className="playlist"
                key={index}
                onClick={() => selectPlaylist(playlist.id, playlist.name)}
              >
                <img
                  src={
                    playlist.imgURL != null ? playlist.imgURL : playlistImage
                  }
                  alt="Playlist image"
                  className="playlist-img"
                />
                <p className="playlist-name">{playlist.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="playlist-view">
        <h1 className="playlist-title">
          {playlistName ? playlistName : "Choose a playlist"}
        </h1>
        <div style={{ width: "100%" }}>
          <hr className="line" />
        </div>

        {tracks.length == 0 && !loadingTracks && playlistName ? (
          <p className="playlist-tracks-empty">
            The playlist does not contain any tracks!
          </p>
        ) : (
          <div className="playlist-tracks">
            {!loadingTracks ? (
              tracks.map((track, index) => (
                <div className="playlist-track" key={index}>
                  <img
                    className="playlist-img"
                    src={track.imgURL}
                    alt="Track image"
                  />
                  <div className="track-info">
                    <p>{track.title}</p>
                    <p>{track.artist}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="loading-animation flex">
                <div className="loader"></div>
                <p className="loading-text">Loading Tracks</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
