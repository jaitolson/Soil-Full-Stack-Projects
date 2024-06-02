import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SpecialProducts from "./components/SpecialProducts";
import Checkout from "./pages/Checkout";
import Sigin from "./pages/signin";
import Signup from "./pages/signup";
import MyProfile from "./pages/profile";
import { getEmail, getUser } from "./services/api.js";
import MainLayout from "./components/MainLayout.jsx";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getEmail() != null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    userID:"",
    userBlock:""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (isAuthenticated) {
          const userData = await getUser(getEmail());
          if (userData) {
            console.log(userData.userID);
            setUser({
              name: userData.name,
              email: userData.email,
              userID: userData.userID,
              userBlock: userData.userBlock
            }); 
          } else {
            console.error("Error fetching user data app");
          }
        } else {
          setUser({
            name: "",
            email: "",
            userID: "",
            userBlock: ""
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <Header
            navItems={[
              { href: "/", label: "Home" },
              { href: "/products", label: "Products" },
              { href: "/specials", label: "Specials" }
            ]}
            isLoggedIn={isAuthenticated}
          />
          <Routes>
            <Route element={<MainLayout userData={user} isAuthenticated={isAuthenticated} />}>
              <Route path="/" element={<Home />} />
              <Route path="/specials" element={<SpecialProducts />} />
              <Route path="/products/:id" element={user.userID ? <ProductDetail userID={user.userID} /> : null} />
            </Route>
            <Route path="/signin" element={<Sigin logInUser={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<MyProfile logInUser={setIsAuthenticated} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
