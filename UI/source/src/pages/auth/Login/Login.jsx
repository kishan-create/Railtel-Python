import React from "react";
import { logo, loginleft, eye, captcha } from "../../../components/images"
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput'

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// import LoginValidations from "../Validations/LoginValidations";
// import LoginFunction from "../auth/Functions/LoginFunctions";
import LoginValidations from "../Validations/LoginValidations";
import LoginFunction from "../Functions/LoginFunctions";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

// 



export default function Login() {
  const {handleChange, values, handleSubmit, errors, error } = LoginFunction(
    LoginValidations, 
  );
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

return (
  <>
<form onSubmit={handleSubmit}>
    <section className="login-bg">
        <div className="logo">
          <img src={logo} />
        </div>
        <div className="login-middle-outer">
      <div className="login-left login-lef-block">
      
        <div className="login-left-inner ">
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
          </div></div>
      </div>
      <div className="login-right">
        <div className="login-right-form-control">
          <div className="login-form-inner-bg">
            <div className="sign-head">
              Sign In
            </div>
            <div className="sign-head-sub-font">Please enter your given credentials to login</div>
            <div className="form-text-outer">
              <FormControl className="input-outer">
                <label>Username</label>
                <OutlinedInput placeholder="Johnsmith@email.com" type="text" className="input-main" name="email_id" value={values.email_id} onChange={handleChange} />
                <p className="red-alert">{errors.email_id}</p>
              </FormControl>
              
             
              <FormControl className="input-outer">
                <label>Password</label>
                <OutlinedInput placeholder="..........."    type={showPassword ? "text" : "password"}
 className="input-main"  name="password" value={values.password} onChange={handleChange}/>
                <div className="input-icon input-icon-newr">
                  <img onClick={togglePasswordVisibility}src={eye} />
                  
                </div>
                <p className="red-alert">{errors.password}</p>
                {error && <div style={{ color: "red" , fontSize: "0.8em"}}>{error}</div>}
              </FormControl>
              <div className="captcha-outer-main-outer">
                <div className="captcha-outer">
                  <FormGroup>
                    <FormControlLabel required control={<Checkbox />} label="I'm not a robot" />
                  </FormGroup>
                  <img src={captcha} />
                </div>
                <div className="forget-passwoed-block">
                  <a href="">Forgot password?</a>
                </div>
              </div>

              <div className="login-button">
                
  <button  className="common-button blue-button " >Login</button>
 
  </div>
              <div className="dont-have-block">
                <p>
                  Don't have an account? <Link to="/Signup"  rel="noreferrer">Sign Up</Link>
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    </form>
 <Outlet />
 </>

  );

}