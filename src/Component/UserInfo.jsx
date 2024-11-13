import { useState, useEffect } from "react";
import axios from "axios";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const clientId = localStorage.getItem('clientId'); 

      if (!clientId) {
        setError("No user ID found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(`https://admin.ezicalc.com/api/dashboard/${clientId}`);
        if (response.data.status) {
          setUserInfo(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("There was an error fetching user data.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {userInfo ? (
        <div>
          <h2 className="text-xl font-semibold">User Information</h2>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>ID:</strong> {userInfo.id}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfo;
