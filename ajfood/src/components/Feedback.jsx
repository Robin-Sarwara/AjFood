import axios from 'axios';
import React, { useState } from 'react';
import { showErrorToast, showSuccessToast } from '../utils/toastMessage';
import axiosInstance from '../utils/axiosInstance';
import { useRole } from '../utils/useRole';
import Spinner from './Spinner';
import MostAskedQuestion from './MostAskedQuestion';
import { useNavigate } from 'react-router-dom';

const Feedback = ({ id }) => {
  const { userId } = useRole();
  const navigate = useNavigate();

  const [feedbackData, setFeedbackData] = useState({
    question: "",
  });
  const [loading, setLoading] = useState(false);
  const [refreshQuestions, setRefreshQuestions] = useState(false);

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/products/${id}/feedback`, {question:feedbackData.question,
        userId: userId
      });
      console.log(response.data);
      showSuccessToast("Question submitted successfully");
      setFeedbackData({
        question: ""
      });
      setRefreshQuestions(prev=>!prev)
    } catch (error) {
      showErrorToast(error.response?.data?.error ||error.response?.data?.error || "Failed to submit your question");
    } finally {
      setLoading(false);
    }
  };

 const handleUserAllQues =()=>{
  navigate('/user-all-questions')
 }

  return (
    <>
    {loading&&<Spinner/>}
    <div className='m-10 p-5'>
    <MostAskedQuestion refreshQuestions={refreshQuestions}/>
      <p className='font-bold text-start mt-10 ml-20 text-4xl'>Ask Question:</p>
      <form onSubmit={handleQuestionSubmit} className='flex flex-col md:ml-20 mt-5'>
        <label className='font-bold text-lg' htmlFor="question">Question</label>
        <div className='flex gap-4'>
          <input
            className='outline-none rounded-md border-2 border-black p-1 w-[80%]'
            type="text"
            name='question'
            onChange={handleChange}
            value={feedbackData.question}
            placeholder='Enter your question here'
            required
          />
          <button className='p-2 bg-blue-500 rounded-lg hover:bg-blue-700 w-auto' type="submit" disabled={loading}>
            Submit
          </button>
        </div>
      </form>
      <div className='mt-5 w-[100%] flex items-center justify-center'>
      <button onClick={handleUserAllQues} className='p-2 bg-green-700 text-white rounded-lg hover:bg-green-900 w-auto'>Click to see your all asked Questions</button>
      </div>
      </div>
    </>
  );
};

export default Feedback;
