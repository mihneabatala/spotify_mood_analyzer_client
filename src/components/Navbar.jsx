import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.css";
import logo from "/images/spotify_logo.png";

const Navbar = ({ token, logout }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setName(res.data.display_name);
        localStorage.setItem("id", res.data.id);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        e.target.closest(".toggle-btn") === null
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const toggleDropDownMenu = () => {
    console.log(showDropdown);
    setShowDropdown(!showDropdown);
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      <header>
        <div className="user-info">
          {<img className="user-img" src={logo} alt="Spotify Logo" />}
          <p className="user-name">Welcome {name}👋</p>
        </div>

        <nav className="navbar">
          <ul className="list">
            <li className="list-item">
              <Link className="link" to="/">
                Home
              </Link>
            </li>
            <li className="list-item">
              <Link className="link" to="/library">
                Library
              </Link>
            </li>
          </ul>
        </nav>

        <div className="logout">
          <button className="logout-button" onClick={logout}>
            Log out
          </button>
        </div>

        <div className="toggle-btn">
          {!showDropdown ? (
            <FontAwesomeIcon
              className="icon"
              icon={faBars}
              onClick={toggleDropDownMenu}
            />
          ) : (
            <FontAwesomeIcon
              className="icon"
              icon={faXmark}
              onClick={toggleDropDownMenu}
            />
          )}
        </div>
        {showDropdown && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <ul className="list">
              <li>
                <Link className="link" to="/" onClick={toggleDropDownMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="link"
                  to="/library"
                  onClick={toggleDropDownMenu}
                >
                  Library
                </Link>
              </li>
              <li onClick={logout} style={{ color: "white", fontSize: 15 }}>
                Log out
              </li>
            </ul>
          </div>
        )}
      </header>
      <hr className="line" style={{ margin: 0 }} />
    </>
  );
};
export default Navbar;
