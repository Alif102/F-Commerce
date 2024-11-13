import React from 'react'
import BillingSection from './BillingSection'
import {  FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
const BillingToggle = () => {
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  return (
    <div>

<div className="lg:hidden">
          <button
            onClick={toggleDropdown}
            className="w-full bg-sky-400 absolute bottom-0 right-0 ml-5  text-white font-semibold py-2 px-4 rounded flex justify-between items-center"
          >
            Billing Section
            {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        <div className="hidden lg:block">
          <BillingSection />
        </div>
        {isDropdownOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <button
            onClick={toggleDropdown}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
          >
            <FaTimesCircle size={24} />
          </button>
          <div className="p-4">
            <BillingSection />
          </div>

          
        </div>
      )}



      
    </div>
  )
}

export default BillingToggle
