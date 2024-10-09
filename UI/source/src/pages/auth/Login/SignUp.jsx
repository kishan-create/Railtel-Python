import React from "react";
import { logo, loginleft, eye, captcha } from "../../../components/images";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// import SignUpFunction from "../auth/Functions/SignUpFunction";
// import SignUpValidations from "../Validations/SignUpValidations";
import SignUpFunction from "../Functions/SignUpFunction";
import SignUpValidations from "../Validations/SignUpValidations";
import { Link } from "react-router-dom";
import { useState } from "react";
export default function Signup() {
  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    validationMessage,
   
    error,
    data,
    SetValues,
  } = SignUpFunction(SignUpValidations);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    const country = data.find(country => country.country_name === selectedCountry);
    if (country) {
      SetValues({
        ...values,
        country_id: country.id
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="login-bg">
        <div className="logo">
          <img src={logo} />
        </div>
        <div className="login-middle-outer">
          <div className="login-left signup-outer">
            <div className="login-left-inner">
              <div className="login-left-container">
                <div className="login-left-main-img">
                  <img src={loginleft} />
                </div>
                <div className="login-left-text-bold">
                  OMF (OCI Migration Factory)
                </div>
                <div className="login-left-make-text">
                  Make your OCI IaaS Transformation faster
                </div>
              </div>
            </div>
          </div>
          <div className="login-right">
            <div className="signup-form-control">
              <div className="login-form-inner-bg">
                <div className="sign-head">Sign Up</div>

                <div className="form-text-outer">
                  <div className="signup-col-2">
                    <FormControl className="input-outer">
                      <label>First Name</label>
                      <OutlinedInput
                        placeholder="Enter your first name"
                        type="text"
                        className="input-main"
                        name="first_name"
                        value={values.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name && (
                        <p className="red-alert">{errors.first_name}</p>
                      )}
                    </FormControl>
                    <FormControl className="input-outer">
                      <label>Last Name</label>
                      <OutlinedInput
                        placeholder="Enter your last name"
                        type="text"
                        className="input-main"
                        name="last_name"
                        value={values.last_name}
                        onChange={handleChange}
                      />
                      {errors.last_name && (
                        <p className="red-alert">{errors.last_name}</p>
                      )}
                    </FormControl>
                    <FormControl className="input-outer">
                      <label>Phone number</label>
                      <OutlinedInput
                        placeholder="Enter your Phone Number"
                        type="text"
                        className="Enter your phone number"
                        name="phone_number"
                        value={values.phone_number}
                        onChange={handleChange}
                      />
                      {errors.phone_number && (
                        <p className="red-alert">{errors.phone_number}</p>
                      )}
                    </FormControl>
                    <FormControl className="input-outer">
                      <label>Email ID</label>
                      <OutlinedInput
                        placeholder="Enter your Email"
                        type="text"
                        className="Enter your email ID"
                        name="email_id"
                        value={values.email_id}
                        onChange={handleChange}
                      />
                      {errors.email_id && (
                        <p className="red-alert">{errors.email_id}</p>
                      )}
                    </FormControl>
                  </div>
                  <div className="drop-down-outer">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <label>Country</label>
                      <Select
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleCountryChange}
                        
                      >
                        <MenuItem value="" disabled>
                          {/* <em>Select</em> */}
                        </MenuItem>
                        {data.map((country) => (
                          <MenuItem key={country.id} value={country.country_name}>
                            {`${country.country_name} (${country.phone_country_code})`}
                          </MenuItem>
                        ))}
                         
                      </Select>
                      {errors.country_id && (
                        <p className="red-alert">{errors.country_id}</p>
                      )}
                    
                    </FormControl>
                  </div>
                  <div className="signup-col-2">
                    <FormControl className="input-outer">
                      <label>Password</label>
                      <OutlinedInput
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        className="input-main"
                        name="password"
                        value={values.password}
                        onChange={(event) => {
                          // handlePasswordChange(event);
                          handleChange(event);
                        }}
                      />
                      {errors.password && (
                        <p className="red-alert">{errors.password}</p>
                      )}
                      {error && <div style={{ color: "red" , fontSize: "0.8em"}}>{error}</div>}

                      <div className="input-icon input-icon-newr1">
                        <img onClick={togglePasswordVisibility} src={eye} />
                      </div>
                    </FormControl>
                    <FormControl className="input-outer">
                      <label>Confirm password</label>
                      <OutlinedInput
                        placeholder="Confirm password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="input-main"
                        name="confirm_password"
                        value={values.confirm_password}
                        onChange={handleChange}
                      />

                      <div className="input-icon input-icon-newr1">
                        <img onClick={toggleConfirmPasswordVisibility} src={eye} />
                      </div>
                      {/* {errors.confirm_password && (
                        // <div className="red-alert">
                        //   {errors.confirm_password}
                        // </div>
                      )} */}
                      <div className="red-alert">{errors.confirm_password}</div>
                    </FormControl>
                  </div>

                  <div className="captcha-outer-main-outer">
                    <div className="captcha-outer">
                      <FormGroup>
                        <FormControlLabel
                          required
                          control={<Checkbox />}
                          label="I'm not a robot"
                        />
                      </FormGroup>
                      <img src={captcha} />
                    </div>
                    <div className="forget-passwoed-block">
                      <a href="">Forgot password?</a>
                    </div>
                  </div>

                  <div className="login-button">
                    <button className="common-button blue-button ">Create Account</button>

                  </div>
                  <div className="dont-have-block">
                <p>
                  Already have an account? <Link to="/"  rel="noreferrer">Sign In</Link>
                </p>
              </div>

                  {/* <Link to='/register' className='member-btn'>Register </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
