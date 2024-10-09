import React, { useState } from "react"; 
import SideBar from "../../components/Leftbar/sidemenu";
import Topbar from "../../components/Leftbar/Topbar";
import Reportright from "./Report-right"

export default function Report() {

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
        < Reportright/>
     </div>
    
    
    
    
      );

}