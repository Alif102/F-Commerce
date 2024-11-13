import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FraudCheck = ({ fraudNumberCheck, setPhoneNumber }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown visibility

  useEffect(() => {
    if (!fraudNumberCheck) {
      setData(null); // Reset data if input is empty
      setShowDropdown(false); // Hide dropdown if input is empty
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state before the new request
      try {
        const response = await axios.get(`https://portal.packzy.com/api/v1/fraud_check/${fraudNumberCheck}`);
        setData(response.data);
        setShowDropdown(true); // Show dropdown when data is available
      } catch (err) {
        setError(err.message);
        setShowDropdown(false); // Hide dropdown if there's an error
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Cleanup on unmount
  }, [fraudNumberCheck]);

  // Calculate percentage of total parcels
  const calculatePercentage = () => {
    if (!data || data.total_parcels === 0 || data.total_delivered === 0) return 0;
    return ((data.total_parcels / data.total_delivered) * 100).toFixed(2);
  };

  const percentage = calculatePercentage();

  return (
    <div className="relative">
      <input
        type="text"
        id="first_name"
        className="bg-white shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-8
          text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-1"
        value={fraudNumberCheck}
        onChange={(e) => setPhoneNumber(e.target.value)} // Update phoneNumber here
      />

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {/* Dropdown with progress bar */}
      {showDropdown && data && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md  ">
          <li className="p-2 cursor-pointer">
            <div className="text-sm mb-2">{`SteadFast ${percentage}%`}</div>
            {/* Progress bar */}
            <div className="relative w-full h-4 bg-gray-300 rounded-full">
              <div
                className={`absolute h-full ${percentage > 50 ? 'bg-green-500' : 'bg-red-500'} rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div>
      <FraudCheck fraudNumberCheck={phoneNumber} setPhoneNumber={setPhoneNumber} />
    </div>
  );
};

export default App;
