import React from "react";

export default function SignUpValidations(values) {
  let errors = {};
//  /* Confirm 
 if (!values.first_name.trim()) {
    errors.first_name = "First name reqiured";
  } else if (!/^[A-Za-z]+$/.test(values.first_name)) {
    errors.first_name = 'First name must contain only letters';
  }

  if (!values.last_name.trim()) {
    errors.last_name = "Last Name reqiured";
  } else if (!/^[A-Za-z]+$/.test(values.last_name)) {
    errors.last_name = 'Last name must contain only letters';
  }

  // const regex = /^[0-9\b]+$/;

  if (!values.phone_number.trim()) {
    errors.phone_number = 'Phone number is required';
  } else if (!/^[0-9\b]+$/.test(values.phone_number)) {
    errors.phone_number = 'Invalid phone number format';
  }

  if (!values.email_id.trim()) {
    errors.email_id = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email_id)) {
    errors.email_id = 'Invalid email format';
  }

  if (values.country_id === '') {
    errors.country_id = "Country Name is reqiured";
  } 

  if (!values.password.trim()) {
    errors.password = 'Password is required';
  } 
  // else if (values.password.length < 6) {
  //   errors.password = 'Password must be at least 6 characters long';
  // }
  // else if (values.password.trim().split(/\s+/).length < 6) {
  //   errors.password = 'Password must be at least 6 characters long';
  // } 

  // Validation for confirm password
  if (!values.confirm_password.trim()) {
    errors.confirm_password = 'Confirm Password is required';
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = 'Passwords do not match';
  }

  



  return errors;
}
