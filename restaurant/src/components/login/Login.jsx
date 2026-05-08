import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaUser, FaTimes, FaArrowRight, FaUserPlus } from 'react-icons/fa';
import { iconClass, inputBase } from '../../assets/dummydata';
import { Link } from 'react-router-dom'
import axios from 'axios';

const url = 'http://foodie-fenzy-delivery-backend-git-main-sifons-projects.vercel.app';

const Login = ({ onLoginSuccess, onClose }) => {
  const [showToast, setShowToast] = useState({visible: false, message: '', isError: false});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const res =  await axios.post(`${url}/api/user/login`, {
        email: formData.email,
        password: formData.password,
      })
      console.log('Axios Res:', res);

      if (res.status === 200 && res.data.success && res.data.token) {
        localStorage.setItem('authToken', res.data.token);

        // REMEMBER ME
        formData.rememberMe ? localStorage.setItem('loginData', JSON.stringify(formData))
          : localStorage.removeItem('loginData')

        setShowToast({ visible: true, message: 'Login Successful!', isError: false })
        setTimeout(() => {
          setShowToast({ visible: true, message: '', isError: false })
          onLoginSuccess(res.data.token)
        }, 1500)
      }
      else {
        console.warn('Unexpected Err:', res.data)
        throw new Error (res.data.message || 'Login failed')
      }
    }

    catch (err) {
      console.error('Axios error:', err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        'Login Failed';

      setShowToast({ visible: true, message: msg, isError: true });

      setTimeout(() => {
        setShowToast({ visible: false, message: '', isError: false });
      }, 2000);
    }
  };

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <>
      {/* TOAST */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300
        ${showToast.visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}
      >
        <div className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm ${showToast.isError ? 'bg-red-600 text-white' : 
          'bg-green-400 text-white'
        }`}></div>
        <div className="bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm">
          <FaCheckCircle />
          <span>{showToast.message}</span>
        </div>
      </div>

      {/* POPUP OVERLAY */}
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center">
        {/* MODAL */}
        <div className="bg-[#2D1B0E] text-white w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
          
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-400 hover:text-amber-300"
          >
            <FaTimes />
          </button>
          <h1 className='text-3xl font-bold text-center bg-linear-to-r from-amber-400 to-amber-600 
            bg-clip-text text-transparent mb-6 hover:scale-105 transition-transform'
          >
            LogIn 
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaUser className={iconClass} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputBase} pl-10 pr-4 py-3`}
              />
            </div>

            <div className="relative">
              <FaLock className={iconClass} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputBase} pl-10 pr-10 py-3`}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex items-center">
              <label className='flex items-center'>
                <input type="checkbox" name='rememberMe' checked={formData.rememberMe} onChange={handleChange} 
                  className='form-checkbox h-5 w-5 text-amber-600 bg-[#2D1B0E] border-amber-400 rounded focus:ring-amber-600' />
                <span className='ml-2 text-amber-100'>Remember Me</span>
              </label>
            </div>
            <button className="w-full py-3 bg-linear-to-r from-amber-400 to-amber-600 text-[#2D1B0E] 
              font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              Sign In <FaArrowRight />
            </button>
          </form>

          <div className="text-center">
            <Link to='/signup' onClick={onClose} className='inline-flex items-center gap-2 text-amber-400 
              hover:text-amber-600 transition-colors'
            >
              <FaUserPlus /> Create New Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
