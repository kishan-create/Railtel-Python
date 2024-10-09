import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Outlet, Link } from "react-router-dom";
import zIndex from "@mui/material/styles/zIndex";
import Swal from "sweetalert2";


export default function FadeMenu() {
  const [dropdownState, setDropdownState] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");

  const handleDropdownClick = () => {
    setDropdownState(!dropdownState);
  };
  const handleSetDropdownValue = (value) => {
    setDropdownValue(value);
    setDropdownState(!dropdownState);
  };
  const handleClick = () => {
    sessionStorage.removeItem('token');
    Swal.fire({
      position: "centre",
      icon: "success",
      title: "logged out Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="container">
      <div className={`dropdown`}>
        <button onClick={handleDropdownClick} className="dropdown-btn">
          {dropdownValue === "" ? "Profile" : dropdownValue}
          <KeyboardArrowDownIcon className="drop-arrow" />
        </button>
        <div style={{ zIndex: '1' }}
          className={`dropdown-items ${dropdownState ? "isVisible" : "isHidden"
            }`}
        >
          <div  className="dropdown-item " >
          <Link to="/" onClick={handleClick} >
            <div
              className="dropdown__link "
              onClick={() => handleSetDropdownValue("Profile")}
            >

             Logout



            </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}


