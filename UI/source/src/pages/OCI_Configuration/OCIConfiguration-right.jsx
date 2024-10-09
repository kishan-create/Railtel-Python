import React from "react";
import { Link } from "react-router-dom";
import OCIConfiguration from "./OCIConfiguration";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
 
export default function OCIConfigurationright() {



    return (
     <div className="right-block">


<OCIConfiguration/>

<div className="back-to-dashboard">
<Link to="/Dashboard"  rel="noreferrer"> <NavigateBeforeIcon className="backarrow"/> <span>Back to Dashboard</span></Link>

</div>
     </div>
    
    
    
    
    
      );

}