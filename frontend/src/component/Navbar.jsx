import "../styles/Navbar.css"
import MenuIcon from '@mui/icons-material/Menu';
 import logo from "../assets/logo3.png"; 
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";



export default function Navbar({toggleSidebar}) {

    const [profileOpen, setProfileOpen] = useState(false);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

 

    return (
        <>
       <div className="navbar">

        <div className="navbar-box">
          <div>
            <MenuIcon 
            sx={{
              fontSize:30,
              cursor:"pointer",
              
            }}
            onClick={toggleSidebar}
         />

          </div>

          <div className="pics">
            <img src={logo} alt="logo" className="logo"  style={{ width: "40px", height: "40px" }}/>
            <span>ChatGPT</span>
          </div>

          <div>
            <AccountBoxIcon sx={{
              fontSize:30,
              cursor:"pointer",
              
            }}

             onClick={toggleProfile}
            
            />
           
          </div>
         
          </div>


         <div
          className={`profile-details ${profileOpen ? "open" : ""}`}
        >
          <div className="profile-card">
            <img
              src={logo}
              alt="profile"
              className="profile-pic"
            />
            <div className="profile-info">
              <h4>John Doe</h4>
              <p>john.doe@example.com</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>


          

        </div>

        </>
    )
}

