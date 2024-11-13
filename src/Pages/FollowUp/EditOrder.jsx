import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ImSpinner10 } from "react-icons/im";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { FaTimesCircle, FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const EditOrder = ({ products, setFilteredProducts, fetchProducts }) => {

    console.log(products)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [currentStock, setCurrentStock] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [keepAdding, setKeepAdding] = useState(false);
    const [currentId, setCurrentId] = useState(0);

    const location = useLocation();
    const clientId = localStorage.getItem("clientId");
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { order } = location.state || {}; // Retrieve the passed order data
    console.log(order)
    //   const [orderId, setOrderId] = useState("");

    const orderId = order?.id

    const [name, setName] = useState(order ? order.c_name : "");
    const [phone, setPhone] = useState(order ? order.c_phone : "");
    const [courier, setCourier] = useState(order ? order.courier : "");
    const [paymentDate, setPaymentDate] = useState(order ? order.payment_date : "");
    const [address, setAddress] = useState(order ? order.address : "");
    const handleEditSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("client_id", clientId);
        formData.append("order_id", orderId);
        formData.append("c_name", name);
        formData.append("c_phone", phone);
        formData.append("courier", courier);
        formData.append("payment_date", paymentDate);
        // formData.append("payment_method", paymentMethod);
        formData.append("address", address);

        setLoading(true); // Start loading
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        try {
            const response = await axios.post(
                "https://admin.ezicalc.com/api/order/update",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: response.data.message || "Order updated successfully..! ",
                    showConfirmButton: false,
                    timer: 2000,
                });

                // Fetch the latest orders immediately after a successful update
                await fetchOrders(true); // Force refresh

                // Reset form fields
                setName("");
                setPhone("");
                setCourier("");
                setPaymentDate("");
                setPaymentMethod("");
                setAddress("");
                // setOrderId(null);
                setEditModalVisible(false);
                setErrors({});
                handleErrors("");

                // Close the modal programmatically
                document.getElementById("my_modal_edit").checked = false;
            } else {
                const newErrors = response.data.error || {};
                setErrors(newErrors);
                handleErrors(newErrors);
                toast.error(
                    Object.keys(response.data.error)
                        .map((field) => ` ${response.data.error[field][0]}`)
                        .join(" ")
                );
            }
        } catch (error) {
            console.error(
                "Error saving SMS:",
                error.response ? error.response.data : error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleErrors = (newErrors) => {
        setErrors(newErrors);
    };

    const businessId = order?.business_id;
    // console.log(businessId)
    
    const filteredProducts = products.filter(product =>
        product.businesses.some(business => business.id === businessId)
      );
      
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

    const closeModal = () => {
        setModalOpen(false);
      };

      const handleIdChange = (id) => {
        setCurrentId(id);
        console.log(id);
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
            handleIdChange(newId);
    
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
    useEffect(() => {
        console.log(currentPrice); 
      }, [currentPrice]); 
    
  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
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
  const hasAllVariationsSelected =  selectedProduct &&
    (selectedProduct.product_variation.length === 0 ||
      Object.keys(selectedVariations).length ===
        selectedProduct.product_variation.length);
        const [addedProducts, setAddedProducts] = useState(() => {
            const savedProducts = localStorage.getItem("addedProducts");
            return savedProducts ? JSON.parse(savedProducts) : [];
          });
        
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
//   const V_quantities = order.v_product_qty ? order.v_product_qty.split(',') : [];
  const S_quantities = order.s_product_qty ? order.s_product_qty.split(',') : [];
  const v_initialQuantities = order.v_product_qty ? order.v_product_qty.split(',').map(Number) : [];
  
  // State to manage quantities for each product
  const [v_quantities, setQuantities] = useState(v_initialQuantities);

  // Function to increment quantity
  const incrementQuantity = (index) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = (newQuantities[index] || 0) + 1;
      return newQuantities;
    });
  };

  // Function to decrement quantity
  const decrementQuantity = (index) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      if (newQuantities[index] > 1) {
        newQuantities[index] -= 1;
      }
      return newQuantities;
    });
  };

