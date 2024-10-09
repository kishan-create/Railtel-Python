import React from "react";

import Datatransferservice from "./Datatransferservice";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
 import { Link } from "react-router-dom";
export default function Datatransferright() {



    return (
     <div className="right-block">


<Datatransferservice/>

<div className="back-to-dashboard">
<Link to="/Dashboard"  rel="noreferrer"> <NavigateBeforeIcon className="backarrow"/> <span>Back to Dashboard</span></Link>


</div>
     </div>
    
    
    
    
    
      );

}