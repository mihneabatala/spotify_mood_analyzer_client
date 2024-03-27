import React from "react";
import "../styles/main.css";
import "../styles/login.css";
import Footer from "./Footer";

const Login = () => {
  const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=975c3e105d5e4932b1c6872bb0f6dc71&response_type=code&redirect_uri=https://spotify-mood.netlify.app/&scope=user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-modify-private playlist-modify-public user-read-recently-played user-read-email user-follow-read user-read-playback-position user-top-read";
  localStorage.setItem("playlistCounter", 1);
  return (
    <div className="login-component">
      <div className="info">
        <h1 className="title">
          Unlock Your Emotions with Spotify Mood Analyzer
        </h1>
        <p className="login-info">
          Log in with your Spotify account to explore the musical journey of
          your feelings
        </p>
      </div>

      <hr className="line" />
      <div className="description">
        <p>
          Uncover the profound connection between music and emotions with the
          Spotify Mood Analyzer! Explore how your recent music selections can
          reveal the soundtrack of your mood. Have you ever thought about which
          mood you've felt the most this week?
        </p>
      </div>
      <div className="login">
        <div className="arrow-down">
          <img
            className="arrow"
            width="120"
            height="120"
            src="https://img.icons8.com/carbon-copy/100/FFFFFF/long-arrow-down.png"
            alt="long-arrow-down"
          />
        </div>
        <a href={AUTH_URL}>
          <button className="login-button">Login with Spotify</button>
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
