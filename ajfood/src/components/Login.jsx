import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import axiosInstance from "../utils/axiosInstance";
import { useRole } from "../utils/useRole";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [forgetPass, setForgetPass] = useState(false);
  const {setRole,setUserId, setUsername} = useRole();

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      showErrorToast("Email and password are required");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/login",
        loginInfo,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { message, success, id, accessToken, name, role } = response.data;

      if (success) {
        showSuccessToast(message);
        localStorage.setItem("token", accessToken);
        setRole(role);
        setUsername(name);
        setUserId(id);


        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      if (error.response?.data?.error?.details) {
        error.response.data.error.details.forEach((err) =>
          showErrorToast(err.message)
        );
        setForgetPass(true);
      } else if (error.response?.data?.message) {
        showErrorToast(error.response.data.message);
        setForgetPass(true);
      } else {
        showErrorToast("Unexpected error occurred. Try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]">
        <div className="p-4 bg-white w-[30%] h-[65%] shadow-lg rounded-md">
          <h1 className="font-bold text-4xl text-center mt-5">Login</h1>
          <form onSubmit={handleSubmit}>
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
                value={loginInfo.email}
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
                  value={loginInfo.password}
                  placeholder="Enter your password"
                  name="password"
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
              </div>
            </div>
            <button className="w-full bg-[#8A2BE2] p-2 mt-4 rounded-lg text-black font-bold hover:bg-purple-800">
              Login
            </button>
            {forgetPass && (
              <p className="w-full text-center mt-2">
                <Link to="/forget-pass" className="font-semibold hover:text-blue-700">
                  Forgot Password?
                </Link>
              </p>
            )}
            <div className="w-full text-center mt-4 text-xl">
              Don't have an account?
              <Link className="font-bold" to="/signup">
                {" "}
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
