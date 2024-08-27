 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell, Legend  } from 'recharts';

const App = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [sortOption, setSortOption] = useState('asc');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
  useEffect(() => {
    document.body.style.backgroundColor = 'yellow'; // Set your desired background color here
    return () => {
      document.body.style.backgroundColor = ''; // Reset the background color when component unmounts
    };
  }, []);
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3002/api/login', { username, password });
  
      if (response.status === 200) {
        console.log('Login successful');
        setIsAuthenticated(true); // Assuming you still want to track the authenticated state for UI purposes
        fetchData(); // Fetch data directly after login
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false); // Reset authentication state if login fails
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false); // Reset authentication state
    setData(null); // Clear data on logout
    setUsername(null);
    setPassword(null)
  };
  

  const fetchData = async (authToken) => {
    try {
      const result = await axios.get('http://localhost:3002/api/data', {
        headers: { Authorization: authToken }
      });
      setData(result.data);
      setFilteredData(result.data); // Initialize with all data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(token);
    }
  }, [isAuthenticated]);

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    const newData = {
      ...data,
      lineChart: data.lineChart.filter(val => val.value > parseInt(filterValue)),
    };
    setFilteredData(newData);
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortOption(sortValue);
    const sortedData = {
      ...filteredData,
      lineChart: [...filteredData.lineChart].sort((a, b) => sortValue === 'asc' ? a.value - b.value : b.value - a.value),
    };
    setFilteredData(sortedData);
  };

  if (!isAuthenticated) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
    );
     
  }

  if (!filteredData) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' ,margin:'50px'}}>
       <div style={{ padding: '20px' }}>
    <h1 style={{
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
      
    }}>
      Dashboard
    </h1>
    
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '20px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: '10px'
      }}
    >
      Logout
    </button>

    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      marginBottom: '20px' 
    }}>
      <div style={{ marginBottom: '10px' }}>
        <label style={{
          marginRight: '10px',
          fontSize: '16px',
          color: '#333'
        }}>
          Filter by Value:
        </label>
        <select
          onChange={handleFilter}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          <option value="0">Show All</option>
          <option value="20">Greater than 20</option>
          <option value="30">Greater than 30</option>
          <option value="40">Greater than 40</option>
          <option value="50">Greater than 50</option>



        </select>
      </div>

      <div>
        <label style={{
          marginRight: '10px',
          fontSize: '16px',
          color: '#333'
        }}>
          Sort by Value:
        </label>
        <select
          onChange={handleSort}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  </div>
      
       

      <div style={{ marginBottom: '20px' }}>
        <h2>Line Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData.lineChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Bar Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData.barChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

     
      <div style={{ marginBottom: '20px' }}>
  <h2>Pie Chart</h2>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={filteredData.pieChart}
        dataKey="value"
        nameKey="segment"
        outerRadius={100}
        fill="#8884d8"
        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
      >
        {filteredData.pieChart.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
        ))}
      </Pie>
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>
    </div>
  );
};

export default App;
