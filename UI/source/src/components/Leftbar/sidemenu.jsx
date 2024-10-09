import React from "react";
import Leftsidebar from "./leftmenu"; 

const SideBar = props => {
  const sidebarClass = props.isOpen ? "sidebar open" : "sidebar";
  return (
    <div>
    <div className={sidebarClass}>
    <Leftsidebar toggleSidebar={props.toggleSidebar} />
      
      
    </div>
    
    </div>
  );
};
export default SideBar;
