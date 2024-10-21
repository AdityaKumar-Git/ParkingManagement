import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("client");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    contactAddress: "",
    address: "",
    parkingArea: "",
    numLots: "",
    cameraIPs: [""],
  });
  const [error, setError] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const toggleUserType = (type) => {
    setUserType(type);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCameraIPChange = (index, value) => {
    const newCameraIPs = [...formData.cameraIPs];
    newCameraIPs[index] = value;
    setFormData({ ...formData, cameraIPs: newCameraIPs });
  };

  const addCameraIP = () => {
    setFormData({ ...formData, cameraIPs: [...formData.cameraIPs, ""] });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (
      !isLogin &&
      userType === "agent" &&
      (!formData.address || !formData.parkingArea || !formData.numLots)
    ) {
      setError("Please fill in all required fields for parking lot agents.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
      } else {
        response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/book");
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleForm}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => toggleUserType("client")}
              className={`px-4 py-2 rounded-md ${
                userType === "client"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Client
            </button>
            <button
              onClick={() => toggleUserType("agent")}
              className={`px-4 py-2 rounded-md ${
                userType === "agent"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Parking Lot Agent
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                {userType === "client" && (
                  <div>
                    <label
                      htmlFor="contactAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contact Address
                    </label>
                    <div className="mt-1">
                      <input
                        id="contactAddress"
                        name="contactAddress"
                        type="text"
                        required
                        value={formData.contactAddress}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                {userType === "agent" && (
                  <>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          id="address"
                          name="address"
                          type="text"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="parkingArea"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Parking Area
                      </label>
                      <div className="mt-1">
                        <input
                          id="parkingArea"
                          name="parkingArea"
                          type="text"
                          required
                          value={formData.parkingArea}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="numLots"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Number of Lots
                      </label>
                      <div className="mt-1">
                        <input
                          id="numLots"
                          name="numLots"
                          type="number"
                          required
                          value={formData.numLots}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="cameraIPs"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Camera IPs
                      </label>
                      {formData.cameraIPs.map((cameraIP, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            id={`cameraIP-${index}`}
                            name="cameraIPs"
                            type="text"
                            required
                            value={cameraIP}
                            onChange={(e) =>
                              handleCameraIPChange(index, e.target.value)
                            }
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {index === formData.cameraIPs.length - 1 && (
                            <button
                              type="button"
                              onClick={addCameraIP}
                              className="ml-2 text-indigo-600 hover:text-indigo-500"
                            >
                              +
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginSignup = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [userType, setUserType] = useState('client');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     contactAddress: '',
//     address: '',
//     parkingArea: '',
//     numLots: '',
//   });
//   const [error, setError] = useState('');

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setError('');
//   };

//   const toggleUserType = (type) => {
//     setUserType(type);
//     setError('');
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validateForm = () => {
//     if (!formData.email || !formData.password) {
//       setError('Please fill in all required fields.');
//       return false;
//     }
//     if (!isLogin && formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match.');
//       return false;
//     }
//     if (!isLogin && userType === 'owner' && (!formData.address || !formData.parkingArea || !formData.numLots)) {
//       setError('Please fill in all required fields for parking lot owners.');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       let response;
//       if (isLogin) {
//         const response = await fetch('http://localhost:5000/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               email: formData.email,
//               password: formData.password
//             }),
//           });
//       } else {
//         const response = await fetch('http://localhost:5000/api/auth/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData),
//           });
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'An error occurred');
//       }

//       const data = await response.json();
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('userType', userType);
//       localStorage.setItem('isLoggedIn', 'true');
//       navigate('/book'); // Redirect to the booking page after successful login/signup
//     } catch (error) {
//       setError(error.message || 'An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           {isLogin ? 'Sign in to your account' : 'Create a new account'}
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           {isLogin ? "Don't have an account? " : "Already have an account? "}
//           <button
//             onClick={toggleForm}
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             {isLogin ? 'Sign up' : 'Log in'}
//           </button>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <div className="flex justify-center space-x-4 mb-6">
//             <button
//               onClick={() => toggleUserType('client')}
//               className={`px-4 py-2 rounded-md ${
//                 userType === 'client'
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               Client
//             </button>
//             <button
//               onClick={() => toggleUserType('owner')}
//               className={`px-4 py-2 rounded-md ${
//                 userType === 'owner'
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               Parking Lot Owner
//             </button>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {!isLogin && (
//               <>
//                 {userType === 'client' && (
//                   <div>
//                     <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700">
//                       Contact Address
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="contactAddress"
//                         name="contactAddress"
//                         type="text"
//                         required
//                         value={formData.contactAddress}
//                         onChange={handleChange}
//                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {userType === 'owner' && (
//                   <>
//                     <div>
//                       <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                         Address
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           id="address"
//                           name="address"
//                           type="text"
//                           required
//                           value={formData.address}
//                           onChange={handleChange}
//                           className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label htmlFor="parkingArea" className="block text-sm font-medium text-gray-700">
//                         Parking Area
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           id="parkingArea"
//                           name="parkingArea"
//                           type="text"
//                           required
//                           value={formData.parkingArea}
//                           onChange={handleChange}
//                           className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label htmlFor="numLots" className="block text-sm font-medium text-gray-700">
//                         Number of Lots
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           id="numLots"
//                           name="numLots"
//                           type="number"
//                           required
//                           value={formData.numLots}
//                           onChange={handleChange}
//                           className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         />
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </>
//             )}

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {!isLogin && (
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                   Confirm Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     required
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   />
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="text-red-500 text-sm">{error}</div>
//             )}

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 {isLogin ? 'Sign in' : 'Sign up'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginSignup;
