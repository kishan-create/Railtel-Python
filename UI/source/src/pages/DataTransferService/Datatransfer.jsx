import React, { useState } from "react"; 
import SideBar from "../../components/Leftbar/sidemenu"
import Topbar from "../../components/Leftbar/Topbar"
import Datatransferright from "./Datatransfer-right"

export default function Datatransfer() {

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
        < Datatransferright/>
     </div>
    
    
    
    
      );

}