import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const FraudInput = ({ value, onChange, onDataReceived }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use a memoized function to handle onDataReceived callback
  const memoizedOnDataReceived = useCallback(onDataReceived, []);

  useEffect(() => {
    if (value.length < 11) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://portal.packzy.com/api/v1/fraud_check/${value}`);
        setData(response.data);
        memoizedOnDataReceived(response.data); 
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [value, memoizedOnDataReceived]);

  const calculateDeliveryPercentage = () => {
    if (!data || data.total_parcels === 0) return 0;
    return ((data.total_delivered / data.total_parcels) * 100).toFixed(2);
  };
  const deliveryPercentage = calculateDeliveryPercentage();

  
  return (
    <div>
      <input
        type="text"
        id="fraud_number_check"
        className="bg-white shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-8
          text-[14px] md:text-[16px]  rounded-lg w-full p-1"
        value={value}
        onChange={onChange}
      />
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default FraudInput;
