// import React from "react";


import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput'
import Button from '@mui/material/Button';

import DoneIcon from '@mui/icons-material/Done';
import DataTable from "./Databasetable";
import DataTablenew from "./Databasetablnew";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
export default function Administration() {

  const [validToken, setValidToken] = useState(true);
  const [token, setToken] = useState('');
  const [data, setData] = useState(false);
  const [formData, setFormData] = useState({
    oci_endpoint: "",
    tenancy_id: "",
    user_ocid: "",
    private_key: "",
    oci_region: "",
    fingure_print: "",
   
  })
  const [formErrors, setFormErrors] = useState({
    oci_endpoint: "",
    tenancy_id: "",
    user_ocid: "",
    private_key: "",
    oci_region: "",
    fingure_print: "",

  });
const navigate = useNavigate();

// test connection
useEffect(() => {
  const token = sessionStorage.getItem('token');
  setToken(token)
  if (!token) {
    setValidToken(false);
  }
}, []);
  // get and display data on loading



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiUrl = `${global.config.APIROOTURL}/api/ociadministration`;

 

    const token = sessionStorage.getItem('token');

    await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // adjust Content-Type as needed
      }
    }).then(response => {

      setFormData(response.data);
     
    
      setData(true);
    })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Oops..",
            text: "Login Session Time Out",
          });
          navigate('/');

        } else {
       
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });;
      });



  };
  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation
    let errors = {};
    if (!formData.oci_endpoint) {

      errors.oci_endpointError = 'oci_endpoint is required';
    }
    if (!formData.tenancy_id) {
      errors.tenancy_idError = 'tenancy_id  is required';
    }
    if (!formData.user_ocid) {
      errors.user_ocidError = 'user_ocid Id is required';
    }
    if (!formData.private_key) {
      errors.private_keyError = 'private_key is required';
    }
    if (!formData.oci_region) {
      errors.oci_regionError = 'oci_region is required';
    }
    if (!formData.fingure_print) {
      errors.fingure_printError = 'Fingure_print is required';
    }
    
   
    

    // If there are errors, set them and prevent form submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      // If no errors, proceed with form submission
      // Here you can send the form data to your server or perform any other action
      setFormErrors({ 
        oci_endpoint: "",
        tenancy_id: "",
        user_ocid: "",
        private_key: "",
        oci_region: "",
        fingure_print: "",
    });
      // delete formData.confirm_password;
      SubmitFormValues(formData);


    }
  };
  const SubmitFormValues = async (formData)=>{
    if (data === true) {
      try {
        const response = await axios.put(
          `${global.config.APIROOTURL}/api/ociadministration`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          Swal.fire({
            position: "centre",
          icon: "success",
          title: "Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
          });
        }
  
        
        // Handle success
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    
         
  
      
  
    } 
    else {
      try {
        const response = await axios.post(
          `${global.config.APIROOTURL}/api/ociadministrationx`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          Swal.fire({
            position: "centre",
            icon: "success",
            title: "Saved Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
  
        
        // Handle success
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
        // Handle error - check error.response for more details
      }
    }
  
  }
    return (
        <div>

     <div className="assessment-main-outer admin-box-small">
<div className="main-text-head">Administration page</div>
<div className="data-setion-box-block fourblock-grid">

<Box sx={{ flexGrow: 1 }}>
    <div className="admin-sub-head">OCI connection details</div>
      <Grid container spacing={2}>
        <Grid item xs={6} md={2.4} className="small-box">
       
          <FormControl className="input-outer">
                <label>OCI EndPoint</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.oci_endpoint} name="oci_endpoint" onChange={handleChange} />
                    {formErrors.oci_endpointError && <span  className="red-alert">{formErrors.oci_endpointError}</span>}
              </FormControl>
         
        </Grid>
        <Grid item xs={6} md={2.4}  className="small-box">
        <FormControl className="input-outer">
                <label>Tenancy OCID</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.tenancy_id} name="tenancy_id" onChange={handleChange} />
                    {formErrors.tenancy_idError && <span  className="red-alert">{formErrors.tenancy_idError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="small-box">
        <FormControl className="input-outer">
                <label>User OCID</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.user_ocid} name="user_ocid" onChange={handleChange} />
                    {formErrors.user_ocidError && <span  className="red-alert">{formErrors.user_ocidError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="small-box">
        <FormControl className="input-outer">
                <label>Private Key</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.private_key} name="private_key" onChange={handleChange} />
                    {formErrors.private_keyError && <span  className="red-alert">{formErrors.private_keyError}</span>}
              </FormControl>
        </Grid>  
           <Grid item xs={6} md={2.4}  className="small-box">
           <FormControl className="input-outer">
                <label>OCI Region</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.oci_region} name="oci_region" onChange={handleChange} />
                    {formErrors.oci_regionError && <span  className="red-alert">{formErrors.oci_regionError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>Finger print</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.fingure_print} name="fingure_print" onChange={handleChange} />
                    {formErrors.fingure_printError && <span  className="red-alert">{formErrors.fingure_printError}</span>}
              </FormControl>
        </Grid>
         
        <Grid item xs={6} md={2.4}  className="small-box">
        <Button variant="contained" className="data-download upload-btn">
        
<svg width="12" height="16" className="download-arrow" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.00001 16C6.2143 16 6.38962 15.8188 6.38962 15.5974L6.38962 5.53247L10.7299 9.45779C10.8935 9.60273 11.139 9.58663 11.2792 9.42156C11.4195 9.25247 11.4039 8.99883 11.2442 8.8539L6.25715 4.34481C6.19092 4.28442 6.10131 4.24416 6.0078 4.24416C6.0078 4.24416 6.0078 4.24416 6.00391 4.24416L6.00001 4.24416C5.90261 4.24416 5.81689 4.28442 5.75066 4.34481L0.763647 8.8539C0.600011 8.99883 0.584427 9.2565 0.728583 9.42156C0.868843 9.59065 1.11819 9.60676 1.27793 9.4578L5.61819 5.53247L5.61819 15.5974C5.61819 15.8188 5.79352 16 6.0078 16L6.00001 16Z" fill="black"/>
<path d="M12 0.781973C12 0.560544 11.8247 0.379376 11.6104 0.379376L0.38961 0.379377C0.175324 0.379377 -5.45541e-08 0.560545 -3.51962e-08 0.781974C-1.58383e-08 1.0034 0.175324 1.18457 0.38961 1.18457L11.6104 1.18457C11.8247 1.18457 12 1.0034 12 0.781973Z" fill="black"/>
</svg>

Upload</Button>
        </Grid>
      </Grid>
    </Box><div className="data-button-section">
 
    <Button variant="contained" className="common-default-button blue-button"  onClick={handleSubmit} >Submit</Button>
     

    </div>
</div>
 

     </div>
    
    
    </div>
    
    
      );

}