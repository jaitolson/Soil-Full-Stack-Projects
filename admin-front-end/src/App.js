import React from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import User from './components/User.js';
import Products from './components/Products.js';
import Reviews from './components/Reviews.js';



function App() {
  return (
    <Router>
    <div className="App">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path = "/" element = {<Main/>} />
            <Route path = "/user" element = {<User/>}/>
            <Route path = "/product" element = {<Products/>}/>
            <Route path = "/reviews" element = {<Reviews/>}/>




            
        </Routes>
        </main>
        </div>
      </div>   
       </Router>
  );
}

export default App;
