import { useState, useEffect } from "react";
import Sidebar from './Sidebar'; // Correct the import path if necessary
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { FaBars } from "react-icons/fa";
import MainContent from './MainContent';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import Register from "../Pages/Register/Register";
import Login from "../Pages/Register/Login/Login";
import Otp from "../Pages/Register/Otp";
import { IoIosNotifications } from "react-icons/io";
import LandingPage from "../LandingPage/LandingPage";
import axios from "axios";
// import logoo from '../../src/assets/panda.png'

function App() {


  const clientId = localStorage.getItem("clientId");

  const token = localStorage.getItem('token'); 
   // User Info
   const [userInfo, setUserInfo] = useState(null);
   const [error, setError] = useState(null);
 
   const fetchUserData = async () => {
    if (!clientId) {
      setError("No user ID found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`https://admin.ezicalc.com/api/dashboard/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
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

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
  }, [clientId, token]); // 

console.log(userInfo)
  //  Low Stock Get
  const [stock, setStock] = useState({ low_stock: '' }); // Set default structure

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `https://admin.ezicalc.com/api/sms/default/get/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setStock(response.data.data.low_stock);
        console.log("API Data fetched: ", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };
  
  useEffect(() => {
    fetchApiData();
  }, [token, clientId]);



  // All Product Fetch

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchProducts = async () => {
    try {
     

      const response = await fetch(
        `https://admin.ezicalc.com/api/product/get/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.status) {
        const products = result.data.data;
      
        setProducts(products);
      } else {
        console.error("Failed to fetch products:", result.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [clientId, token]);
  




  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Initially false
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [hasRendered, setHasRendered] = useState(false); // To handle initial render

  // Function to handle screen size change
  const handleResize = () => {
    if (window.innerWidth < 900) {
      setIsSmallScreen(true); // Detect small screen
      setIsSidebarOpen(false); // Close sidebar by default on small screens
    } else {
      setIsSmallScreen(false); // Larger screens
      setIsSidebarOpen(true); 
    }
  };

  useEffect(() => {
    // Set initial state based on screen size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Set the flag to indicate that the first render has happened
    setHasRendered(true);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSidebarItemClick = () => {
    if (isSmallScreen) {
      setIsSidebarOpen(false); // Only close sidebar on small screens
    }
  };

  

  return (
    <div className="relative">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login userInfo={userInfo} />} />
          <Route path="/otp" element={<Otp userInfo={userInfo} />} />
          <Route 
            path="/*" 
            element={
              token ? (
                hasRendered && ( 
                  <div className="">
                    <Sidebar  
                    userInfo={userInfo}
                    error={error}
                      isOpen={isSidebarOpen} 
                      closeSidebar={handleSidebarItemClick} 
                    /> 
                    
                    {isSmallScreen && isSidebarOpen && (
                      <div 
                        className="fixed inset-0 bg-black opacity-50 z-10" 
                        onClick={toggleSidebar} 
                      ></div>
                    )}

                
                    <div className={`flex-1 min-h-screen transition-all ${isSidebarOpen && !isSmallScreen ? 'ml-64' : 'ml-0'} ${isSidebarOpen && isSmallScreen ? 'shadow-xl' : ''}`}>
                      {/* Header */}
                      <header className={`fixed top-0 left-0 right-0 bg-gradient-custom text-white p-4 flex justify-between items-center z-20 transition-all ${isSidebarOpen && isSmallScreen ? 'shadow-lg' : ''}`} 
                              style={{ height: '60px', marginLeft: isSidebarOpen && !isSmallScreen ? '16rem' : '0' }}>
                        <div className='flex gap-3'>
                          <button onClick={toggleSidebar} className="text-xl">
                            {isSidebarOpen ? <HiMiniBars3CenterLeft /> : <FaBars />}
                          </button>
                          <h1 className="text-2xl font-pollinator">ezicalc</h1>
                          {/* <img className="w-28" src={logoo} alt="logo" srcset="" /> */}
                        </div>
                        <button className="text-xl">
                          <IoIosNotifications size={30}/>
                        </button>
                      </header>

                      {/* Main content with padding to avoid overlap with the fixed header */}
                      <main className="pt-16 p-4 ">
                        <MainContent  
                        onUpdateUserInfo={fetchUserData} userInfo={userInfo}
                        stock={stock}
                        setFilteredProducts={setFilteredProducts} products={products} filteredProducts={filteredProducts }  fetchProducts={fetchProducts} 

                         error={error} />
                      </main>
                    </div>
                  </div>
                )
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
