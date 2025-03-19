import axios from 'axios';
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { showErrorToast, showSuccessToast } from '../utils/toastMessage';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [resetPassInfo, setResetPassInfo] = useState({
      email: "",
      otp:"",
      newPassword: "",
    });

    const navigate = useNavigate();
  
    const handleOnchange = (e) => {
      const { name, value } = e.target;
      setResetPassInfo({ ...resetPassInfo, [name]: value });
    };
  
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, otp, newPassword } = resetPassInfo;
    
        if (!email || !newPassword || !otp) {
            showErrorToast("Email, OTP, and new password are required");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:9090/api/reset-password", resetPassInfo);
            if(response.data.success){  setTimeout(() => {
                showSuccessToast(response.data.message);
            }, 2000);
            navigate('/login');}
            else{
                showErrorToast()
            }
          
    
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                    showErrorToast(error.response.data.error.details[0].message || "Unexpected error occurred. Try again later");
            } 
            else if(error.response.data.message){
                showErrorToast(error.response.data.message)
            }else {
                showErrorToast("Something went wrong. Please try again.");
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
              Reset Password
            </h1>
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
                  value={resetPassInfo.email}
                />
              </div>
              <div className="m-3 flex flex-col p-2">
                <label htmlFor="email" className="font-semibold">
                  OTP
                </label>
                <input
                  className="outline-none border-solid w-[95%] border-2 border-black p-1"
                  type="text"
                  onChange={handleOnchange}
                  placeholder="Enter OTP"
                  name="otp"
                  value={resetPassInfo.otp}
                />
              </div>
              <div className="m-3 flex flex-col p-2">
                <label htmlFor="password" className="font-semibold">
                  New Password
                </label>
                <div className="flex gap-2 w-full">
                  <input
                    className="outline-none border-solid w-[95%] border-2 border-black p-1"
                    type={showPassword ? "text" : "password"}
                    onChange={handleOnchange}
                    value={resetPassInfo.newPassword}
                    placeholder="Enter your new password"
                    name="newPassword"
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
                Save
              </button>
            </form>
          </div>
        </div>
      </>
    );
  };

export default PasswordReset