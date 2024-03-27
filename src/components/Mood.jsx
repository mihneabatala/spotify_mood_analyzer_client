import React, { useState, useEffect } from "react";
import "../styles/mood.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Mood = ({ token, historyTracks }) => {
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("");
  const [showDiscoverButton, setShowDiscoverButton] = useState(false);
  const [timerDiscover, setTimerDiscover] = useState("");
  const [select, setSelect] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userId, setUserId] = useState("");
  const [create, setCreate] = useState(true);
  const [timerPlaylist, setTimerPlaylist] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem("id"));
    setMood(localStorage.getItem("mood") || "Happy");
    const lastDiscoverTimestamp = localStorage.getItem("lastDiscoverTimestamp");
    if (!lastDiscoverTimestamp) {
      setShowDiscoverButton(true);
    }
    if (lastDiscoverTimestamp) {
      const oneHourInMillis = 3600 * 1000;
      const oneHourAgo = Date.now() - oneHourInMillis;
      const minutesUntilNextDiscovery = Math.ceil(
        (lastDiscoverTimestamp - oneHourAgo) / (1000 * 60)
      );
      setTimerDiscover(minutesUntilNextDiscovery);
      if (lastDiscoverTimestamp < oneHourAgo) {
        setShowDiscoverButton(true);
      } else {
        setShowDiscoverButton(false);
      }
    }
    const interval = setInterval(() => {
      setTimerDiscover((prevTimer) => prevTimer - 1);
    }, 60000);

    return () => clearInterval(interval);
  }, [timerDiscover, showDiscoverButton]);

  useEffect(() => {
    const counter = parseInt(localStorage.getItem("availabilityCounter")) || 0;
    const lastPlaylistTimestamp =
      parseInt(localStorage.getItem("lastPlaylistTimestamp")) || 0;

    const oneHourInMillis = 3600 * 1000;
    const oneHourAgo = Date.now() - oneHourInMillis;

    if (counter >= 10 && lastPlaylistTimestamp >= oneHourAgo) {
      const minutesUntilNextCreation = Math.ceil(
        (lastPlaylistTimestamp - oneHourAgo) / (1000 * 60)
      );
      setTimerPlaylist(minutesUntilNextCreation);
      setCreate(false);
    } else if (lastPlaylistTimestamp < oneHourAgo) {
      localStorage.setItem("availabilityCounter", 0);
      localStorage.setItem("lastPlaylistTimestamp", Date.now());
      setCreate(true);
    }

    const interval = setInterval(() => {
      setTimerPlaylist((prevTimer) => prevTimer - 1);
    }, 60000);

    return () => clearInterval(interval);
  }, [create, timerPlaylist]);

  const handleDiscover = () => {
    if (historyTracks.length == 0) {
      alert(
        "We cannot determine your mood currently because there are no recently played tracks available. Please listen to some tracks on Spotify and return to proceed."
      );
      return;
      
    }
    setLoading(true);
    axios
      .post("https://mood-analyzer.onrender.com/mood", { historyTracks: historyTracks })
      .then((res) => {
        localStorage.setItem("mood", res.data.mood);
        localStorage.setItem("lastDiscoverTimestamp", Date.now());

        setShowDiscoverButton(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("An error occurred. Try again!");
      });
  };

  const handleKeepMood = () => {
    if (localStorage.getItem("availabilityCounter") >= 10) {
      setCreate(false);
      return;
    }
    setLoading(true);
    axios
      .post("https://mood-analyzer.onrender.com/create_playlist", {
        spotifyToken: token,
        mood: mood,
        userID: userId,
        playlistCounter: localStorage.getItem("playlistCounter"),
      })
      .then((res) => {
        let counter = localStorage.getItem("availabilityCounter") || 0;
        counter++;
        localStorage.setItem("availabilityCounter", counter);
        localStorage.setItem("lastPlaylistTimestamp", Date.now());

        let playlistCounter =
          parseInt(localStorage.getItem("playlistCounter")) || 0;
        playlistCounter++;
        localStorage.setItem("playlistCounter", playlistCounter);

        setLoading(false);
        setShowConfirmation(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("An error occurred. Try again!");
      });
  };

  const handleChangeMood = () => {
    setSelect(true);
    setShowConfirmation(false);
  };

  const handleSubmitChangeMood = () => {
    if (!selectedMood) return;
    if (localStorage.getItem("availabilityCounter") >= 10) {
      setCreate(false);
      return;
    }
    setLoading(true);
    axios
      .post("https://mood-analyzer.onrender.com/create_playlist", {
        spotifyToken: token,
        mood: selectedMood,
        userID: userId,
        playlistCounter: localStorage.getItem("playlistCounter"),
      })
      .then((res) => {
        let counter = localStorage.getItem("availabilityCounter") || 0;
        counter++;
        localStorage.setItem("availabilityCounter", counter);
        localStorage.setItem("lastPlaylistTimestamp", Date.now());

        let playlistCounter =
          parseInt(localStorage.getItem("playlistCounter")) || 0;
        playlistCounter++;
        localStorage.setItem("playlistCounter", playlistCounter);

        setSelect(false);
        setShowConfirmation(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("An error occurred. Try again!");
      });
  };

  return (
    <div className="mood-component">
      <p className="mood-title">
        Explore your feelings within the echoes of recent tracks
      </p>
      {loading ? (
        <div className="loading-animation flex">
          <div className="loader"></div>
          <p className="loading-text">Powered by AI</p>
        </div>
      ) : !showDiscoverButton ? (
        <div className="mood-container">
          <p className="mood-text">
            You are{" "}
            <span style={{ fontStyle: "italic", color: "#1ed760" }}>
              {mood}
            </span>
            {" !"}
          </p>
          <p className="discover-timer">
            Please come back in {timerDiscover}{" "}
            {timerDiscover == 1 ? "minute" : "minutes"} to discover your mood
            again!
          </p>
          <p className="mood-info">
            Discover the magic of AI in crafting your personalized playlists!
            Generate up to 10 playlists within a single hour!
          </p>
          {showConfirmation && (
            <div className="flex-column">
              <p className="confirmation-message">
                Playlist successfully created! You can now navigate to the
                library page to view the playlist or open Spotify to start
                listening right away!
              </p>
              <button className="button-mood">
                <Link className="link flex" to="/library">
                  Go to Library
                </Link>
              </button>
            </div>
          )}
          {select ? (
            <div className="mood-select">
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
              >
                <option value="">Select Mood</option>
                <option value="Happy">Happy</option>
                <option value="Melancholic">Melancholic</option>
                <option value="Energetic">Energetic</option>
                <option value="Chill">Chill</option>
                <option value="Romantic">Romantic</option>
                <option value="Nostalgic">Nostalgic</option>
                <option value="Motivational">Motivational</option>
                <option value="Sad">Sad</option>
                <option value="Peaceful">Peaceful</option>
                <option value="Upbeat">Upbeat</option>
                <option value="Dreamy">Dreamy</option>
                <option value="Excited">Excited</option>
                <option value="Angry">Angry</option>
              </select>

              <button className="button-mood" onClick={handleSubmitChangeMood}>
                Create Playlist
              </button>
              <button
                className="button-mood"
                onClick={() => {
                  setSelect(false);
                }}
              >
                Go back
              </button>
            </div>
          ) : (
            <div className="mood-buttons">
              {!showConfirmation && (
                <button className="button-mood" onClick={handleKeepMood}>
                  Keep my mood
                </button>
              )}
              {!showConfirmation && (
                <button className="button-mood" onClick={handleChangeMood}>
                  Change my mood
                </button>
              )}
            </div>
          )}
          {!showConfirmation && !create && (
            <p className="max-playlists-message">
              You've reached the maximum limit of 10 playlists created within
              the last hour. You can create new playlists again in{" "}
              {timerPlaylist} {timerPlaylist == 1 ? "minute" : "minutes"}.
            </p>
          )}
        </div>
      ) : (
        <button className="button-mood" onClick={handleDiscover}>
          Discover
        </button>
      )}
    </div>
  );
};

export default Mood;
