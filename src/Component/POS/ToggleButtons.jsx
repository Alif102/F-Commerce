import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import Default from './BillingSection/Default';
import Data from './BillingSection/Data/Data';
import { useState, useEffect } from 'react';
import Schedule from './BillingSection/Schedule/Schedule';

const ToggleButtons = ({ 
  totalPrice, fetchProducts,
  productIds, 
  productQuantities, selectedBusiness, 
  productStock, 
  businessId, 
  singleQuantity, 
  variationQuantity,  
  setAddedProducts,  
  productVariations, 
  currentId, 
  handleErrors 
}) => {

  const [activeToggle, setActiveToggle] = useState('');

  // Function to remove all products
  const removeAllProducts = () => {
    setAddedProducts([]);  // Clear products
  };

  // Call removeAllProducts when 'data' is active
  useEffect(() => {
    if (activeToggle === 'data') {
      removeAllProducts();  // Call this function when Data is active
    }
  }, [activeToggle]);  // Trigger on activeToggle change

  const handleDataChange = () => {
    setActiveToggle(activeToggle === 'data' ? '' : 'data');
  };

  const handleScheduleChange = () => {
    setActiveToggle(activeToggle === 'schedule' ? '' : 'schedule');
  };

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between items-center">
        <div className="form-control mb-0">
          <label className="label cursor-pointer flex items-center">
            <span className="lg:text-[16px] font-semibold text-gray-600">Data</span>
            <input
              type="checkbox"
              className="toggle toggle-info scale-75"
              checked={activeToggle === 'data'}
              onChange={handleDataChange}
            />
          </label>
        </div>
        <div className="form-control mb-1">
          <label className="label cursor-pointer flex items-center">
            <span className="font-semibold lg:text-[16px] text-gray-600">Schedule</span>
            <input
              type="checkbox"
              className="toggle toggle-info scale-75"
              checked={activeToggle === 'schedule'}
              onChange={handleScheduleChange}
            />
          </label>
        </div>
      </div>

      <div>
        {/* Data Section */}
        {activeToggle === 'data' && (
          <Data  handleErrors={handleErrors}        businessId={businessId}/>
        )}

        {/* Schedule Section */}
        {activeToggle === 'schedule' && (
          <Schedule 
            totalPrice={totalPrice} 
            currentId={currentId} 
            businessId={businessId} 
            productStock={productStock} 
            productQuantities={productQuantities} 
            productIds={productIds}
            productVariations={productVariations} 
            removeAllProducts={removeAllProducts}  selectedBusiness={selectedBusiness}
            singleQuantity={singleQuantity}
            variationQuantity={variationQuantity} 
          />
        )}

        {/* Default Section */}
        {!activeToggle && (
          <Default 
            totalPrice={totalPrice}   fetchProducts={fetchProducts} 
            currentId={currentId} 
            businessId={businessId} 
            productStock={productStock} 
            productQuantities={productQuantities} selectedBusiness={selectedBusiness}
            productIds={productIds}
            productVariations={productVariations} 
            removeAllProducts={removeAllProducts} 
            singleQuantity={singleQuantity}
            variationQuantity={variationQuantity}
            handleErrors={handleErrors}
          />
        )}
      </div>
    </div>
  );
};

export default ToggleButtons;
