import React from "react";

import Dataassessment from "./Datassessment";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Outlet , Link} from "react-router-dom";
export default function DatabaseRightcontent() {
  



    return (
     <>
     <div className="right-block">

 
<Dataassessment/>
<div className="back-to-dashboard">
<Link to="/Dashboard"  rel="noreferrer"> <NavigateBeforeIcon className="backarrow"/> <span>Back to Dashboard</span></Link>
</div>

     </div>
<Outlet/>
</>
    
    
    
    
    
      );

}