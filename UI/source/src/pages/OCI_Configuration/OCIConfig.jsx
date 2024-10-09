import React, { useState } from "react"; 
// import SideBar from "../Leftbar/sidemenu";
import Leftsidebar from "../../components/Leftbar/leftmenu";
import Topbar from "../../components/Leftbar/Topbar";
import OCIConfigurationright from "./OCIConfiguration-right";

export default function OCIConfig() {

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
        < OCIConfigurationright/>
     </div>
    
    
    
    
      );

}