import { ArrowLeft } from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../apiConfig";
import Loader from "../../components/Loader";
import SimpleSnackbar from "../../components/Snackbar";

const Forgotpassword = () => {
  const [Email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);  // New state
  const navigate = useNavigate();
  const [alerttrigger, setalerttrigger] = useState("");
  const [loading, setloading] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendReset = async(event) => {
    event.preventDefault();
    setloading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password?email=${Email}`)
      console.log(response)
      if(response.status === 200) {
        setalerttrigger("Email Sent")
        setIsEmailSent(true);  // Set the state to true when email is sent
      }
    } catch(error) {
      console.log(error)
      const errorMessage = error.response?.data || 'Something went wrong!';
      setalerttrigger(errorMessage);
    }
    setloading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <button className="text-red-500 hover:underline" onClick={() => navigate('/login')}><ArrowLeft/>Go Back</button>
        <h1 className="text-2xl font-semibold mb-4 text-black">
              Forgot Password
            </h1>
        {!isEmailSent ? (  // Conditionally render the form
          <>
            
            <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={handleSendReset}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter Your Email Address:
            </label>
            <input
              type="email"
              className="px-1 py-2 mt-1 text-lg block w-full rounded-sm bg-slate-50 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              value={Email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Send Reset Link
            </button>
        </form>
          </>
        ) : (
          <p className="text-md text-center my-4">
            A reset link has been sent to <b>{Email}</b>.
          </p>
        )}
      </div>
      {alerttrigger && (
        <SimpleSnackbar
          message={alerttrigger}
          setalerttrigger={setalerttrigger}
          vertical={'top'}
          horizontal={'center'}
          severity={alerttrigger === "Email Sent" ? 'success' : 'error'}
        />
      )}
      {loading && <Loader/>}
    </div>
  );
};

export default Forgotpassword;