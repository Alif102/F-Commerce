import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { 
  FaTachometerAlt, FaCogs, FaBox, FaTags, FaShoppingCart, FaClipboardList, FaWarehouse,
  FaCashRegister, FaChartLine, FaCreditCard, FaBullhorn, FaShareAlt, FaRegEnvelope, 
  FaUser, FaLock, FaUserGraduate 
} from 'react-icons/fa';

// Define a mapping from icon names to React Icons
const iconMap = {
  FaTachometerAlt,
  FaCogs,
  FaBox,
  FaTags,
  FaShoppingCart,
  FaClipboardList,
  FaWarehouse,
  FaCashRegister,
  FaChartLine,
  FaCreditCard,
  FaBullhorn,
  FaShareAlt,
  FaRegEnvelope,
  FaUser,
  FaUserGraduate,
  FaLock
};

const Sidebar = ({ isOpen, closeSidebar, userInfo, error }) => {
  const navigate = useNavigate();

  if (error) return <div className="text-red-500">{error}</div>;

  // Menu Items
  const [menuItems, setMenuItems] = useState([]);
  const [openMenu, setOpenMenu] = useState('');

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get('/sidebarData.json');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      }
    };

    fetchMenuData();
  }, []);

  const handleToggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? '' : menu);
  };

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };
console.log(userInfo)
  return (
    <aside className={`fixed top-0 left-0 h-full bg-sidebar-gradient-custom text-white font-semibold py-4 transition-transform z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}>
      <nav className="flex flex-col h-full">
        <div className={`${isOpen ? "block" : "hidden"} flex-col items-center text-center mb-4`}>
          <img
            src={`https://admin.ezicalc.com/public/storage/user/${userInfo?.pic}`}
            alt="User"
            className="rounded-full w-16 h-16 mx-auto"
          />
          {userInfo ? (
            <div>
              <p className="text-xl font-bold mt-2">{userInfo?.name}</p>
              <p className="text-gray-200 font-semibold">User Id : {userInfo?.id}</p>
              <h2 className="text-gray-200 font-semibold">Referral ID: 7891011</h2>
              <h2 className="text-gray-200 font-semibold">{userInfo?.package_name}</h2>
              <h2 className="text-gray-200 font-semibold">50 SMS</h2>
              <h2 className="text-gray-200 font-semibold">Expiry : <span className='text-white'>15 Days Free Trial</span></h2>
            </div>
          ) : (
            <span className="loading loading-ring loading-xs"></span>
          )}
        </div>
        {/* Wrapper for scrollable menu */}
        <div className="scrollbar-thin overflow-y-auto">
          <ul>
            {menuItems.map(item => (
              <React.Fragment key={item.title}>
                {/* Check for role_id before rendering specific items */}
                {(userInfo?.role_id === 2 && [  'Marketing'].includes(item.title)) ? null : (
                  <React.Fragment>
                    {userInfo?.package_id == null && item.title !== 'Subscription' ? (
                      <li className="flex items-center ml-6 py-2 opacity-50 cursor-not-allowed">
                        {item.icon && React.createElement(iconMap[item.icon], { className: 'mr-3' })}
                        <span>{item.title}</span>
                      </li>
                    ) : (
                      <>
                        {item.submenu ? (
                          <>
                            <li onClick={() => handleToggleMenu(item.title)} className="flex cursor-pointer ml-6 items-center py-3">
                              {item.icon && React.createElement(iconMap[item.icon], { className: 'mr-3' })}
                              <span>{item.title}</span>
                              <button className="ml-auto">
                                {openMenu === item.title ? <FaCaretUp /> : <FaCaretDown />}
                              </button>
                            </li>
                            {openMenu === item.title && (
                              <ul className="ml-8">
                                {item.submenu.map(subItem => (
                                  <li key={subItem.title} className="py-2 list-none">
                                    <NavLink 
                                      to={subItem.path} 
                                      className={({ isActive }) => 
                                        isActive 
                                          ? "bg-sky-700 text-white font-semibold p-2 w-full rounded flex items-center"
                                          : "p-2 w-full text-gray-100 hover:bg-sky-500 hover:text-white font-semibold rounded flex items-center"
                                      } 
                                      onClick={closeSidebar}
                                    >
                                      {item.icon && React.createElement(iconMap[item.icon], { className: 'mr-4' })}
                                      {subItem.title}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          /* Render the item without submenu */
                          <li className="flex items-center py-2">
                            <NavLink 
                              to={item.path} 
                              className={({ isActive }) => 
                                isActive 
                                  ? "bg-sky-700 text-white font-semibold p-2 w-full rounded flex items-center ml-4"
                                  : "p-2 w-full text-gray-100 hover:bg-sky-500 hover:text-white font-semibold ml-4 rounded flex items-center"
                              } 
                              onClick={closeSidebar}
                            >
                              {item.icon && React.createElement(iconMap[item.icon], { className: 'mr-3' })}
                              {item.title}
                            </NavLink>
                          </li>
                        )}
                      </>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
            <div onClick={handleSignOut} className="cursor-pointer px-5 flex gap-3 hover:bg-sky-700 py-3 items-center">
              <MdLogout size={24} />
              <h1 className="text-slate-200">Sign Out</h1>
            </div>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
