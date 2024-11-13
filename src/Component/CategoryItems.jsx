import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const CategoryItems = ({ categoryId, onCategoryIdChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");

  // Fetch categories when the component mounts
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(`https://admin.ezicalc.com/api/category/get_all/${clientId}`, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });
  //       if (response.data.status) {
  //         setCategories(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };

  //   fetchCategories();
  // }, [token, clientId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cacheKey = `categories_${clientId}`;
        const cacheTimeKey = `categories_${clientId}_timestamp`;
        const cacheValidityDuration = 2 * 60 * 60 * 1000; // 2 hours
    
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(cacheTimeKey);
    
        const now = Date.now();
    
        if (cachedData && cachedTimestamp && (now - cachedTimestamp < cacheValidityDuration)) {
          // Use cached data if within the validity duration
          setCategories(JSON.parse(cachedData));
          return;
        }
    
        // Otherwise, make the API call
        const response = await axios.get(`https://admin.ezicalc.com/api/category/get_all/${clientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        const categories = response.data.data || [];
    
        localStorage.setItem(cacheKey, JSON.stringify(categories));
        localStorage.setItem(cacheTimeKey, now.toString());
  
      
        setCategories(categories);
    
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, [token, clientId]);
  

  // Update selected category when categoryId prop changes
  useEffect(() => {
    if (categoryId) {
      const selected = categories.find(category => category.id === categoryId);
      setSelectedCategory(selected ? { value: selected.id, label: selected.name } : null);
    }
  }, [categoryId, categories]);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);

    if (selectedOption) {
      onCategoryIdChange(selectedOption.value);
    } else {
      onCategoryIdChange(""); // Reset the categoryId when no category is selected
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <div>
      <Select
        options={categoryOptions}
        value={selectedCategory}
        placeholder="Select a category"
        isClearable
        onChange={handleCategoryChange}
      />
    </div>
  );
};

export default CategoryItems;
