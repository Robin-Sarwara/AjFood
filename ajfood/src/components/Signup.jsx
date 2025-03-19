import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      showErrorToast("name, email and password are required");
    }
    try {
      const response = await axios.post(
        "http://localhost:9090/auth/signup",
        signupInfo,
        {
          headers: { "Content-type": "application/json" },
        }
      );
      console.log(response.data);
      const { message, success, error } = response.data;
      console.log(response.data)
      if (success) {
        console.log("✅ Entering success block...");
        showSuccessToast(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      if (error.response.data.error && error.response.data.error.details) {
        error.response.data.error.details.forEach((err) => {
          showErrorToast(err.message);
        });
      }
      else if(error.response.data.message){
        showErrorToast(error.response.data.message)
      }
       else {
       showErrorToast("Unexpected error occured, Try again after some time")

      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-gradient-to-br from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]">
        <div className="p-4 bg-white w-[30%] h-[65%] shadow-lg rounded-md">
          <h1 className="font-bold text-4xl text-center w-full mt-5 bg-[ #FFFFFF]">
            Signup
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="m-3 flex flex-col p-2">
              <label htmlFor="name" className="font-semibold">
                Name
              </label>
              <input
                className="outline-none border-solid border-2 w-[95%] border-black p-1"
                onChange={handleOnchange}
                type="text"
                placeholder="Enter your name"
                name="name"
                value={signupInfo.name}
                autoFocus
              />
            </div>
            <div className="m-3 flex flex-col p-2">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                className="outline-none border-solid w-[95%] border-2 border-black p-1"
                type="email"
                onChange={handleOnchange}
                placeholder="Enter your email"
                name="email"
                value={signupInfo.email}
              />
            </div>
            <div className="m-3 flex flex-col p-2">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <div className="flex gap-2 w-full">
                <input
                  className="outline-none border-solid w-[95%] border-2 border-black p-1"
                  type={showPassword ? "text" : "password"}
                  onChange={handleOnchange}
                  value={signupInfo.password}
                  placeholder="Enter your password"
                  name="password"
                />
                <span className="flex justify-end text-end">
                  <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <FaEyeSlash size={24} />
                    ) : (
                      <FaEye size={24} />
                    )}
                  </button>
                </span>
              </div>
            </div>
            <button className="w-full bg-[#8A2BE2] p-2 mt-4 rounded-lg text-black font-bold hover:bg-purple-800 ">
              Signup
            </button>
            <div className="w-full text-center mt-4 text-xl">
              Already have an account?
              <Link className="font-bold" to="/login">
                {" "}
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
