
import React, { useState, useEffect } from "react";
import "../styles/Auth.css";
import logo from "../assets/logo3.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../features/auth/authSlice";
import { Typography } from "@mui/material";

export default function Authentication() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, message, loggedIn, token } = useSelector((state) => state.auth);

  const [formState, setFormState] = useState(0); // 0 = Login, 1 = Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // ---------------- Toggle between Login / Sign Up
  const toggleForm = () => {
    if (!loggedIn) setFormState(formState === 0 ? 1 : 0);
  };

  // ---------------- Redirect if logged in
  useEffect(() => {
    if (loggedIn) navigate("/home");
  }, [loggedIn, navigate]);

  // ---------------- Redirect if token missing
  useEffect(() => {
    if (!token) navigate("/"); // go to login page
  }, [token, navigate]);

  // ---------------- Handle Login / Register
  const handleAuth = () => {
    if (formState === 0) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ username, email, password })).then(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        toggleForm(); // show login after signup
      });
    }
  };

  return (
    <div className="main">
      <div className="auth-box">
        {/* ---------- Logo + Heading ---------- */}
        <div className="content">
          <img src={logo} alt="logo" />
          <div className="heading">
            <h2>{formState === 0 ? "Sign In" : "Sign Up"}</h2>
          </div>
        </div>

        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="primary">{message}</Typography>}

        {/* ---------- Form ---------- */}
        <div className="form">
          {formState === 1 && (
            <div>
              <span className="log-cont">Username:</span>
              <input
                className="input"
                type="text"
                placeholder="Type your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div>
            <span className="log-cont">Email:</span>
            <input
              className="input"
              type="email"
              placeholder="Type your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <span className="log-cont">Password:</span>
            <input
              className="input"
              type="password"
              placeholder="Type your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
          <button className="submit-btn" onClick={handleAuth}>
            {formState === 0 ? "Sign In" : "Sign Up"}
          </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <span
              style={{ color: "#fff", cursor: "pointer", fontSize: "0.9rem" }}
              onClick={toggleForm}
            >
              {formState === 0
                ? "Don’t have an account? Sign Up"
                : "Already have an account? Sign In"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
