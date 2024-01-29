import React, { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../App";
import API_BASE_URL from "../apiConfig";
import ZAdroitLogo from "../zadroit logo.png";

function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, "Username must be at least 4 characters long") // Updated line
      .required("Username is required"),
    password: Yup.string()
      .required("Password is required"),
  });
  

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, values);
        const data = response.data;
        login({
          role: data.Rolename,
          userId: data.userid,
          username: values.username,
        });

        if (["Employee", "Manager", "Admin"].includes(data.Rolename)) {
          navigate("/u/timeentries");
        } else {
          formik.setFieldError("general", "Invalid Credentials");
        }
      } catch (error) {
        console.error("Error:", error);
        formik.setFieldError("general", "Login Failed");
      }
    },
  });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center loginpage-bg bg-cover bg-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <img src={ZAdroitLogo} className="h-16" alt="ZAdroit Logo" />
            <h1 className="text-2xl font-thin mb-4 text-black md:text-4xl">
              Timesheet
            </h1>
          </div>

          <form
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <input
                type="text"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                onBlur={formik.handleBlur}
                className="px-1 py-2 mt-1 text-md block w-full rounded-sm bg-slate-50 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                placeholder="Username"
                required
              />
              {formik.touched.username && formik.errors.username ? (
                <p className="text-red-500">{formik.errors.username}</p>
              ) : null}
            </div>
            <div>
              <input
                type={formik.values.showPassword ? "text" : "password"}
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
                className="px-1 py-2 mt-1 text-md block w-full rounded-sm bg-slate-50 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                placeholder="Password"
                required
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500">{formik.errors.password}</p>
              ) : null}
            </div>
            <div>
              <input
                type="checkbox"
                className="mr-2"
                checked={formik.values.showPassword}
                onChange={() =>
                  formik.setFieldValue(
                    "showPassword",
                    !formik.values.showPassword
                  )
                }
              />
              Show Password
            </div>
            <div>
              <p
                className="text-black cursor-pointer hover:underline"
                onClick={() => navigate("/forgotpass")}
              >
                Forgot Password?
              </p>
            </div>
            {formik.errors.general && (
              <p className="text-red-500">{formik.errors.general}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
