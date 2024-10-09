import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

export default function Dataassessment() {
  const [validToken, setValidToken] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    user_name: "",
    server_name: "",
    user_id: "",
    port: "",
    connection_url: "",
    password: "",
    confirm_password: "",

  });

  const [formErrors, setFormErrors] = useState({
    user_name: "",
    server_name: "",
    user_id: "",
    port: "",
    connection_url: "",
    password: "",
    confirm_password: "",

  });

  const [data, setData] = useState(false);
const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setToken(token);
    if (!token) {
      setValidToken(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiUrl = `${global.config.APIROOTURL}/api/databaseassessment/`;
    const token = sessionStorage.getItem("token");
    await axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // adjust Content-Type as needed
        },
      })
      .then((response) => {
        setFormData({
          user_name: response.data.user_name,
          server_name: response.data.server_name,
          user_id: response.data.user_id,
          port: response.data.port,
          connection_url: response.data.connection_url,
          password: response.data.password,
          confirm_password:response.data.password,





          // Update other fields accordingly
        });
        setData(true)
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Oops..",
            text: "Session time out ",
          });
          navigate('/');
        
        }
        
        else if (error.response && error.response.status === 404){
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Oops..",
            text: error.message,
          });
        }
      });
  };

  const [status, setStatus] = useState(null);
  const [clicked, setClicked] = useState(false);


  const handleClick = async () => {
    try {
      const apiUrl = `${global.config.APIROOTURL}/api/home/validatetoken`;
      await axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // adjust Content-Type as needed
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setStatus(response.status);
            setClicked(true);
            setConnectionStatus('pass')
            setTimeout(() => {
              setConnectionStatus(null); // Hide connection status
            }, 2000);
          } 
          else if (response.status === 401){
            setStatus(response.status);
            setClicked(true);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Session time out",
            });
          }
          
        });
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      
    }
   
     
    

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    let errors = {};
    if (!formData.user_name) {

      errors.user_nameError = 'Username is required';
    }
    if (!formData.server_name) {
      errors.server_nameError = 'Server Name is required';
    }
    if (!formData.user_id) {
      errors.user_idError = 'User Id is required';
    }
    if (!formData.port) {
      errors.portError = 'Port is required';
    }
    if (!formData.connection_url) {
      errors.connection_urlError = 'Connection_url is required';
    }
    if (!formData.password) {
      errors.passwordError = 'Password is required';
    }
    if (!formData.confirm_password) {
      errors.confirm_passwordError = 'Confirm Password is required';
    }
    else {
      if (formData.confirm_password !== formData.password) {
        errors.confirm_passwordError = 'Passwords do not match';
      }
      // else
      // {

      //   errors.confirm_passwordError = null;
      // }
    }

    // If there are errors, set them and prevent form submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      // If no errors, proceed with form submission
      // Here you can send the form data to your server or perform any other action

      setFormErrors({
        user_name: "",
        server_name: "",
        user_id: "",
        port: "",
        connection_url: "",
        password: "",
        confirm_password: "",
        
      });
      delete formData.confirm_password;
      onSubmitFunction(formData)


    }
  }


    const onSubmitFunction = async (formData)=>{
      if (data === true) {
        const apiUrl = `${global.config.APIROOTURL}/api/databaseassessment`;
        try {
          const response = await axios.put(
            `${global.config.APIROOTURL}/api/databaseassessment`,
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
            `${global.config.APIROOTURL}/api/databaseassessment`,
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
      <div className="assessment-main-outer">
        <div className="main-text-head">Database assessment</div>
        <div className="data-setion-box-block">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>Database User Name</label>
                  <OutlinedInput
                    placeholder="Type name"
                    type="text"
                    className="input-main"
                    value={formData.user_name}
                    name="user_name"
                    onChange={handleInputChange}
                  /> 
                    {formErrors.user_nameError && <span  className="red-alert">{formErrors.user_nameError}</span>}

                </FormControl>
              </Grid>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>Database server name</label>
                  <OutlinedInput
                    placeholder="Type server name"
                    type="text"
                    className="input-main"
                    name="server_name"
                    value={formData.server_name}
                    onChange={handleInputChange}

                  />
                    {formErrors.server_nameError && <span  className="red-alert">{formErrors.server_nameError}</span>}

                </FormControl>
              </Grid>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>User ID</label>
                  <OutlinedInput
                    placeholder="Type name"
                    
                    user
                    IDype="text"
                    className="input-main"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}

                  />
                    {formErrors.user_idError && <span  className="red-alert">{formErrors.user_idError}</span>}

                </FormControl>
              </Grid>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>Port</label>
                  <OutlinedInput
                    placeholder="Type"
                    type="text"
                    className="input-main"
                    name="port"
                    value={formData.port}
                    onChange={handleInputChange}

                  />
                    {formErrors.portError && <span  className="red-alert">{formErrors.portError}</span>}

                </FormControl>
              </Grid>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>Connection URL</label>
                  <OutlinedInput
                    placeholder="Enter URL"
                    type="text"
                    className="input-main"
                    value={formData.connection_url}
                    name="connection_url"
                    onChange={handleInputChange}

                  />
                    {formErrors.connection_urlError && <span  className="red-alert">{formErrors.connection_urlError}</span>}

                </FormControl>
              </Grid>
              <Grid item xs={6} md={4.8} className="large-box">
                <FormControl className="input-outer">
                  <label>Password</label>
                  <OutlinedInput
                    value={formData.password}
                    name="password"
                    onChange={handleInputChange}
                    placeholder=""
                    type="text"
                    className="input-main"
                  />
                    {formErrors.passwordError && <span  className="red-alert">{formErrors.passwordError}</span>}

                </FormControl>
              </Grid>
              <Grid item xs={6} md={4.8} className="large-box">
                <FormControl className="input-outer">
                  <label>Confirm Password</label>
                  <OutlinedInput
                    placeholder=""
                    type="text"
                    className="input-main"
                    value={formData.confirm_password}
                    name="confirm_password"
                    onChange={handleInputChange}

                  />
                    {formErrors.confirm_passwordError && <span  className="red-alert">{formErrors.confirm_passwordError}</span>}
                    {formErrors.password_matchError && <span  className="red-alert">{formErrors.password_matchError}</span>}

                </FormControl>
              </Grid>
            
            </Grid>
          </Box>
          <div className="data-button-section">
            <Button
              variant="contained"
              className="common-default-button"
              onClick={handleClick}
            >
              Test connection
            </Button>
            {clicked && status === 200 && connectionStatus === 'pass' ? (
                <div className="connection-pass-text">
                <p>Connection Status:</p>{" "}
                <span>
                  Pass <DoneIcon />
                </span>
              </div>


            ): clicked && status === 200 && connectionStatus === null?(



              
              <div>
                <Button variant="contained" onClick={handleSubmit} className="common-default-button">
                  Submit
                </Button>
                <Button
                  variant="contained"
                  className="common-default-button blue-button"
                >
                  Generate Report
                </Button>
              
                <Grid item xs={6} md={2.4} className="small-box">
                <Button variant="contained" className="data-download">
                  <svg
                    width="12"
                    height="16"
                    className="download-arrow"
                    viewBox="0 0 12 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.99999 0C5.7857 0 5.61038 0.181169 5.61038 0.402597V10.4675L1.27012 6.54221C1.10648 6.39727 0.861028 6.41337 0.720768 6.57844C0.580509 6.74753 0.596093 7.00117 0.755833 7.1461L5.74285 11.6552C5.80908 11.7156 5.89869 11.7558 5.9922 11.7558C5.9922 11.7558 5.9922 11.7558 5.99609 11.7558H5.99999C6.09739 11.7558 6.18311 11.7156 6.24934 11.6552L11.2364 7.1461C11.4 7.00117 11.4156 6.7435 11.2714 6.57844C11.1312 6.40935 10.8818 6.39324 10.7221 6.54221L6.38181 10.4675V0.402597C6.38181 0.181169 6.20648 0 5.9922 0H5.99999Z"
                      fill="black"
                    />
                    <path
                      d="M0 15.218C0 15.4395 0.175325 15.6206 0.38961 15.6206H11.6104C11.8247 15.6206 12 15.4395 12 15.218C12 14.9966 11.8247 14.8154 11.6104 14.8154H0.38961C0.175325 14.8154 0 14.9966 0 15.218Z"
                      fill="black"
                    />
                  </svg>
                  Download
                </Button>
              </Grid>
              </div>
            ) : clicked && status === 401? (
              <div className="connection-pass-text">
                <p>Connection Status:</p>{" "}
                <span>
                  Failed <CloseIcon />
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
