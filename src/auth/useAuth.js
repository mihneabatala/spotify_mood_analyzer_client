import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post("https://mood-analyzer.onrender.com/login", {
        code: code,
      })
      .then((res) => {
        setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
        window.history.replaceState({}, null, "/");
      })
      .catch((err) => {
        alert("An error occurred. Redirecting to the homepage.");
        window.location.assign("/");
        console.log(err);
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("https://mood-analyzer.onrender.com/refresh", {
          refreshToken: refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.access_token);
          setExpiresIn(res.data.expires_in);
        })
        .catch((err) => {
          alert("An error occurred. Redirecting to the homepage.");
          window.location.assign("/");
          console.log(err);
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
    window.location.assign("/");
  };

  return { accessToken, logout };
}
