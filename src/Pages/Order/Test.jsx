import React from 'react'

const Test = ({userInfo}) => {
  
  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (pic) {
      formData.append('pic', pic);
    }
    formData.append('user_id', userId);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setLoading(true);
    try {
<<<<<<< HEAD
      const cacheKey = `orders_${clientId}`;
      const cacheTimeKey = `orders_${clientId}_timestamp`;
      const cacheValidityDuration = 2 * 60 * 60 * 1000; // 2 hours

      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimeKey);
      const now = Date.now();

      if (cachedData && cachedTimestamp && (now - cachedTimestamp < cacheValidityDuration)) {
        // Use cached data if still valid
        setOrders(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // Otherwise, make the API call
      const response = await axios.get(`https://admin.ezicalc.com/api/orders/all/get/${clientId}`, {
=======
      const response = await axios.post('https://admin.ezicalc.com/api/profile/update', formData, {
>>>>>>> f99247d37b01cdb2e2ccb641ed890dcacc50a892
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // ()
      console.log(response);
      const newErrors = response.data.error || {};
      setErrors(newErrors);
      handleErrors(newErrors);

      if (response.data.error) {
        toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`));
      }

      if (response.data.status) {
       
        toast.success(response.data.message || 'Profile updated successfully!', {
          duration: 2000,
          position: 'top-left',
        });
        
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      
    </div>
  )
}

export default Test
