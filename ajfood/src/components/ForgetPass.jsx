import React, { useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPass = () => {
  const [forgetPassInfo, setForgetPassInfo] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setForgetPassInfo({ ...forgetPassInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = forgetPassInfo;
    if (!email) {
      showErrorToast("Please Enter Your Email");
      return;
    } 
    try {
      const response = await axios.post(
        "http://localhost:9090/api/forget-password",
        forgetPassInfo
      );
      if(response.data.success){setTimeout(() => {
        showSuccessToast(response.data.message);
      }, 2000)
      navigate("/reset-password");
    }
     
      
    }  catch (error) {
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
  return (
    <>
      <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-gradient-to-br from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]">
        <div className="p-4 bg-white w-[30%] h-auto shadow-lg rounded-md">
          <h1 className="font-bold text-4xl text-center w-full mt-5 bg-[ #FFFFFF]">
            Forget Password
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
                value={forgetPassInfo.email}
              />
            </div>
            <button className="w-full bg-[#8A2BE2] p-2 mt-4 rounded-lg text-black font-bold hover:bg-purple-800 ">
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPass;
