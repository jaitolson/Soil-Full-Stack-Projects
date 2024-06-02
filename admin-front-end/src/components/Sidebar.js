import React from 'react';
import '../styles/Sidebar.css'; // Move styles for the sidebar here
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="navcontainer">
      <nav className="nav">
        <div className="nav-upper-options">
          <div className="nav-option option1">
          <Link to="/">

            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
              className="nav-img"
              alt="dashboard"
            />
            <h3>Dashboard</h3>
            </Link>
          </div>

          <div className="option2 nav-option">
          <Link to="/user">
            
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
              className="nav-img"
              alt="articles"
            />
            <h3>User Functions</h3>
            </Link>
            
          </div>
          

          <div className="nav-option option3">
          <Link to="/product">

            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/5.png"
              className="nav-img"
              alt="report"
            />
            <h3>Product Functions</h3>
            </Link>
          </div>

          <div className="nav-option option4">
          <Link to="/reviews">

            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/6.png"
              className="nav-img"
              alt="institution"
            />
            <h3>Review Functions</h3>
            </Link>

          </div>


       

          <div className="nav-option logout">
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
              className="nav-img"
              alt="logout"
            />
            <h3>Logout</h3>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