console.log(addedProducts)

    return (
        <div className=' grid md:grid-cols-10 grid-cols-1 gap-6 mx-auto'>


            <div className="relative md:col-span-3 bg-slate-100 col-span-1 rounded-lg p-6 space-y-3 ">


                <h2 className="text-xl font-bold mb-4">Edit Order</h2>

                <div className=' flex flex-row items-center justify-between '>
                    {/* Display Product Image and Name */}
                    {order?.order_products?.map((product) => (
                        <div key={product.id} className="flex gap-3 flex-wrap justify-center items-center mb-4">
                            <img
                                src={`https://admin.ezicalc.com/public/storage/product/${product.image}`}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className=' text-center'>
                                <p className="text-sm font-semibold">
                                    {product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                               {product.code}
                                </p>
                                <p className="text-sm text-gray-500">
                               {product.price}
                                </p>

                            </div>
                        </div>
                    ))}

                </div>

                <div className="mt-5">
      {order?.order_variable_products?.length > 0 ? (
        <div>
          {order.order_variable_products.map((product, index) => (
            <div
              key={index}
              className="border rounded px-2 shadow mb-2 flex justify-between items-center"
            >
              <div className="flex gap-6">
                <div>
                  <img
                    src={`https://admin.ezicalc.com/public/storage/product/${product.product.image}`}
                    className="w-16 h-16 rounded-lg"
                    alt={product.product.name}
                  />
                </div>
                <div>
                  <p className="text-gray-500">
                    {product.values.split(',').join(' | ')}
                  </p>
                  <p className="text-gray-500">৳ {product?.price.toFixed(2)}</p>

                  <div className="flex w-20 h-7 bg-gray-200 py-1 rounded-full items-center justify-center space-x-0 md:space-x-2">
                    <button
                      onClick={() => decrementQuantity(index)}
                      className="bg-slate-200 text-gray-800 p-1 rounded-full hover:text-white hover:bg-sky-400"
                    >
                      <FaMinus size={10} />
                    </button>
                    <p className="text-gray-800">
                      {v_quantities[index] || 1} 
                    </p>
                    <button
                      onClick={() => incrementQuantity(index)}
                      className="bg-slate-200 text-gray-800 p-1 rounded-full hover:text-white hover:bg-sky-400"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>

                  <p className="text-gray-700">
                    Total Price: ৳ {(product.price * (v_quantities[index] || 1)).toFixed(2)}
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
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products added.</p>
      )}
    </div>


                <div className=" mt-5">
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
                        className="w-16 h-16 rounded-lg"
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
          <p className="text-gray-500"></p>
        )}
      </div>

                <form onSubmit={handleEditSave} className=" space-y-4">
                    <div className="flex gap-2 justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                className="bg-white shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-8 text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-1"
                                value={name} // Using state variable
                                onChange={(e) => setName(e.target.value)} // Updating state variable
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Customer Phone
                            </label>
                            <input
                                type="text"
                                className="bg-white shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-8 text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-1"
                                value={phone} // Using state variable
                                onChange={(e) => setPhone(e.target.value)} // Updating state variable
                            />
                        </div>
                    </div>

                    {/* Courier Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Courier
                        </label>
                        <select
                            className="border h-9 border-gray-300 shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-[14px] md:text-[16px] rounded-lg   block w-full p-1"
                            value={courier} // Using state variable
                            onChange={(e) => setCourier(e.target.value)} // Updating state variable
                        >
                            <option value="">Select courier</option>
                            <option value="redx">RedX</option>
                            <option value="steadfast">Steed Fast</option>
                            <option value="sundarban">Sunderban</option>
                            <option value="SA-paribahan">SA-Paribahan</option>
                            <option value="office-delivery">Office Delivery</option>
                        </select>
                    </div>

                    {/* Payment Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Payment Date
                        </label>
                        <input
                            type="date"
                            className="bg-white shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] w-full md:text-[16px] rounded-lg p-1"
                            value={paymentDate}
                            onClick={(e) => e.target.showPicker()}
                            onChange={(e) => setPaymentDate(e.target.value)} // Updating state variable
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <textarea
                            className="appearance-none h-16 md:h-12 border shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500  focus:ring-2 focus:ring-blue-500 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
                            value={address} // Using state variable
                            onChange={(e) => setAddress(e.target.value)} // Updating state variable
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg px-2 py-3 text-white bg-[#28DEFC] hover:bg-[#444CB4] flex justify-center items-center"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <div className="flex justify-center w-full">
                                <ImSpinner10
                                    className="animate-spin text-white"
                                    size={20}
                                />
                                <span className="px-2">Saving Your Edit...</span>
                            </div>
                        ) : (
                            <>
                                <div className=" flex justify-center">
                                    <button type="submit" className=" font-bold text-xl">
                                        Save Edit
                                    </button>
                                </div>
                            </>
                        )}
                    </button>
                </form>
            </div>


            <div className="py-6  md:col-span-7 col-span-1">
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-2">
          {filteredProducts.map((product) => {
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



    );
};

export default EditOrder;
