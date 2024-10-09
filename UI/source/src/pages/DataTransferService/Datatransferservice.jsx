import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from 'react-router-dom';


// import BasicTable from './Admintable';
export default function Datatransferservice() {
const navigate = useNavigate();

  const [connectionStatus, setConnectionStatus] = useState(null);

  const [validToken, setValidToken] = useState(true);
  const [token, setToken] = useState("");
  const [data, setData] = useState(false);
  const [status, setStatus] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [cpuTypes, setCpuTypes] = useState([]);
  const [localStorage, setLocalStorage] = useState([]);
  const [memories, setMemories] = useState([]);



  const [formData, setFormData] = useState({
    compartment_name: " ",
    compartment_id: " ",
    cpu_type_id: " ",
    memory_id: "",
    local_storage_id: "",
    image: "",
    display_name: " "
  });

  const [formErrors, setFormErrors] = useState({
    compartment_name: " ",
    compartment_id: " ",
    cpu_type_id: " ",
    memory_id: "",
    local_storage_id: "",
    image: "",
    display_name: " "
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setToken(token);
    if (!token) {
      setValidToken(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    apiData();

  }, []);

  const apiData = async () => {
    try {
    const cpuTypesResponse = await axios.get(`${global.config.APIROOTURL}/api/lookups/cputypes`);
    setCpuTypes(cpuTypesResponse.data);

    } catch (error) {
    
    }
    try {
      const cpuLocalStorageResponse = await axios.get(`${global.config.APIROOTURL}/api/lookups/localstorages`);
    setLocalStorage(cpuLocalStorageResponse.data);

      } catch (error) {
       
      }
      try {
        const cpuMemoriesResponse = await axios.get(`${global.config.APIROOTURL}/api/lookups/memories`);
        setMemories(cpuMemoriesResponse.data);

        } catch (error) {
       
        }
    


  }

  const fetchData = async () => {
    const apiUrl = `${global.config.APIROOTURL}/api/datatransfer/`;

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
          compartment_name: response.data.compartment_name,
          compartment_id: response.data.compartment_id,
          cpu_type_id: response.data.cpu_type_id,
          memory_id: response.data.memory_id,
          local_storage_id: response.data.local_storage_id,
          image: response.data.image,
          display_name: response.data.display_name,
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
        else if (error.response && error.response.status === 404) {
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

  const handleClick = async () => {
    try {
      const apiUrl = `${global.config.APIROOTURL}/api/datatransfer/testconnection`;
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
          else if (response.status === 401) {
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
      debugger
      Swal.fire({
        icon: "error",
              title: "Oops...",
              text: "Network error",
      });
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDropdownChange = (field, event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      setFormData({
        ...formData,
        [field]: selectedValue
      });
    }
  };

  const handleSubmit = async () => {
    let errors = {};
    if (!formData.compartment_name) {

      errors.compartment_nameError = 'Compartment name is required';
    }
    if (!formData.compartment_id) {
      errors.compartment_idError = 'Compartment Id is required';
    }
    if (!formData.cpu_type_id) {
      errors.cpu_type_idError = 'Cpu Types is required';
    }
    if (!formData.memory_id) {
      errors.memory_idError = 'Memory Id is required';
    }
    if (!formData.local_storage_id) {
      errors.local_storage_idError = 'Local Storage is required';
    }
    if (!formData.image) {
      errors.imageError = 'Image is required';
    }
    if (!formData.display_name) {
      errors.display_nameError = ' Display name is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {

      setFormErrors({
        compartment_name: " ",
        compartment_id: " ",
        cpu_type_id: " ",
        memory_id: "",
        local_storage_id: "",
        image: "",
        display_name: " "

      });
      onSubmitFunction(formData)
    }
  }

  const onSubmitFunction = async (formData) => {
    if (data === true) {
      const apiUrl = `${global.config.APIROOTURL}/api/datatransfer`;
      try {
        const response = await axios.put(
          `${global.config.APIROOTURL}/api/datatransfer`,
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
          `${global.config.APIROOTURL}/api/datatransfer`,
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

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    }
  }

  return (
    <div>
      <div className="assessment-main-outer">
        <div className="main-text-head">Data Transfer Service</div>
        <div className="data-setion-box-block">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>Compartment Name</label>
                  <OutlinedInput
                    placeholder="Type name"
                    type="text"
                    className="input-main"
                    value={formData.compartment_name}
                    name="compartment_name"
                    onChange={handleInputChange}

                  />
                  {formErrors.compartment_nameError && <span className="red-alert">{formErrors.compartment_nameError}</span>}
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>Compartment ID</label>
                  <OutlinedInput
                    placeholder="Type server name"
                    type="text"
                    className="input-main"
                    value={formData.compartment_id}
                    name="compartment_id"
                    onChange={handleInputChange}
                  />
                  {formErrors.compartment_idError && <span className="red-alert">{formErrors.compartment_idError}</span>}

                </FormControl>
              </Grid>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>CPU Type</label>
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    value={formData.cpu_type_id}
                    name="cpu_type_id"

                    onChange={(event) => handleDropdownChange('cpu_type_id', event)}
                  >
                    {/* <em>Select</em> */}

                    {cpuTypes.map((cpuType) => (
                      <MenuItem key={cpuType.id} value={cpuType.id}>
                        {cpuType.value}

                      </MenuItem>
                    ))}


                  </Select>
                  {formErrors.cpu_type_idError && <span className="red-alert">{formErrors.cpu_type_idError}</span>}

                </FormControl>
              </Grid>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>Image</label>
                  <OutlinedInput
                    placeholder="Type"
                    type="text"
                    className="input-main"
                    value={formData.image}
                    name="image"
                    onChange={handleInputChange}
                  />

                </FormControl>
                {formErrors.imageError && <span className="red-alert">{formErrors.imageError}</span>}

              </Grid>
              <Grid item xs={6} md={2.4} className="small-box">
                <FormControl className="input-outer">
                  <label>Display Name</label>
                  <OutlinedInput
                    placeholder="Enter URL"
                    type="text"
                    className="input-main"
                    value={formData.display_name}
                    name="display_name"
                    onChange={handleInputChange}
                  />
                </FormControl>
                {formErrors.display_nameError && <span className="red-alert">{formErrors.display_nameError}</span>}

              </Grid>
              <Grid item xs={6} md={4.8} className="large-box">
                <FormControl className="input-outer">
                  <label>Memory (RAM)</label>
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    name="memory_id"
                    value={formData.memory_id}
                    onChange={(event) => handleDropdownChange('memory_id', event)}
                  >
                    <em>Select</em>
                    {memories.map((storage) => (
                      <MenuItem key={storage.id} value={storage.id}>
                        {storage.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>
              <Grid item xs={6} md={4.8} className="large-box">
                  <FormControl className="input-outer">
                    <label>Local Storage</label>
                    <Select
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      name="local_storage_id"
                      value={formData.local_storage_id}
                      onChange={(event) => handleDropdownChange('local_storage_id', event)}
                    >
                      <em>Select</em>
                      {localStorage.map((storage) => (
                        <MenuItem key={storage.id} value={storage.id}>
                          {storage.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>


            </Grid>
          </Box>
          <div className="data-button-section">
            <Button
              variant="contained"
              className="common-default-button blue-button"
              onClick={handleClick}
            >
              Submit
            </Button>
            {clicked && status === 200 && connectionStatus === 'pass' ? (

              <div className="connection-pass-text">
                <p>Connection Status:</p>{" "}
                <span>
                  Pass <DoneIcon />
                </span>
              </div>

            ) : clicked && status === 200 && connectionStatus === null ? (
              <div>
                <Button
                  variant="contained"
                  className="common-default-button blue-button"
                  onClick={handleSubmit}
                >
                  Reset
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





            ) : clicked && status === 401 ? (
              <div className="connection-pass-text">
                <p>Connection Status:</p>{" "}
                <span>
                  Failed <CloseIcon />
                </span>
              </div>
            ) : null}

          </div>
        </div>
        <div className="one-col">
          <div>{/* <BasicTable/> */}</div>
        </div>
      </div>
    </div>
  );
}
