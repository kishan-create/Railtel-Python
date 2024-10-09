import React from "react";

export default function LoginValidations(values) {
  let errors = {};
//  /* Confirm 
 if (!values.email_id.trim()) {
    errors.email_id = "User name reqiured";
    console.log(errors.email_id);
  }
  else{
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
  if( (emailPattern.test(values.email_id))== false){
    errors.email_id = "Invalid Format";
  }

  }
  if (!values.password.trim()) {
    errors.password = "Password is reqiured";
  }


  return errors;
}
