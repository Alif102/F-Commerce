import {  useState, useMemo } from 'react';
import ToggleButtons from '../ToggleButtons';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import SelectedBusiness from '../../SelectedBusiness';

const BillingSection = ({
  addedProducts,
  setAddedProducts, fetchProducts,
  options,
  onDeleteOption,
  selectedBusiness,
  businessId,
  onSelectBusinesses
}) => {
  const [errors, setErrors] = useState({});

  const handleErrors = (newErrors) => {
    setErrors(newErrors);
  };
  const updateQuantity = (index, change) => {
    const updatedProducts = addedProducts.map((product, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, product.quantity + change);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setAddedProducts(updatedProducts);
  };

  const removeProduct = (indexToRemove) => {
    const updatedProducts = addedProducts.filter((_, index) => index !== indexToRemove);
    setAddedProducts(updatedProducts);
  };

  const removeAllProducts = () => {
    setAddedProducts([]);
  };

  const getMatchingVariationIds = (product) => {
    if (product.has_variation === 1) {
      const valuesSet = new Set(product.variationValues.split(','));
      return product.variation_combinations
        .filter(vc => {
          const vcValuesSet = new Set(vc.values.split(','));
          return [...vcValuesSet].every(value => valuesSet.has(value));
        })
        .map(vc => `v${vc.id}`);
    } else {
      return [product.id];
    }
  };

  // Collect all matching variation IDs for each product
  const productVariations = useMemo(() => {
    return addedProducts.map(product => getMatchingVariationIds(product).join(', '));
  }, [addedProducts]);

  const productsDataArray = addedProducts.map(product => ({
    id: product.id,
    quantity: product.quantity,
    variation: product.has_variation,
    stock: product.stock,
  }));
  
  // console.log(addedProducts);
  // console.log(productsDataArray);
  
  const singleQuantity = productsDataArray
    .filter(product => product.variation === 0)
    .map(product => product.quantity)
    .join(',');
  
  const variationQuantity = productsDataArray
    .filter(product => product.variation === 1)
    .map(product => product.quantity)
    .join(',');
  
  // console.log('Single Quantity:', singleQuantity);
  // console.log('Variation Quantity:', variationQuantity);
  
  

 
  const productIds = productsDataArray.map(product => product.id);
  const productStock = productsDataArray.map(product => product.stock);

  const productIdsString = productIds.join(',');
// console.log(productsDataArray)
  const total = addedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
  return (
    <div className='px-2 py-2 w-[98%] mx-auto shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
      <div className='flex flex-wrap px-4 xl:justify-between justify-center gap-2 items-center mt-1'>
        <h1 className=' text-lg  font-semibold'>Billing Section</h1>
        <div className='hidden lg:block'>
          <SelectedBusiness
            onSelectBusinesses={onSelectBusinesses}  setAddedProducts={setAddedProducts}  
            businessId={0} 
          />
          {errors.business_id && <p className="text-red-500 text-sm float-end">{errors.business_id[0]}</p>}
        </div>
      </div>

      <div className="billing-section px-4 mt-5">
      {addedProducts.length > 0 ? (
          <div>
            {addedProducts.map((product, index) => {
              return (
                <div
                  key={index}
                  className="border rounded px-2 shadow mb-2 flex justify-between items-center"
                >
                  <div className="flex gap-6">
                    <div>
                      <img
                        src={`https://admin.ezicalc.com/public/storage/product/${product.image}`}
                        className="md:w-20 lg:w-24 w-20 rounded-lg"
                        alt={product.name}
                      />
                    </div>
                    <div>
                      {/* <p className="text-gray-800">
                        {getMatchingVariationIds(product).join(', ')}
                      </p> */}
                      <p className="text-gray-500">
                        {product.variationValues.split(',').join(' | ')}
                      </p>
                      <p className="text-gray-500">৳ {product.price.toFixed(2)}</p>
                      
                      <div className="flex w-20 h-7 bg-gray-200 py-1 rounded-full items-center justify-center space-x-0 md:space-x-2">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="bg-slate-200 text-gray-800 p-1 rounded-full hover:text-white hover:bg-sky-400"
                        >
                          <FaMinus size={10} />
                        </button>
                        <p className="text-gray-800">{product.quantity}</p>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="bg-slate-200 text-gray-800 p-1 rounded-full hover:text-white hover:bg-sky-400"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <p className="text-gray-700">
                        Total Price: ৳ {(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeProduct(index)}
                    className="text-white hover:bg-red-400 flex justify-center items-center h-7 px-4 gap-3 py-1 rounded-full bg-sky-400"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No products added yet.</p>
        )}
      </div>

      <ToggleButtons 
        options={options}  fetchProducts={fetchProducts} 
        handleErrors={handleErrors}
        removeAllProducts={removeAllProducts} selectedBusiness={selectedBusiness}
        onDeleteOption={onDeleteOption}  
        businessId={businessId}
        totalPrice={total}   
        productIds={productIdsString} 
        singleQuantity={singleQuantity}
        variationQuantity={variationQuantity}
        setAddedProducts={setAddedProducts}
        productStock={productStock}
        productVariations={productVariations}  // Pass product variations here
      />
    </div>
  );
};

export default BillingSection;

