import React, { useState } from "react"; 
// import SideBar from "../Leftbar/sidemenu";
import Leftsidebar from "../../components/Leftbar/leftmenu";
import Topbar from "../../components/Leftbar/Topbar";
import Administrationright from "./Administration-right";

export default function Adminpage() {

    const [sidebarOpen, setSideBarOpen] = useState(false);
    const handleViewSidebar = () => {
      setSideBarOpen(!sidebarOpen);
 
 
    };

    
    return (
        
     <div>
         <Topbar/>
         <div className="left-block1">
            <Leftsidebar/>
         </div>
        < Administrationright/>
     </div>
    
    
    
    
      );

}