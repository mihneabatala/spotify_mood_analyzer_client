import React, { useState, useEffect } from "react";
import "../styles/history.css";

const History = ({ historyTracks }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="history-component">
      <p className="history-title">Recently Played Tracks</p>
      {windowWidth < 481 && (
        <p
          style={{
            color: "white",
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Scroll down to discover your mood!
        </p>
      )}
      <hr className="line" />
      {historyTracks.length == 0 ? (
        <p className="history-tracks-empty">
          No tracks available. Please listen to some tracks on Spotify.
        </p>
      ) : (
        <div className="tracks-container">
          {historyTracks.map((track, index) => (
            <div className="track" key={index}>
              <img src={track.imgURL} alt="Track image" />
              <div>
                <p>{track.title}</p>
                <p>{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
