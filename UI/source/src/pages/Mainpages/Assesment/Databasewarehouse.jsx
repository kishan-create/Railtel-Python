import React, { useState } from "react"; 
import SideBar from "../Leftbar/sidemenu";
import Leftsidebar from "../Leftbar/leftmenu";
import Topbar from "../Leftbar/Topbar";
import Datawarehouseright from "../RightBlock/Datawarehouse-right";

export default function Databasewarehouse() {

    const [sidebarOpen, setSideBarOpen] = useState(false);
    const handleViewSidebar = () => {
      setSideBarOpen(!sidebarOpen);
 
 
    };

    
    return (
        
     <div>
         <Topbar/>
         <div className="left-block1">
            <SideBar isOpen={sidebarOpen} toggleSidebar={handleViewSidebar} />
         </div>
        < Datawarehouseright/>
     </div>
    
    
    
    
      );

}