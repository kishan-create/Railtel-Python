import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useState , useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function ReportOMF() {
const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    uniqueId: "",
    last: ""
  });
  const checkToken = async () =>{
    const token = sessionStorage.getItem("token");
    if (!token){
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: "Session time out ",
      });
    navigate('/');
    }
    else{
    const apiUrl = `${global.config.APIROOTURL}/api/report/runner`;
  const token = sessionStorage.getItem('token');

    try {
      const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }});
      if (response.status===200) {
 const tokenFromHeader = response.data.id
      
        sessionStorage.setItem("uniqueId", tokenFromHeader);
        setFormData({
          uniqueId : tokenFromHeader
        })

      } 
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: error.message,
      });
    }

    }


  }
  useEffect(() => {
    checkToken();

  }, []);
    
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const generateReport = async () => {
    const apiUrl = `${global.config.APIROOTURL}/api/report/${selectedOption}`;
    const token = sessionStorage.getItem("token");
   
    try {
      // Send API request with selected option
      const response = await axios.post(apiUrl, formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // adjust Content-Type as needed
          },
        });
      if (response.status === 200) {
        const sampleResponse = response.data
        let csvContent = 'data:text/csv;charset=utf-8,';

        // Add header to CSV content
        csvContent += 'Value\n';
    
        // Check if sampleResponse is a single value
        if (typeof sampleResponse !== 'object') {
          // Format single value as a row and add it to CSV content
          const row = `${sampleResponse}\n`;
          csvContent += row;
        } else {
          console.error('Sample response is not a single value');
          return;
        }
    
        // Create Blob object
        const blob = new Blob([csvContent], { type: 'text/csv' });
    
        // Create download link
        const downloadLink = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = `${selectedOption}_report.csv`;
        // Set the file name
    
        // Trigger download
        link.click();
    
        // Cleanup
        URL.revokeObjectURL(downloadLink);
      }
    
      // Assuming the API returns the URL of the generated report
    }  catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: "Session time out ",
        });

      }
      else if (error.response && error.response.status === 404) {
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: error.message,
        });
      }
    }
  };


    return (
        <div>

     <div className="assessment-main-outer">
<div className="main-text-head">Report</div>
<div className="data-setion-box-block">
<FormControl>
      
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <div className="report-radio-col">
            <div>
            <FormControlLabel value="audit" name='audit' onChange={handleOptionChange} control={<Radio />} label="Audit" />
            </div>
            <div>
            <FormControlLabel value="Instance" name='Instance' onChange={handleOptionChange} control={<Radio />} label="Instance" />
            </div>
            <div>
            <FormControlLabel value="Billing" name='Billing' onChange={handleOptionChange} control={<Radio />} label="Billing" />
            </div>
            <div>
            <FormControlLabel value="vmdetails" name='vmdetails' onChange={handleOptionChange} control={<Radio />} label="VM Details" />
            </div>
            <div>
            <FormControlLabel value="CMDB" name='CMDB' onChange={handleOptionChange} control={<Radio />} label="CMDB" />
            </div>
            <div>
            <FormControlLabel value="routetable" name='routetable' onChange={handleOptionChange} control={<Radio />} label="Route Table" />
            </div>
            <div>
            <FormControlLabel value="osbreakdown" name='osbreakdown' onChange={handleOptionChange} control={<Radio />} label="OS_Breakdown" />
            </div>
            <div>
            <FormControlLabel value="Tagging" name='Tagging'onChange={handleOptionChange} control={<Radio />} label="Tagging" />
            </div>
           
        
        </div>
      </RadioGroup>
    </FormControl>

    <Button variant="contained" className="common-default-button blue-button generate-reportbtn"  onClick={generateReport}>Generate Report </Button>
     
</div>
 
</div>


     </div>
    
    
    
    
    
      );

}