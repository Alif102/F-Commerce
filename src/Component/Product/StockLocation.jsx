import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const StockLocation = ({ locationId, onLocationIdChange }) => {
  const [stockLocations, setStockLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");

  // Caching keys and duration
  const cacheKey = `StockLocations_${clientId}`;
  const cacheTimeKey = `StockLocations_${clientId}_timestamp`;
  const cacheValidityDuration = 2 * 60 * 60 * 1000; // 2 hours

  // Fetch Warehouse Locations with caching
  useEffect(() => {
    const fetchStockLocations = async () => {
      const now = Date.now();
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimeKey);

      // Check if we have valid cached data
      if (cachedData && cachedTimestamp && now - cachedTimestamp < cacheValidityDuration) {
        setStockLocations(JSON.parse(cachedData));
        return;
      }

      try {
        const response = await axios.get(`https://admin.ezicalc.com/api/stock_location/get/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const stockLocations = response.data.data || [];

        // Update cache
        localStorage.setItem(cacheKey, JSON.stringify(stockLocations));
        localStorage.setItem(cacheTimeKey, now.toString());

        setStockLocations(stockLocations);
      } catch (error) {
        console.error("Error fetching Warehouse Locations:", error);
      }
    };

    fetchStockLocations();
  }, [token, clientId]);

  // Update selected location when locationId prop changes
  useEffect(() => {
    if (locationId) {
      const selected = stockLocations.find((location) => location.id === locationId);
      setSelectedLocation(selected ? { value: selected.id, label: selected.name } : null);
    }
  }, [locationId, stockLocations]);

  // Handle location change from select input
  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
    onLocationIdChange(selectedOption ? selectedOption.value : "");
  };

  const locationOptions = stockLocations.map((location) => ({
    value: location.id,
    label: location.name,
  }));

  return (
    <div>
      <Select
        options={locationOptions}
        value={selectedLocation}
        placeholder="Select a location"
        isClearable
        onChange={handleLocationChange}
      />
    </div>
  );
};

export default StockLocation;
