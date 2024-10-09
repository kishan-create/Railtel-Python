import React from "react";
import {Message, Notification, Profile  } from "../images";
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';

import FadeMenu from "./Profiledrop";
import {logo  } from "../images";
export default function Topbar(token) {
  console.log(token );

 return (
     <div className="top-bar-outer">
       <img src={logo}  className="top-left-logonew"/><div className="welcome-text"> Welcome Back!</div>
       <div className="top-right-block">
         <div className="search-outer">
         <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
       <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search anything "
        inputProps={{ 'aria-label': 'Search anything ' }}
      />

       </div>
       <div className="message-icon-left-br">
       <div className="message-icon">
       <img src={Message} />
       </div>
       </div>
       <div className="notificatio-icon">
       <img src={Notification} />
       <Badge color="secondary" badgeContent={1} max={999}></Badge>
       </div>
       <div className="profile-drop-down">
       <img src={Profile} className="profile-image" />
       <FadeMenu token={token}/>
       </div>
     </div>
    
     </div>
    
    
    
      );

}