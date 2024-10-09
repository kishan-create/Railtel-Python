import React from "react";

import Dataassessment from "../DatabaseAssessment/Datassessment";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Dataassessmentwarehouse from "./Databasewarehouseassessment";
import { Outlet , Link} from "react-router-dom";

 
export default function Datawarehouseright() {



    return (
     <>
     <div className="right-block">


<Dataassessmentwarehouse/>

<div className="back-to-dashboard">
<Link to="/Dashboard"  rel="noreferrer"> <NavigateBeforeIcon className="backarrow"/> <span>Back to Dashboard</span></Link>

</div>
     </div>
<Outlet/>
</>
    
    
    
    
    
      );

}