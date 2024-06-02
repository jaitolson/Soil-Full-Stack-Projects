import React, { useState } from "react";
import { loginUser } from '../services/api';
import { useNavigate, Link } from "react-router-dom";
import '../styles/login.css';

function Sigin({ logInUser }) {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser(fields);

      if (response.error) {
        setErrorMessage(response.error);
        setFields({ ...fields, password: "" });
      } else if (response.user.userBlock) {
        setErrorMessage("This account is blocked. Please contact support.");
        setFields({ ...fields, password: "" });
      } else {
        // Successful login, redirect to home page
        logInUser(true);
        navigate("/");
      }
    } catch (error) {
      // Handle API errors here
      console.error("Login error:", error);
      setErrorMessage("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="flex justify-center items-center h-full">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-sm w-full">
          <div className="mb-10">
            <div className="flex justify-center">
              <img
                alt=""
                className="h-14 w-14"
                src="https://ik.imagekit.io/ncbqgdj9g/logo2.jpeg?updatedAt=1713145250253"
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {"Login"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 mt-5">
              {"Don't have an account? "}
              <Link to={"/Signup"} className="font-medium text-purple-600 hover:text-purple-500">
                {"Register"}
              </Link>
            </p>
          </div>
          <h1 className="text-2xl mb-4">Login</h1>
          <div className="flex flex-col">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <input
                  name="email"
                  id="email"
                  value={fields.email}
                  onChange={handleInputChange}
                  placeholder="email"
                  className="rounded-md appearance-none w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="form-group mb-4">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="rounded-md appearance-none w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={fields.password}
                  placeholder="Password"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group mb-4">
                <input
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-900 hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                  value="Login"
                />
              </div>
              {errorMessage !== null && (
                <div className="form-group">
                  <span className="text-red-500">{errorMessage}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sigin;
