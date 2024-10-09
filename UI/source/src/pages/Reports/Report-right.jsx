import React from "react";
import { Link } from "react-router-dom";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'; 
 import ReportOMF from "./ReportOMF";

 

 
export default function Reportright() {



    return (
     <div className="right-block">


<ReportOMF/>

<div className="back-to-dashboard">
<Link to="/Dashboard"  rel="noreferrer"> <NavigateBeforeIcon className="backarrow"/> <span>Back to Dashboard</span></Link>

</div>
     </div>
    
    
    
    
    
      );

}