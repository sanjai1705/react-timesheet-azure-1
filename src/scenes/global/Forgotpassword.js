import { ArrowLeft } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Forgotpassword = () => {
  const [newPassword, setnewPassword] = useState("");
  const [conNewPassword, setconNewPassword] = useState("");
  const navigate = useNavigate();

  const handleNewPassChange = (event) => {
    setnewPassword(event.target.value);
  };

  const handleConformPassChange = (event) => {
    setconNewPassword(event.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <button className="text-red-500 hover:underline" onClick={()=>navigate('/login')}><ArrowLeft/>Go Back</button>
        <h1 className="text-2xl font-semibold mb-4 text-black">
          Forgot Password
        </h1>
        <form className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter New Password:
            </label>
            <input
              type="password"
              className="px-1 py-2 mt-1 text-lg block w-full rounded-sm bg-slate-50 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
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
              className="px-1 py-2 mt-1 text-lg block w-full rounded-sm bg-slate-50 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              value={conNewPassword}
              onChange={handleConformPassChange}
              required
            />
          </div>
          <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Save
            </button>
        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;
