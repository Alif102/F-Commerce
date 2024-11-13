import React, { useState, useEffect } from "react";
import { FaTimesCircle, FaSearch, FaPlus, FaMinus } from "react-icons/fa";

const ProductList = ({
  filteredProducts,
  setAddedProducts,
  onIdChange,
  selectedCategoryId,
}) => {
  const [products] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [keepAdding, setKeepAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentStock, setCurrentStock] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  console.log(selectedCategoryId)
  const displayProducts = selectedCategoryId
    ? filteredProducts.filter(
        (product) => product.category_id === selectedCategoryId
      )
    : filteredProducts;

 
  console.log(displayProducts);
  useEffect(() => {
  }, [selectedCategoryId, filteredProducts]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedVariations({});

    const currentDate = new Date();

    if (product.product_variation.length === 0) {
        // No variations, handle as a simple product
        const discountEndDate = product.discount_date ? new Date(product.discount_date) : null;
        const isDiscountExpired = discountEndDate ? discountEndDate < currentDate : true;

        // Set price based on discount expiration status
        const finalPrice = product.discount_amount && !isDiscountExpired
            ? product.price - product.discount_amount
            : product.price;

        setCurrentPrice(finalPrice);
        setCurrentStock(product.stock);
    } else {
        // Handle product with variations
        const prices = product.variation_combinations.map(variation => variation.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Check discount for each variation and determine if there's an active discount
        const discountedPrices = product.variation_combinations.map(variation =>
            variation.price - (variation.discount || 0)
        );
        const minDiscountedPrice = Math.min(...discountedPrices);
        const maxDiscountedPrice = Math.max(...discountedPrices);

        const isAnyDiscountActive = product.variation_combinations.some(variation => {
            const variationDiscountEndDate = new Date(variation.discount_date);
            return variation.discount > 0 && variationDiscountEndDate >= currentDate;
        });

        // Set the display price based on discount status
        setCurrentPrice(
            isAnyDiscountActive
                ? (minDiscountedPrice === maxDiscountedPrice ? minDiscountedPrice : `${minDiscountedPrice} - ${maxDiscountedPrice}`)
                : (minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`)
        );

        // Set stock to the total across all variations
        const totalStock = product.variation_combinations.reduce((acc, variation) => acc + variation.stock, 0);
        setCurrentStock(totalStock);
    }

    // Open the modal after setting all required states
    setModalOpen(true);
};

  useEffect(() => {
    console.log(currentPrice); 
  }, [currentPrice]); 
    

  const closeModal = () => {
    setModalOpen(false);
  };
  const handleAddProduct = () => {
    if (selectedProduct) {
      const selectedValues = Object.values(selectedVariations).join(",");

      // Check if the product has variations and if all variations are selected
      const hasAllVariations =
        selectedProduct.product_variation.length === 0 ||
        Object.keys(selectedVariations).length ===
          selectedProduct.product_variation.length;

      if (hasAllVariations) {
        const selectedValues = Object.values(selectedVariations).join(",");

        setAddedProducts((prevAddedProducts) => {
          // Find if the product with the same id and variations already exists
          const existingProductIndex = prevAddedProducts.findIndex(
            (product) =>
              product.id === selectedProduct.id &&
              product.variationValues === selectedValues
          );

          if (existingProductIndex !== -1) {
            // Update the existing product's quantity and total price
            const updatedProducts = [...prevAddedProducts];
            updatedProducts[existingProductIndex] = {
              ...updatedProducts[existingProductIndex],
              quantity:
                updatedProducts[existingProductIndex].quantity + quantity,
              totalPrice:
                updatedProducts[existingProductIndex].price *
                (updatedProducts[existingProductIndex].quantity + quantity),
            };
            return updatedProducts;
          }

          // Add the new product if it doesn't exist
          const productWithQuantity = {
            ...selectedProduct,
            variationValues: selectedValues,
            quantity,
            totalPrice: currentPrice * quantity,
            price: currentPrice,
            stock: currentStock,
          };

          return [...prevAddedProducts, productWithQuantity];
        });

        if (!keepAdding) {
          closeModal();
        } else {
          setQuantity(1);
        }

        // Play beep sound
        const audio = new Audio("/beepSound.wav");
        audio.play();
      }
    }
  };

  const handleVariationChange = (variationType, value) => {
    const updatedVariations = { ...selectedVariations, [variationType]: value };
    setSelectedVariations(updatedVariations);

    const sortedSelectedValues = Object.values(updatedVariations).sort().join(",");

    const combination = selectedProduct.variation_combinations.find(
        (combo) =>
            combo.values.split(",").sort().join(",") === sortedSelectedValues
    );

    if (combination) {
        const newId = `v${combination.id}`;
        setCurrentId(newId);
        onIdChange(newId);

        // Check the discount status for the specific combination
        const variationDiscountEndDate = new Date(combination.discount_date);
        const currentDate = new Date();
        const isDiscountActive = combination.discount > 0 && variationDiscountEndDate >= currentDate;

        // Set the price based on whether the discount is active
        const priceToDisplay = isDiscountActive
            ? combination.price - combination.discount
            : combination.price;

        setCurrentPrice(priceToDisplay);
        setCurrentStock(combination.stock);
    } else {
        // If no valid combination is found, calculate the min-max price range with discounts considered for each variation
        const prices = selectedProduct.variation_combinations.map((variation) => {
            const variationDiscountEndDate = new Date(variation.discount_date);
            const isDiscountActive = variation.discount > 0 && variationDiscountEndDate >= currentDate;
            return isDiscountActive ? variation.price - variation.discount : variation.price;
        });

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setCurrentPrice(
            minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`
        );
        setCurrentStock(0); // Set stock to 0 for unavailable combination
    }
};

  
  

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const hasAllVariationsSelected =  selectedProduct &&
    (selectedProduct.product_variation.length === 0 ||
      Object.keys(selectedVariations).length ===
        selectedProduct.product_variation.length);

        const [searchQuery, setSearchQuery] = useState('');

        // Handler for search input change
        const handleSearchChange = (event) => {
          setSearchQuery(event.target.value);
        };
      
        // Filter products based on search query
        const productsToDisplay = (selectedCategoryId ? displayProducts : filteredProducts).filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
console.log(productsToDisplay)



  return (
    <div>
      <div className="mt-16 flex items-center gap-2 justify-between">
        <h1 className="text-2xl whitespace-nowrap">All Listed Products</h1>
        <div className="">
        <form className="flex items-center justify-end">
        <div className="relative w-full">
          <input
            type="search"
            id="default-search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed"
            placeholder="Search here..."
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
        </div>
      </form>
        </div>
      </div>

      <div className="py-6">
      {productsToDisplay.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-2">
          {productsToDisplay.map((product) => {
    if (product.variation_combinations.length > 0) {
      const prices = product.variation_combinations.map(
        (variation) => variation.price
      );
      const discountedPrices = product.variation_combinations.map(
        (variation) => variation.price - variation.discount
      );
      const stocks = product.variation_combinations.map(
        (variation) => variation.stock
      );
      const discounts = product.variation_combinations.map(
        (variation) => variation.discount
      );
      const discountDates = product.variation_combinations.map(
        (variation) => variation.discount_date
      );
    
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const minDiscountedPrice = Math.min(...discountedPrices);
      const maxDiscountedPrice = Math.max(...discountedPrices);
      const totalStock = stocks.reduce((acc, stock) => acc + stock, 0);
      const maxDiscount = Math.max(...discounts);
      const maxdiscountDate = discountDates[discounts.indexOf(maxDiscount)];
    
      // Get the current date to compare with maxdiscountDate
      const currentDate = new Date();
    
      // Check if the maxdiscountDate has passed
      const isDiscountExpired = new Date(maxdiscountDate) < currentDate;
    
      return (
        <div
          key={product.id}
          onClick={() => openModal(product)}
          className="flex md:flex-row xl:flex-row items-center gap-1 p-1 shadow-lg bg-white rounded-lg cursor-pointer"
        >
          <img
            src={`https://admin.ezicalc.com/public/storage/product/${product.image}`}
            alt={product.name}
            className="w-[50%] rounded-md"
          />
          <div>
            <div className="flex flex-wrap gap-1">
              <h2 className="text-sm font-semibold">
                {product.name.length > 6
                  ? product.name.slice(0, 6) + "..."
                  : product.name}
              </h2>
              <h2 className="text-xs text-gray-400 font-semibold">
                ({totalStock})
              </h2>
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  isDiscountExpired ? "text-gray-600" : "line-through text-gray-600"
                }`}
              >
                {minPrice === maxPrice
                  ? `৳ ${minPrice}`
                  : `৳ ${minPrice} - ${maxPrice}`}
              </p>
              {/* Show discounted price only if the discount is still valid */}
              {!isDiscountExpired && (
                <p className="text-green-600 text-sm">
                  {minDiscountedPrice === maxDiscountedPrice
                    ? `৳ ${minDiscountedPrice} `
                    : `৳ ${minDiscountedPrice} - ${maxDiscountedPrice} `}
                </p>
              )}
            </div>
    
            {/* Uncomment this section if you want to show the discount expiration date */}
            {/* {maxDiscount > 0 && !isDiscountExpired && (
              <p className="text-xs text-green-600">
                Till {maxdiscountDate}
              </p>
            )} */}
          </div>
        </div>
      );
    }
    
      
        
        else {
          const discountedPrice = product.price - product.discount_amount;
        
          // Get the current date
          const currentDate = new Date();
          const discountEndDate = new Date(product.discount_date);
        
          // Check if the discount date has passed
          const isDiscountExpired = discountEndDate < currentDate;
          console.log(isDiscountExpired)
        
          return (
            <div
              key={product.id}
              onClick={() => openModal(product)}
              className="flex p-1 md:flex-row xl:flex-row items-center gap-1 shadow-lg bg-white rounded-lg cursor-pointer"
            >
              <img
                src={`https://admin.ezicalc.com/public/storage/product/${product.image}`}
                alt={product.name}
                className="w-[50%] rounded-md"
              />
              <div className="text-center sm:text-left">
                <div className="flex flex-wrap gap-1">
                  <h2 className="text-sm font-semibold">
                    {product.name.length > 6 ? product.name.slice(0, 6) + "..." : product.name}
                  </h2>
                  <h2 className="text-xs text-gray-400 font-semibold">
                    ({product.stock})
                  </h2>
                </div>
                
                {product.discount_amount && !isDiscountExpired ? (
                  <>
                    <p className="text-gray-600 text-sm font-semibold line-through">
                      ৳ {product.price}
                    </p>
                    <p className="text-green-600 text-sm">
                      ৳ {discountedPrice}
                    </p>
                    {/* <p className="text-green-600 hidden text-xs">
                      Till {product.discount_date}
                    </p> */}
                  </>
                ) : (
                  <p className="text-gray-600 text-sm font-semibold">৳ {product.price}</p>
                )}
              </div>
            </div>
          );
        }
        
          })}
        </div>
      ) : (
        <img
          className="mx-auto"
          src="https://bofrike.in/wp-content/uploads/2021/08/no-product.png"
          alt="No products available."
        />
      )}
    </div>

      <div>
      {modalOpen && selectedProduct && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-96 relative">
      {/* Close button positioned absolutely in the top-right corner */}
      <button
        className="absolute top-2 right-2 py-2 px-4 rounded-md text-sky-400 hover:text-pink-500"
        onClick={closeModal}
      >
        <FaTimesCircle size={24} />
      </button>

      <div className="flex md:justify-between items-center">
        <div className="flex">
          <label className="flex items-center">
            <span className="whitespace-nowrap text-sm">
              Keep Adding Products
            </span>
            <input
              className="toggle toggle-info scale-75"
              type="checkbox"
              checked={keepAdding}
              onChange={() => setKeepAdding(!keepAdding)}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-5 mt-4">
        <div>
          <img
            src={`https://admin.ezicalc.com/public/storage/product/${selectedProduct.image}`}
            alt={selectedProduct.name}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 space-y-3">
          <h2 className="text-xl font-semibold">
            {selectedProduct.name}
          </h2>
          <h2 className="text-sm font-semibold">
            Price: ৳{currentPrice}
          </h2>

          {selectedProduct.product_variation.length > 0 ? (
           <div className="space-y-3">
           {selectedProduct.product_variation.map((variation, index) => (
             <div key={index}>
               <h3 className="text-sm font-semibold">
                 {variation.variation.name}
               </h3>
               <div className="grid grid-cols-2 gap-1">
                 {variation.variaton_values
                   .split(",")
                   .map((value, i) => (
                     <button
                       key={i}
                       onClick={() =>
                         handleVariationChange(
                           variation.variation.name,
                           value
                         )
                       }
                       className={`py-1 px-3 rounded ${
                         selectedVariations[variation.variation.name] === value
                           ? "bg-sky-400 text-white"
                           : "bg-gray-200 hover:bg-sky-400 hover:text-white"
                       }`}
                     >
                       {value}
                     </button>
                   ))}
               </div>
             </div>
           ))}
         </div>
         
          ) : (
            <p className="text-sm font-semibold">
              No variations available
            </p>
          )}

          <h3 className="text-sm font-semibold">
            Available Stock: {currentStock}
          </h3>

          <div className="flex w-20 h-7 bg-gray-200 py-1 rounded-full items-center justify-center space-x-0 md:space-x-2">
            <button
              onClick={handleDecreaseQuantity}
              className="bg-slate-200 text-gray-800 p-1 rounded-full hover:text-white hover:bg-sky-400"
            >
              <FaMinus size={10} />
            </button>
            <span className="text-sm">{quantity}</span>
            <button
              onClick={handleIncreaseQuantity}
              className="bg-slate-200 text-gray-800 p-1 rounded-full hover:text-white hover:bg-sky-400"
            >
              <FaPlus size={10} />
            </button>
          </div>

          <div className="mt-3">
            <button
              onClick={handleAddProduct}
              className={`${
                hasAllVariationsSelected
                  ? "bg-sky-400 hover:bg-blue-600"
                  : "bg-gray-500 cursor-not-allowed"
              } text-white px-4 py-2 rounded`}
              disabled={!hasAllVariationsSelected}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ProductList;
