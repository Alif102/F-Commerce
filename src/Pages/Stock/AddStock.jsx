import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaSpinner } from "react-icons/fa";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AddStock = () => {
  const userId = localStorage.getItem("userId");

  const location = useLocation();
  const { product } = location.state || {};
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(product || null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productStock, setProductStock] = useState(selectedProduct?.stock || 0);

  useEffect(() => {
    fetchProducts();
    fetchLocations();
  }, [token, clientId]);

  useEffect(() => {
    if (selectedProduct) {
      setProductStock(selectedProduct.stock);

      const matchingLocation = locations.find(
        (location) => location.value === selectedProduct.stock_location_id
      );
      setSelectedLocation(matchingLocation || null);
    }
  }, [selectedProduct, locations]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://admin.ezicalc.com/api/product/get/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedProducts = response.data.data.data || [];
      setProductsToDisplay(fetchedProducts);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `https://admin.ezicalc.com/api/stock_location/get/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        const options = response.data.data
          .filter((item) => item.name)
          .map((item) => ({ label: item.name, value: item.id }));
        setLocations(options);
      }
    } catch (error) {
      console.error("Error fetching Warehouse Locations:", error);
    }
  };

  const options = productsToDisplay.map((product) => ({
    value: product.unique_id,
    label: `${product.name} - ${product.code}`,
    ...product,
  }));

  const handleProductChange = (selectedOption) => {
    console.log("Product selected:", selectedOption);

    const matchedProduct = productsToDisplay.find(
      (product) =>
        product.name === selectedOption.name &&
        product.code === selectedOption.code
    );

    if (matchedProduct) {
      setSelectedProduct(matchedProduct);

      const matchingLocation = locations.find(
        (location) => location.value === matchedProduct.stock_location_id
      );

      setSelectedLocation(matchingLocation || null);
      setProductStock(matchedProduct.stock);
    }
  };

  const handleQuantityChange = (index, value, operation) => {
    setSelectedProduct((prevSelectedProduct) => {
      const updatedVariations = [...prevSelectedProduct.variation_combinations];
      const currentStock = updatedVariations[index]?.stock || 0;
  
      if (operation === "input") {
        // Allow empty string or non-negative value
        updatedVariations[index].stock = value === "" ? "" : Math.max(0, value);
      } else if (operation === "increase") {
        // Increment stock
        updatedVariations[index].stock = currentStock + 1;
      } else if (operation === "decrease" && currentStock > 0) {
        // Decrement stock
        updatedVariations[index].stock = currentStock - 1;
      }
  
      return {
        ...prevSelectedProduct,
        variation_combinations: updatedVariations,
      };
    });
  };
  
  
  // const handleInputChange = (index, newValue) => {
  //   setSelectedProduct((prevSelectedProduct) => {
  //     const updatedVariations = [...prevSelectedProduct.variation_combinations];
      
  //     // Only set to a number if newValue is a valid number; otherwise, keep it as an empty string
  //     updatedVariations[index].stock = newValue === "" ? "" : Number(newValue);
  
  //     return {
  //       ...prevSelectedProduct,
  //       variation_combinations: updatedVariations,
  //     };
  //   });
  // };
  
  
  


  const handleProductStockChange = (operation) => {
    setProductStock((prevStock) => {
      const currentStock = prevStock || 0;
      if (operation === "increase") {
        return currentStock + 1;
      } else if (operation === "decrease" && currentStock > 0) {
        return currentStock - 1;
      }
      return currentStock;
    });
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    // If the input is empty, set stock to 0, otherwise parse the value
    setProductStock(value === "" ? "" : Math.max(0, parseInt(value, 10) || 0));
  }

  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!note) {
      toast("Please write a Note 😢");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("user_id", userId);

    if (
      selectedProduct.variation_combinations &&
      selectedProduct.variation_combinations.length > 0
    ) {
      // Variation product case: Include v_product_ids and v_product_qtys
      const newIds =
        selectedProduct.variation_combinations.map(
          (variation) => variation.id
        ) || [];
      const joinedIdsString = newIds.join(",");
      const quantities = selectedProduct.variation_combinations.map(
        (variation) => variation.stock || 0
      );
      const quantitiesString = quantities.join(",");

      formData.append("v_product_ids", joinedIdsString);
      formData.append("v_product_qtys", quantitiesString);
    } else {
      // Single product case: Include s_product_id and s_product_qty
      const selectedProductId = selectedProduct.id || null;
      formData.append("s_product_id", selectedProductId);
      formData.append("s_product_qty", productStock);
    }

    // Always append note
    formData.append("note", note);

    // Debug: Log all formData entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/stock/adjust",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message,
          timer: 2000,
        });
        // Fetch updated products immediately after a successful update
        fetchProducts();
      } else {
        console.error("Failed to update stock:", response.data.message);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while updating stock.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

  return (
    <div className="mx-4 md:mx-10">
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 justify-between">
        <h2 className="px-4 text-xl font-semibold">Add Stock Adjustment</h2>
      </div>

      <div className="flex gap-10 justify-between">
        <div className="w-full">
          <h1 className="font-semibold py-2">Search Product</h1>
          <Select
            options={options}
            value={
              selectedProduct
                ? {
                    value: selectedProduct.unique_id,
                    label: `${selectedProduct.name} - ${selectedProduct.code}`,
                  }
                : null
            }
            onChange={handleProductChange}
            placeholder="Select a product..."
            isLoading={loading}
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>

        <div className="w-full">
          <h1 className="font-semibold py-2">Warehouse Location</h1>
          <Select
            options={locations}
            value={selectedLocation}
            onChange={setSelectedLocation}
            isLoading={loading}
            placeholder="Select Warehouse Location"
            className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>

      <form onSubmit={handleApply}>
        <div className="overflow-x-auto py-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-sky-400 text-white">
              <tr>
                <th className="py-2 px-4 border-b">Product Image</th>
                <th className="py-2 px-4 border-b">Variation</th>
                {/* <th className="py-2 px-4 border-b">Id</th> */}
                <th className="py-2 px-4 border-b">Product Quantity</th>
              </tr>
            </thead>
            <tbody className="h-24 py-7 divide-y divide-gray-200">
              {selectedProduct &&
              selectedProduct.variation_combinations.length > 0
                ? selectedProduct.variation_combinations.map(
                    (variation, index) => (
                      <tr key={index}>
                        <td className="text-center p-5 border-b">
                          <div className="w-16 h-16 mx-auto">
                            <img
                              src={`https://admin.ezicalc.com/public/storage/product/${selectedProduct.image}`}
                              alt={selectedProduct.name}
                              className="object-cover rounded-md"
                            />
                          </div>
                        </td>
                        <td className="py-2 border-b">
                          <div className="flex justify-center gap-2">
                            <h2 className="text-sm rounded-md flex flex-row gap-5 bg-gray-100 px-5 py-1">
                              {variation.values}
                            </h2>
                          </div>
                        </td>
                    
                    <td className="py-2 border-b">
  <div className="flex w-full justify-center gap-2 mx-auto items-center">
    <button
      type="button"
      className="px-3 py-1 border border-gray-200 text-sky-500 rounded-lg cursor-pointer shadow-md"
      onClick={() => handleQuantityChange(index, null, "decrease")}
    >
      <FaMinus />
    </button>
    <input
      type="number"
      value={variation.stock === 0 ? "" : variation.stock || ""}
      onChange={(e) => handleQuantityChange(index, e.target.value === "" ? "" : parseInt(e.target.value, 10), "input")}
      className="w-1/3 text-center border border-gray-300 rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="button"
      className="px-3 py-1 border border-gray-200 text-sky-500 rounded-lg cursor-pointer shadow-md"
      onClick={() => handleQuantityChange(index, null, "increase")}
    >
      <FaPlus />
    </button>
  </div>
</td>
                      </tr>
                    )
                  )
                : selectedProduct && (
                    <tr>
                      <td className="text-center p-5 border-b">
                        <div className="w-16 h-16 mx-auto">
                          <img
                            src={`https://admin.ezicalc.com/public/storage/product/${selectedProduct.image}`}
                            alt={selectedProduct.name}
                            className="object-cover rounded-md"
                          />
                        </div>
                      </td>
                      <td className="py-2 border-b text-center">single</td>
                    
                      <td className="py-2 border-b text-center">
  <div className="flex w-full justify-center gap-2 mx-auto items-center">
    <button
      type="button"
      className="px-3 py-1 border border-gray-200 text-sky-500 rounded-lg cursor-pointer shadow-md"
      onClick={() => handleProductStockChange("decrease")}
    >
      <FaMinus />
    </button>
    <input
      type="number"
      value={productStock}
      onChange={handleInputChange}
      className="w-1/3 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md mx-1"
    />
    <button
      type="button"
      className="px-3 py-1 border border-gray-200 text-sky-500 rounded-lg cursor-pointer shadow-md"
      onClick={() => handleProductStockChange("increase")}
    >
      <FaPlus />
    </button>
  </div>
</td>

                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        <div className="float-right mt-4">
          <h1>
            <b>Note</b>
          </h1>
          <textarea
            className="row-span-3 appearance-none md:h-16 h-auto border shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
            value={note}
            onChange={(e) => setNote(e.target.value)} // Update note state
          ></textarea>

          <div className="flex gap-3 justify-end mt-3">
            <button
              className="btn bg-sky-400 hover:bg-green-400 text-white flex items-center"
              type="submit"
              disabled={submitting}
            >
              {submitting && (
                <FaSpinner className="animate-spin mr-2" /> // Spinner icon
              )}
              {submitting ? "Applying..." : "Apply"}
            </button>
            <button
              type="button"
              className="btn bg-red-500 hover:bg-pink-600 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStock;