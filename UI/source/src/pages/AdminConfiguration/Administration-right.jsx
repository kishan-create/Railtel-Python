import React from "react";

import Administration from "../AdminConfiguration/Administration";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Link } from "react-router-dom";
 
export default function Administrationright() {



    return (
     <div className="right-block">


<Administration/>

<div className="back-to-dashboard">
<Link to="/Dashboard"  rel="noreferrer"> <NavigateBeforeIcon className="backarrow"/> <span>Back to Dashboard</span></Link>

</div>
     </div>
    
    
    
    
    
      );

}