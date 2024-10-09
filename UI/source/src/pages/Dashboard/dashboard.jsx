import React from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import {Graph, Load, Check1, Check2, Check3, Check4} from "../../components/images";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add'; 
export default function Dahboardmain() {



    return (
     <div className="assessment-main-outer">
<div className="assessment-top-main">
    <div className="text-block">Today <KeyboardArrowDownIcon className="arrow"/></div>
    <div className="border-top"> </div>
  
</div>

<div className="grid-colmn-2 ">
        <div className=" ">
            <div className="dashbrd-subhead ">Overall progress</div>
            <div className="overall-box"> 
                <div className="overall-top-arrow"> 
                        <ArrowOutwardIcon className="overall-top-arrow-icon "/>
                </div>
                <div className="inner-grid-colmn-2">
                    <div>
                        <img src={Graph}  className="overall-graph-img"/>
                    </div>
                    <div className="m-t-10">
                        <div className="overall-Field-rgt-txt">
                            <span className="overall-Field-1"></span>Field 1 
                            <span className="overall-Field-span">38.6%</span>
                        </div>
                        <div className="overall-Field-rgt-txt">
                            <span className="overall-Field-2"></span>Field 2 
                            <span className="overall-Field-span">22.5%</span>
                        </div>
                        <div className="overall-Field-rgt-txt">
                            <span className="overall-Field-3"></span>Field 3 
                            <span className="overall-Field-span">30.8%</span>
                        </div>
                        <div className="overall-Field-rgt-txt">
                            <span className="overall-Field-4"></span>Field 4 
                            <span className="overall-Field-span">8.1%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className=" ">
            <div className="dashbrd-subhead ">
                <span className="today-head">Today </span> 
                <span  className=" load"><img src={Load}/></span>
                <span className="today-head-sub">In Progress <span className="today-blue-box">2</span></span>
            </div>
            <div className=" today-box ">
                <ul>
                    <li className="today-box-inner-box">
                        <AddIcon className="add-plus"/><div> Add New DataOps <ArrowForwardIosIcon className="today-box-right-arrow"/></div>   
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check1} className="today-check-sty"/><div> Explore data trends for insights <span className="inprograss-box">In Progress</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check2} className="today-check-sty"/><div> Configure cloud environment settings   <span className="pending-box">Pending</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check3} className="today-check-sty"/><div> Run data diagnosis report  <span className="complete-box">Complete</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check3} className="today-check-sty"/><div> Database properties assessment <span className="complete-box">Complete</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                </ul>
            </div>
        </div>
        <div className=" ">
            <div className="dashbrd-subhead ">
                <span className="today-head">This week </span> 
                <span  className=" load"><img src={Load}/></span>
                <span className="today-head-sub">In Progress <span className="today-blue-box">2</span></span>
            </div>
            <div className=" today-box ">
            <ul>
                    <li className="today-box-inner-box">
                        <AddIcon className="add-plus"/><div> Add New DataOps <ArrowForwardIosIcon className="today-box-right-arrow"/></div>   
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check1} className="today-check-sty"/><div> Evaluate data migration strategies <span className="inprograss-box">In Progress</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check2} className="today-check-sty"/><div> Implement data object migration plan   <span className="pending-box">Pending</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check3} className="today-check-sty"/><div> Data compliance audit scheduled  <span className="complete-box">Complete</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check3} className="today-check-sty"/><div> Schedule cloud environment review  <span className="complete-box">Complete</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check4} className="today-check-sty"/><div> Generate data operations report <span className="approved-box">Approved</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                </ul>
            </div>
        </div>
        <div className=" ">
            <div className="dashbrd-subhead ">
                <span className="today-head">Today </span> 
                <span  className=" load"><img src={Load}/></span>
                <span className="today-head-sub">In Progress <span className="today-blue-box">2</span></span>
            </div>
            <div className=" today-box ">
            <ul>
                    <li className="today-box-inner-box">
                        <AddIcon className="add-plus"/><div> Add New DataOps <ArrowForwardIosIcon className="today-box-right-arrow"/></div>   
                    </li>
                    <li className="today-box-inner-box"> 
                        <img src={Check1} className="today-check-sty"/><div> Optimize SQL queries for performance <span className="inprograss-box">In Progress</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                     
                    <li className="today-box-inner-box"> 
                        <img src={Check4} className="today-check-sty"/><div> Request data visualization assets <span className="approved-box">Approved</span> <ArrowForwardIosIcon className="today-box-right-arrow"/></div> 
                    </li>
                </ul>
            </div>
        </div>
</div>
     </div>
     
    
      );

}