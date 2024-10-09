import React from "react";
import { Dashboard, Diagnosis, Assessment , Configuration,Datatransfer  } from "../../components/images";
import { Sidebar, Menu, MenuItem, SubMenu,  } from "react-pro-sidebar";
import { Outlet, Link } from "react-router-dom";
import { useState} from "react";
// import { makeStyles } from '@material-ui/core/styles';

import { useLocation } from 'react-router-dom';

export default function Leftsidebar() {
 
  const location = useLocation();
   


    
 

 
  const [loading, setLoading] = useState(false);
  const handleLinkClick = (parameter) => {
    
   
   
    // console.log("menuItemId"+menuItemId);
    setLoading(true);
    setTimeout(() => {
      setLoading(false); 
    }, 2000); 
  };

  const currentPath = location.pathname;


  // const classes = useStyles();
    return (
    
    <>
     <div className="left-block">


    
     <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar className="app">
       

        <Menu>
        <div className="main-menu-text">MAIN MENU</div>
          <MenuItem><Link to="/Dashboard"  onClick={() => handleLinkClick('Dashboard')}   style={{ color: currentPath === '/Dashboard' ? 'white' : 'black' }} rel="noreferrer" className=""><div className="left-icon dahboard"><img src={Dashboard} /></div> Dashboard</Link></MenuItem>
   
          <SubMenu label=" Assessment" icon={<img className="left-icon assessment" src={Assessment} style={{ color: (currentPath === '/Databasemain' || currentPath === '/Databasewarehouse')  ? 'white' : 'black' }} />} >
      
            <MenuItem><Link to="/Databasemain" onClick={() => handleLinkClick('Databasemain')} rel="noreferrer"  style={{ color: currentPath === '/Databasemain' ? 'white' : 'black' }}>Database Assessment</Link> </MenuItem>
            <MenuItem><Link to="/Databasewarehouse" onClick={() => handleLinkClick('Databasewarehouse')}  rel="noreferrer"  style={{ color: currentPath === '/Databasewarehouse' ? 'white' : 'black' }}> Data Warehouse </Link></MenuItem>
          </SubMenu>
          <SubMenu label="Configuration"   icon={<img className="left-icon configuration" src={Configuration} />}>
            <MenuItem><Link to="/Adminpage" onClick={() => handleLinkClick('Adminpage')}  style={{ color: currentPath === '/Adminpage' ? 'white' : 'black' }} rel="noreferrer" >Administration page </Link></MenuItem>
            <MenuItem><Link to='/OCIConfig' onClick={() => handleLinkClick('OCIConfig')}  style={{ color: currentPath === '/OCIConfig' ? 'white' : 'black' }} rel="noreferrer">OCI Configuration </Link></MenuItem>
          </SubMenu>
          <MenuItem ><Link to="/Datatransfer" onClick={() => handleLinkClick('Datatransfer')}  style={{ color: currentPath === '/Datatransfer' ? 'white' : 'black' }} rel="noreferrer"><div className="left-icon data"><img src={Datatransfer} /></div> Data Transfer Service </Link></MenuItem>


          <MenuItem><Link to="/Report" onClick={() => handleLinkClick('Report')}  rel="noreferrer" style={{ color: currentPath === '/Report' ? 'white' : 'black' }}><div className="left-icon diagnosis"><img src={Diagnosis } /></div> Diagnosis Reports </Link></MenuItem>
        </Menu>
      </Sidebar>
     
    
    </div>
    
    </div>
    <Outlet />
    </>
      );

}