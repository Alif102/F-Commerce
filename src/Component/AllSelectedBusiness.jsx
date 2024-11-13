import React, { useEffect, useState } from "react";
import Select from 'react-select';
import axios from 'axios';

const AllSelectedBusiness = ({ onBusinessSelect, defaultToFirst = false }) => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const cacheKey = `businesses_${clientId}`;
        const cacheTimeKey = `businesses_${clientId}_timestamp`;
        const cacheValidityDuration = 2 * 60 * 60 * 1000; // 2 hours

        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(cacheTimeKey);

        const now = Date.now();

        if (cachedData && cachedTimestamp && (now - cachedTimestamp < cacheValidityDuration)) {
          const cachedBusinesses = JSON.parse(cachedData);
          setBusinesses(cachedBusinesses);

          if (defaultToFirst && cachedBusinesses.length > 0) {
            const firstBusiness = {
              value: cachedBusinesses[0].id,
              label: cachedBusinesses[0].name,
            };
            setSelectedOption(firstBusiness);
            onBusinessSelect(firstBusiness.value);
          }
          return;
        }

        const response = await axios.get(`https://admin.ezicalc.com/api/business/index/${clientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const fetchedBusinesses = response.data.data || [];
        localStorage.setItem(cacheKey, JSON.stringify(fetchedBusinesses));
        localStorage.setItem(cacheTimeKey, now.toString());
        setBusinesses(fetchedBusinesses);

        if (defaultToFirst && fetchedBusinesses.length > 0) {
          const firstBusiness = {
            value: fetchedBusinesses[0].id,
            label: fetchedBusinesses[0].name,
          };
          setSelectedOption(firstBusiness);
          onBusinessSelect(firstBusiness.value);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, [token, clientId, onBusinessSelect, defaultToFirst]);

  const options = businesses.map(business => ({
    value: business.id,
    label: business.name,
  }));

  const handleChange = (selected) => {
    setSelectedOption(selected);
    if (selected) {
      onBusinessSelect(selected.value);
    }
  };

  return (
    <div className="min-w-[160px] h-10">
      <Select
        options={options}
        onChange={handleChange}
        value={selectedOption}
        placeholder="Select a business..."
      />
    </div>
  );
};

export default AllSelectedBusiness;
