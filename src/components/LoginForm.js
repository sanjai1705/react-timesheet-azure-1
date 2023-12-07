import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { mockDataTeam } from '../data/mockData';
import {AuthContext} from '../App'
import loginbg from '../../src/login-bg.jpg'

function LoginForm() {
  const { user, login } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlelogin = () => {
    const user = mockDataTeam.find((u) => u.username === username && u.password === password);
    login({ role: user.role, userId: user.userid, username: username });

    if (user.role == 'Employee') {
      navigate('/e')
    } 
    else if(user.role == 'Manager') {
      navigate('/m')
    }
    else {
      console.log('Invalid credentials');
      setErrorMessage('Invalid Credentials')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/Timesheet/login', {
        username,
        password,
      });
      const data = response.data;
      console.log(data)
      login({ role: data.Rolename, userId: data.userid, username: username });
      if (data.Rolename == 'Employee') {
        navigate('/e')
      } 
      else if(data.Rolename == 'Manager') {
        navigate('/m')
      }
      else {
        console.log('Invalid credentials');
        setErrorMessage('Invalid Credentials')
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Login Failed');
    }
  };

  console.log(user)
  
  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-black">Timesheet Log In</h1>
        <form
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              className="px-1 py-2 mt-1 text-lg block w-full rounded-sm bg-slate-50 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          className="px-1 py-2 mt-1 text-lg block w-full rounded-sm bg-slate-50 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          onChange={handlePasswordChange}
          required
        />
        
          </div>
          <div>
          <input
          type="checkbox"
          className="mr-2"
          checked={showPassword}
          onChange={togglePasswordVisibility}
        ></input>Show Password
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>


    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-600">
      <div className="bg-white w-full h-full mx-8 p-8 rounded-lg flex items-center justify-between">
      <div className='w-1/2'>
          <img src={loginbg} alt="Login Image" className='w-52'/>
        </div>

        {/* Right side (login inputs) */}
        <div className='w-1/2'>
          {/* Your login inputs go here */}
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" className="border border-gray-300 p-2 rounded-md mb-4 block" />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" className="border border-gray-300 p-2 rounded-md mb-4 block" />

          {/* Add your login button or other elements here */}
        </div>
      </div>
    </div>


    <div className="min-h-screen flex items-center justify-center bg-slate-500">
    <div className="inset-0 bg-white bg-opacity-30">
    <div className='w-1/2'>
          <img src={loginbg} alt="Login Image" className='w-52'/>
        </div>

        {/* Right side (login inputs) */}
        <div className='w-1/2'>
          {/* Your login inputs go here */}
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" className="border border-gray-300 p-2 rounded-md mb-4 block" />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" className="border border-gray-300 p-2 rounded-md mb-4 block" />

          {/* Add your login button or other elements here */}
        </div>
    </div>
    </div>
    </>
  );
}

export default LoginForm;
