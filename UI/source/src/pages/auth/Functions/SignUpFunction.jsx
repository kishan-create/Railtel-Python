import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../helpers/config";

function SignUpFunction(SignUpValidations) {
  const navigate = useNavigate();

  const [values, SetValues] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email_id: "",
    country_id: "",
    password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

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

  useEffect(() => {
    getSelectDropdown();
  }, []);

  const getSelectDropdown = async () => {
    await axios
      .get(`${global.config.APIROOTURL}/api/lookups/countries`)
      .then((response) => {
        // Assuming the response.data is an array of objects with country data
        setData(response.data);
      })
      .catch(
        function (error) {
          Swal.fire({
            position: "centre",
            icon: "error",
            title: error.message,
            showConfirmButton: true,
            timer: 5000,
          });
          return Promise.resolve(error)
        }
      )
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
     setErrors(SignUpValidations(values));

  };
  const onSubmitform = async (e) => {
    try {
      const { confirm_password, ...formData } = values;
      const response = await axios.post(
        `${global.config.APIROOTURL}/api/users`,
        formData
      );

      if (response.status === 200) {
        Swal.fire({
          position: "centre",
          icon: "success",
          title: "Registered Successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/", { replace: true });
      }
    
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Swal.fire({
          position: "centre",
          icon: "error",
          title: "Email already registred",
          showConfirmButton: true,
          timer: 5000,
        });

     
        
      } else  {
        Swal.fire({
          position: "centre",
          icon: "error",
          title: error.message,
          showConfirmButton: true,
          timer: 3000,
        });
        
        
      }
 
    }
  };

  return {
    handleChange,
    values,
    handleSubmit,
    errors,
    validationMessage,
   
    error,
    data,
    SetValues,
  };
}

export default SignUpFunction;
