import React, { useEffect, useState } from 'react';
import '../styles/User.css'; // Move styles for the main content here
import { getUsers, blockUser, unblockUser } from '../api/api.js';

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data); // Set the fetched users data to state
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers(); // Call the fetchUsers function when the component mounts
  }, []);

  const toggleBlock = async (user) => {
    try {
      let updatedUser;
      if (user.userBlock === false) {
        await blockUser(user.name);
        updatedUser = { ...user, userBlock: true };
      } else {
        await unblockUser(user.name);
        updatedUser = { ...user, userBlock: false };
      }

      // Update the user in the users array
      const updatedUsers = users.map((u) => (u.userID === updatedUser.userID ? updatedUser : u));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

    } catch (error) {
      console.error('Error toggling block:', error.message);
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  return (
    <div className="user-main">
      <div className="report-container">
        <div className="report-header">
          <h1 className="recent-Articles">Users</h1>
          <div className="search-add-container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search user by name"
              className="search-input"
            />
            <button className="view">View All</button>
          </div>
        </div>

        <div className="report-body">
          <div className="report-topic-heading">
            <h3 className="t-op">ID</h3>
            <h3 className="t-op">Name</h3>
            <h3 className="t-op">Email</h3>
            <h3 className="t-op">Status</h3>
          </div>
          {filteredUsers.map((user) => (
            <div key={user.userID} className="items">
              <div className="item1">
                <h3 className="t-op-nextlvl">{user.userID}</h3>
                <h3 className="t-op-nextlvl">{user.name}</h3>
                <h3 className="t-op-nextlvl">{user.email}</h3>
                <button
                  onClick={() => toggleBlock(user)}
                  className={`t-op-nextlvl ${
                    user.userBlock ? 'bg-red-500' : 'bg-green-500'
                  } text-white font-bold py-1x px-2 rounded`}
                >
                  {user.userBlock ? 'Unblock User' : 'Block User'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default User;
