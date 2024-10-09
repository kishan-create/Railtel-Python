import React from "react"; 
// import SideBar from "../Leftbar/sidemenu";
import Leftsidebar from "../../components/Leftbar/leftmenu";
import Topbar from "../../components/Leftbar/Topbar";
import Datawarehouseright from "./Datawarehouse-right";

export default function Databasewarehouse() {

   //  const [sidebarOpen, setSideBarOpen] = useState(false);
   //  const handleViewSidebar = () => {
   //    setSideBarOpen(!sidebarOpen);
 
 
   //  };

    
    return (
        
   //   <div>
   //       <Topbar/>
   //       {/* <div className="left-block1"> */}
   //          <Leftsidebar  />
   //       {/* </div> */}
   //      {/* < Datawarehouseright/> */}
   //   </div>
     <div>
     <Topbar />
    <Leftsidebar/>
    <Datawarehouseright/>
 </div>
    
    
    
    
      );

}