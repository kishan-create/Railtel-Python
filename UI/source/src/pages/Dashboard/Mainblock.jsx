import React from "react";
import Leftsidebar from "../../components/Leftbar/leftmenu";
import Rightcontent from "./Rightcontent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Topbar from "../../components/Leftbar/Topbar";

export default function Mainblock() {

    const [validToken, setValidToken] = useState(true);
    const [token , setToken] =  useState('')
    const navigate = useNavigate();

    // Check token status when the component mounts
    useEffect(() => {
      const token = sessionStorage.getItem('token');
      setToken(token)
      if (!token ) {
        setValidToken(false);
      }
    }, []);
  
    // Render the dashboard content if token is valid, otherwise redirect to login
    if (!validToken) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Session time out",
      });
        navigate('/', {replace: true});
          
    }



    return (
        
     <div>
         <Topbar token={token}/>
        <Leftsidebar/>
        <Rightcontent/>
     </div>
    
    
    
    
      );

}