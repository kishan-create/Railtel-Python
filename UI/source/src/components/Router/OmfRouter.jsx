import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "../../pages/Login/Login";
// import Signup from "../../pages/Login/SignUp";
import Login from  "../../pages/auth/Login/Login"
import Signup from "../../pages/auth/Login/SignUp"
import Mainblock from "../../pages/Dashboard/Mainblock";
import Databasemain from "../../pages/DatabaseAssessment/database";
import Databasewarehouse from "../../pages/DatabaseWarehouse/Databasewarehouse";
import Adminpage from "../../pages/AdminConfiguration/Adminpage";
import OCIConfig from "../../pages/OCI_Configuration/OCIConfig"
import Datatransfer from "../../pages/DataTransferService/Datatransfer";
import Report from "../../pages/Reports/Report";

const OmfRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Mainblock />} />
        <Route path="/Databasemain" element={<Databasemain />} />
        <Route path ="/Databasewarehouse" element={<Databasewarehouse/>} />
        <Route path="/Adminpage" element={<Adminpage/>}/>
        <Route path="/OCIConfig" element={<OCIConfig/>}/>
        <Route path="/Datatransfer" element={<Datatransfer/>}/>
        <Route path="/Report" element={<Report/>}/>


     
        

      </Routes>
    </Router>
  );
};

export default OmfRouter;
