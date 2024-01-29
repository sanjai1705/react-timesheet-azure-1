import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../apiConfig";
import Loader from "../../components/Loader";
import SimpleSnackbar from "../../components/Snackbar";

const ResetPassword = () => {
  const [Email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [conNewPassword, setconNewPassword] = useState("");
  const [error, setError] = useState("");
  const [alerttrigger, setalerttrigger] = useState("");
  const [loading, setloading] = useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const handleNewPassChange = (event) => {
    setnewPassword(event.target.value);
  };

  const handleConformPassChange = (event) => {
    setconNewPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword === conNewPassword) {
      setloading(true);
      try {
        const queryString = `?resetToken=${token}&email=${Email}&newPassword=${newPassword}`;
        const response = await axios.post(
          `${API_BASE_URL}/reset-password${queryString}`
        );
        console.log(response);
        if (response.status === 200) {
          setIsResetSuccessful(true);
          setalerttrigger("Reset Successful")
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Assuming 400 status code for invalid link
          setIsLinkInvalid(true);
        } else {
          console.log("Reset error", error);
          setError("An error occurred. Please try again later.");
        }
        console.log("Reset", error);
      }
      setError("");
      setloading(false);
    } else {
      setError("Passwords do not match");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-black">
          Reset Password
        </h1>
        {isLinkInvalid ? (
          <p>
            The link may have expired or the entered mail did not match.{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Click here
            </Link>{" "}
            to try again.
          </p>
        ) : isResetSuccessful ? (
          <p>
            Your Password has been Successfully Reset.{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Click here
            </Link>{" "}
            to Log in with your New Password.
          </p>
        ) : (
          <form
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter Email:
              </label>
              <input
                type="email"
                className="px-1 py-2 mt-1 text-lg block w-full rounded-sm bg-slate-50 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter New Password:
              </label>
              <input
                type="password"
                className={
                  (error ? "border-2 border-red-500" : "border-gray-300") +
                  " px-1 py-2 mt-1 text-lg block w-full rounded-sm bg-slate-50 shadow-sm focus:ring focus:ring-blue-200"
                }
                value={newPassword}
                onChange={handleNewPassChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Conform New Password:
              </label>
              <input
                type="password"
                className={
                  (error ? "border-2 border-red-500" : "border-gray-300") +
                  " px-1 py-2 mt-1 text-lg block w-full rounded-sm bg-slate-50 shadow-sm focus:ring focus:ring-blue-200"
                }
                value={conNewPassword}
                onChange={handleConformPassChange}
                required
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Save
            </button>
          </form>
        )}
      </div>
      {alerttrigger && (
        <SimpleSnackbar
          message={alerttrigger}
          setalerttrigger={setalerttrigger}
          vertical={"top"}
          horizontal={"center"}
          severity={alerttrigger === "Reset Successful" ? "success" : "error"}
        />
      )}
      {loading && <Loader />}
    </div>
  );
};

export default ResetPassword;