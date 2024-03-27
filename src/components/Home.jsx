import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import History from "./History";
import Mood from "./Mood";
import "../styles/home.css";


const Home = ({ token }) => {
  const [historyTracks, setHistoryTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    axios
      .get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setHistoryTracks(
          res.data.items.map((track) => {
            const smallestImage = track.track.album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image;
                return smallest;
              },
              track.track.album.images[0]
            );
            return {
              artist: track.track.album.artists[0].name,
              title: track.track.name,
              imgURL: smallestImage.url,
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        alert("An error occurred. Redirecting to the homepage.");
        window.location.assign("/");
        console.log(err);
      });
  }, [token]);
  if (loading) {
    return <div></div>;
  }
  return (
    <div className="home-container">
      <History historyTracks={historyTracks} />
      <Mood token={token} historyTracks={historyTracks} />
    </div>
  );
};

export default Home;
