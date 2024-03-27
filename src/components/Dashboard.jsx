import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuth from "../auth/useAuth";
import Navbar from "./Navbar";
import Home from "./Home";
import Library from "./Library";
import Footer from "./Footer";


const Dashboard = ({ code }) => {
  const { accessToken, logout } = useAuth(code);
  return (
    <Router>
      <Navbar token={accessToken} logout={logout} />
      <Routes>
        <Route path="/" element={<Home token={accessToken} />} />
        <Route path="/library" element={<Library token={accessToken} />} />
      </Routes>
      <Footer/>
    </Router>
  );
};
export default Dashboard;
