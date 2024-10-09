import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../../helpers/config";

function LoginFunction(LoginValidations) {
  const navigate = useNavigate();
  const [values, SetValues] = useState({
    email_id: "",

    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    SetValues({
      ...values,
      [name]: value,
    });
    
    validatePassword(values.password);
  };

  const validatePassword = (password) => {
    if (values.password.length < 7) {
      setError("Password must be at least 8 words");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      onSubmitform();
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(LoginValidations(values));
    setIsSubmitting(true);
  };

  const onSubmitform = async (e) => {
    try {
      const response = await axios.post(
        `${global.config.APIROOTURL}/api/users/login`,
        values
      );


      if (response.status === 200) {
        const tokenFromHeader = response.data.authorization.split(" ")[1];
        sessionStorage.setItem("token", tokenFromHeader);

        Swal.fire({
          position: "centre",
          icon: "success",
          title: "Logged in Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/Dashboard", { replace: true });
      } else if (response.status === 404) {
        Swal.fire({
          position: "centre",
          icon: "success",
          title: " in Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      // else if  (!responseuser.ok) {
      //   throw new Error('Network response was not ok');+`
      // }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email or password wrong ",
        });
        // Show validation message for 404 error
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    }
  };

  return { handleChange, values, handleSubmit, errors, error };
}

export default LoginFunction;
