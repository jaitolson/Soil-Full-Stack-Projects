import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api";
import "../styles/login.css";

function Signup(props) {
    const [fields, setFields] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if passwords match
        if (fields.password !== fields.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            // Attempt to create user
            const user = await createUser(fields);

            // If user creation is successful, navigate to the home page
            if (user) {
                navigate("/");
            } else {
                setErrorMessage("Failed to create user. Please try again later.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setErrorMessage("An error occurred while signing up. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <div className="flex items-center justify-center h-full">
                <div className="bg-white rounded-lg shadow-sm p-6 max-w-sm w-full">
                    <div className="mb-10">
                        <div className="flex justify-center">
                            <img
                                alt=""
                                className="h-14 w-14"
                                src="https://ik.imagekit.io/ncbqgdj9g/logo2.jpeg?updatedAt=1713145250253"
                            />
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{"Register"}</h2>
                        <p className="mt-2 text-center text-sm text-gray-600 mt-5">
                            {"Already have an account? "} {" "}
                            <Link to={"/signin"} className="font-medium text-purple-600 hover:text-purple-500">
                                {"Login"}
                            </Link>
                        </p>
                    </div>

                    <h1>Register</h1>
                    <div className="flex flex-col">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="username" className="control-label"></label>
                                <input
                                    name="name"
                                    id="name"
                                    placeholder="Username"
                                    className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    value={fields.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email"></label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    value={fields.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password"></label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="rounded-md appearance-none w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    value={fields.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword"></label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Verify password"
                                    className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    value={fields.confirmPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-900 hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                                    value="Register"
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

export default Signup;
