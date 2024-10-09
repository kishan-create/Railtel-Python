

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

export default function OCIConfiguration() {
const navigate = useNavigate();

  const [validToken, setValidToken] = useState(true);
  const [token, setToken] = useState('');
  const [data, setData] = useState(false);
  const [formData, setFormData] = useState({
    availability_domain: "",
    backup_policy: "",
    boot_volume_size: "",
    preserve_boot_volume: "",
    compartment_name:"",
    load_balancer_timeout: "",
    client_prefix: "",
    vcn_cidr: "",
    vcn_sub_cidr: "",
    mgmt_sub_cidr: "",
    ssh_pub_key_1:"",
    ssh_pub_key_2: "",
    db_system_size: "",
    db_system_count: "",
    db_edition: "",
    db_version:"",
    db_host_user_name: "",


    creator_name: "",
    update_date: "",
    updated_by: "",
    updater_name:"",
    
    
   
  })
  const [formErrors, setFormErrors] = useState({
    availability_domain: "",
    backup_policy: "",
    boot_volume_size: "",
    preserve_boot_volume: "",
    compartment_name:"",
    load_balancer_timeout: "",
    client_prefix: "",
    vcn_cidr: "",
    vcn_sub_cidr: "",
    mgmt_sub_cidr: "",
    ssh_pub_key_1:"",
    ssh_pub_key_2: "",
    db_system_size: "",
    db_system_count: "",
    db_edition: "",
    db_version:"",
    db_host_user_name: "",
  });
// test connection
useEffect(() => {
  const token = sessionStorage.getItem('token');
  setToken(token)
  if (!token) {
    setValidToken(false);
  }
}, []);
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  const apiUrl = `${global.config.APIROOTURL}/api/ociconfiguration`;



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
        // Handle other errors (e.g., network errors, 404 Not Found)
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
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
  if (!formData.availability_domain) {

    errors.availability_domainError = 'availability_domain is required';
  }
  if (!formData.backup_policy) {
    errors.backup_policyError = 'backup_policy  is required';
  }
  if (!formData.boot_volume_size) {
    errors.boot_volume_sizeError = 'boot_volume_size is required';
  }
  if (!formData.preserve_boot_volume) {
    errors.preserve_boot_volumeError = 'preserve_boot_volume is required';
  }
  if (!formData.compartment_name) {
    errors.compartment_nameError = 'compartment_name is required';
  }
  if (!formData.load_balancer_timeout) {
    errors.load_balancer_timeoutError = 'load_balancer_timeout is required';
  }

  if (!formData.client_prefix) {
    errors.client_prefixError = 'client_prefix is required';
  }
  if (!formData.vcn_cidr) {
    errors.vcn_cidrError = 'vcn_cidr is required';
  }
  if (!formData.vcn_sub_cidr) {
    errors.vcn_sub_cidrError = 'vcn_sub_cidr is required';
  }
  if (!formData.mgmt_sub_cidr) {
    errors.mgmt_sub_cidrError = 'mgmt_sub_cidr is required';
  }

  if (!formData.ssh_pub_key_1) {
    errors.ssh_pub_key_1Error = 'ssh_pub_key_1 is required';
  }
  if (!formData.ssh_pub_key_2) {
    errors.ssh_pub_key_2Error = 'ssh_pub_key_2 is required';
  }
  if (!formData.db_system_size) {
    errors.db_system_sizeError = 'db_system_size is required';
  }
  if (!formData.db_system_count) {
    errors.db_system_countError = 'db_system_count is required';
  } 
  
  if (!formData.db_edition) {
    errors.db_editionError = 'db_edition is required';
  }
  if (!formData.db_version) {
    errors.db_versionError = 'db_version is required';
  }
  if (!formData.db_host_user_name) {
    errors.db_host_user_nameError = 'db_host_user_name is required';
  }
  
  

  // If there are errors, set them and prevent form submission
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
  } else {
    // If no errors, proceed with form submission
    // Here you can send the form data to your server or perform any other action
    setFormErrors({ 
      availability_domain: "",
      backup_policy: "",
      boot_volume_size: "",
      preserve_boot_volume: "",
      compartment_name:"",
      load_balancer_timeout: "",
      client_prefix: "",
      vcn_cidr: "",
      vcn_sub_cidr: "",
      mgmt_sub_cidr: "",
      ssh_pub_key_1:"",
      ssh_pub_key_2: "",
      db_system_size: "",
      db_system_count: "",
      db_edition: "",
      db_version:"",
      db_host_user_name: "",
  });
    // delete formData.confirm_password;
    SubmitFormValues(formData);


  }
};
const SubmitFormValues = async (formData)=>{
  if (data === true) {
    try {
      const response = await axios.put(
        `${global.config.APIROOTURL}/api/ociconfiguration`,
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
      // Handle error - check error.response for more details
    }
  
       

    

  } 
  else {
    try {
      const response = await axios.post(
        `${global.config.APIROOTURL}/api/ociconfiguration`,
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
  // get and display data on loading


    return (
        <div>

     <div className="assessment-main-outer ">
<div className="main-text-head">OCI Configuration</div>
<div className="data-setion-box-block  ">

<Box sx={{ flexGrow: 1 }}>
    <div className="admin-sub-head">OCI connection details</div>
      <Grid container spacing={2}>
        <Grid item xs={6} md={2.4} className="small-box">
       
          <FormControl className="input-outer">
                <label>Availability Domain</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.availability_domain} name="availability_domain" onChange={handleChange} />
                    {formErrors.availability_domainError && <span  className="red-alert">{formErrors.availability_domainError}</span>}
              </FormControl>
         
        </Grid>
        <Grid item xs={6} md={2.4}  className="small-box">
        <FormControl className="input-outer">
                <label>Backup Policy</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.backup_policy} name="backup_policy" onChange={handleChange} />
                    {formErrors.backup_policyError && <span  className="red-alert">{formErrors.backup_policyError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="small-box">
        <FormControl className="input-outer">
                <label>Boot Volume Size</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.boot_volume_size} name="boot_volume_size" onChange={handleChange} />
                    {formErrors.boot_volume_sizeError && <span  className="red-alert">{formErrors.boot_volume_sizeError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="small-box">
        <FormControl className="input-outer">
                <label>Preserve Boot Volume</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.preserve_boot_volume} name="preserve_boot_volume" onChange={handleChange} />
                    {formErrors.preserve_boot_volumeError && <span  className="red-alert">{formErrors.preserve_boot_volumeError}</span>}
              </FormControl>
        </Grid>  
           <Grid item xs={6} md={2.4}  className="small-box">
           <FormControl className="input-outer">
                <label>Compartment Name</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.compartment_name} name="compartment_name" onChange={handleChange} />
                    {formErrors.compartment_nameError && <span  className="red-alert">{formErrors.compartment_nameError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>Load Balancer Timeout</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.load_balancer_timeout} name="load_balancer_timeout" onChange={handleChange} />
                    {formErrors.load_balancer_timeoutError && <span  className="red-alert">{formErrors.load_balancer_timeoutError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>Client_prefix</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.client_prefix} name="client_prefix" onChange={handleChange} />
                    {formErrors.client_prefixError && <span  className="red-alert">{formErrors.client_prefixError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>Subnet_prefix</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.oci_endpoint} name="oci_endpoint" onChange={handleChange} />
                    {formErrors.oci_endpointError && <span  className="red-alert">{formErrors.oci_endpointError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>VCN_CIDR</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.vcn_cidr} name="vcn_cidr" onChange={handleChange} />
                    {formErrors.vcn_cidrError && <span  className="red-alert">{formErrors.vcn_cidrError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>VCN_SUB_CIDR</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.vcn_sub_cidr} name="vcn_sub_cidr" onChange={handleChange} />
                    {formErrors.vcn_sub_cidrError && <span  className="red-alert">{formErrors.vcn_sub_cidrError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>MGMT_SUB_CIDR</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.mgmt_sub_cidr} name="mgmt_sub_cidr" onChange={handleChange} />
                    {formErrors.mgmt_sub_cidrError && <span  className="red-alert">{formErrors.mgmt_sub_cidrError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>SSH_PUB_Key_1</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.ssh_pub_key_1} name="ssh_pub_key_1" onChange={handleChange} />
                    {formErrors.ssh_pub_key_1Error && <span  className="red-alert">{formErrors.ssh_pub_key_1Error}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>SSH_PUB_Key_2</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.ssh_pub_key_2} name="ssh_pub_key_2" onChange={handleChange} />
                    {formErrors.ssh_pub_key_2Error && <span  className="red-alert">{formErrors.ssh_pub_key_2Error}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>DB_System_Size</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.db_system_size} name="db_system_size" onChange={handleChange} />
                    {formErrors.db_system_sizeError && <span  className="red-alert">{formErrors.db_system_sizeError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>DB_Core_Count</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.db_system_count} name="db_system_count" onChange={handleChange} />
                    {formErrors.db_system_countError && <span  className="red-alert">{formErrors.db_system_countError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>DB_Edition</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.db_edition} name="db_edition" onChange={handleChange} />
                    {formErrors.db_editionError && <span  className="red-alert">{formErrors.db_editionError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>DB_version</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.db_version} name="db_version" onChange={handleChange} />
                    {formErrors.db_versionError && <span  className="red-alert">{formErrors.db_versionError}</span>}
              </FormControl>
        </Grid>
        <Grid item xs={6} md={2.4}  className="large-box">
        <FormControl className="input-outer">
                <label>DB_Host_User_Name</label>
                <OutlinedInput placeholder="Type name" type="text" className="input-main" value={formData.db_host_user_name} name="db_host_user_name" onChange={handleChange} />
                    {formErrors.db_host_user_nameError && <span  className="red-alert">{formErrors.db_host_user_nameError}</span>}
              </FormControl>
        </Grid>
         
      </Grid>
    </Box><div className="data-button-section">
 
    <Button variant="contained" className="common-default-button blue-button"  onClick={handleSubmit}>Submit</Button>
     

    </div>
</div>
 

     </div>
    
    
    </div>
    
    
      );

}