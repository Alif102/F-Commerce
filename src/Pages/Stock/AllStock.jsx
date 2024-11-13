import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaFileExport } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import AllSelectedBusiness from "../../Component/AllSelectedBusiness";
import { CiMenuKebab } from "react-icons/ci";
import { FaEye, FaRegEdit } from "react-icons/fa";
const AllStock = ({ stock }) => {
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");
 
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState();
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [selectedStockType, setSelectedStockType] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://admin.ezicalc.com/api/product/get/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const products = response.data.data.data || [];
      setFetchedProducts(products);
      filterProducts(products);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (products) => {
    let filtered = selectedBusiness
      ? products.filter((product) => product.business_id === selectedBusiness)
      : products;

    if (selectedStockType) {
      filtered = filtered.filter((product) => {
        const isOutOfStock =
          product.variation_combinations.some(
            (variation) => variation.stock === 0
          ) ||
          (product.variation_combinations.length === 0 && product.stock === 0);
        const hasLowStock =
          product.variation_combinations.some(
            (variation) => variation.stock > 0 && variation.stock <= stock
          ) ||
          (product.stock > 0 && product.stock <= stock);

        if (selectedStockType === "1") return !isOutOfStock && !hasLowStock;
        if (selectedStockType === "2") return hasLowStock;
        if (selectedStockType === "3") return isOutOfStock;
        return true;
      });
    }

    const sorted = filtered.sort((a, b) => a.stock - b.stock);
    setProductsToDisplay(sorted);
  };

  useEffect(() => {
    fetchProducts();
  }, [token, clientId]);

  useEffect(() => {
    filterProducts(fetchedProducts);
  }, [selectedBusiness, selectedStockType, fetchedProducts]);

  const handleStockUpdate = async (productId, newStock) => {
    setLoading(true);
    try {
      await axios.post(
        `https://admin.ezicalc.com/api/product/update-stock/${productId}`,
        { stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
    } catch (error) {
      console.error(
        "Error updating stock:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-4 md:mx-10">
        <div className="mb-5 w-full shadow-sm py-4 flex flex-col md:flex-row space-y-3 items-center rounded-md border border-gray-300 justify-start md:justify-between">
          <h2 className="px-4 text-xl font-semibold">Stock</h2>
          <div className="md:ml-auto md:pr-3 pr-0 flex items-center">
            <Link
              to="/stock/add"
              className="bg-[#28DEFC] whitespace-nowrap text-white font-semibold py-1.5 md:px-6 px-1  mr-5 rounded cursor-pointer"
            >
              Add Stock
            </Link>
            <AllSelectedBusiness  onBusinessSelect={setSelectedBusiness} />
          </div>
        </div>

        <div className="mt-4 flex gap-2 justify-end items-center">
         
           
          
         

          <div className="flex gap-3">
            <select
              name="category_id"
              className="shadow-md border border-gray-300 rounded-lg py-1 px-2  focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
              id="category_id"
              value={selectedStockType}
              onChange={(e) => setSelectedStockType(e.target.value)}
            >
              <option value="" disabled>
                Stock type
              </option>
              <option value="1">Stock in</option>
              <option value="2">Low Stock</option>
              <option value="3">Out Of Stock</option>
            </select>
            <form>
              <div className="max-w-xl w-full">
                <div className="flex space-x-4">
                  <div className="flex rounded-md overflow-hidden w-full">
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-1 rounded-l-md rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search here"
                    />
                    <button className="bg-[#28DEFC] text-white px-4 py-1 rounded-r-md flex items-center">
                      <IoIosSearch className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="overflow-auto xl:overflow-hidden mt-6  pb-20">
          <table className="table mb-24">
            <thead className="text-gray-600 bg-[#EFEFEF]">
              <tr>
                <th className="text-[15px]">SL</th>
                <th className="text-[15px]">Image</th>
                <th className="text-[15px]">Product Name</th>
                <th className="text-[15px]">Code</th>
                <th className="text-[15px]">Transaction type</th>
                <th className="text-[15px]">Stock</th>
                <th className="text-[15px]">Date</th>
                <th className="text-[15px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center text-lg font-semibold">
                    <span className="loading loading-ring loading-md"></span>
                    <p className="text-sm text-sky-500">Loading Stocks...</p>
                  </td>
                </tr>
              ) : (
                productsToDisplay.map((product, index) => {
                  let stockStatus = "Stock In";
                  if (
                    product.variation_combinations.some(
                      (variation) => variation.stock === 0
                    ) ||
                    (product.variation_combinations.length === 0 &&
                      product.stock === 0)
                  ) {
                    stockStatus = "Out of Stock";
                  } else if (product.variation_combinations.length > 0) {
                    const hasLowStock = product.variation_combinations.some(
                      (variation) =>
                        variation.stock > 0 && variation.stock <= stock
                    );
                    stockStatus = hasLowStock ? "Low Stock" : "Stock In";
                  } else if (product.stock > 0 && product.stock <= stock) {
                    stockStatus = "Low Stock";
                  }

                  return (
                    <tr key={product.id} className="hover text-sky-800">
                      <th className="text-[15px]">{index + 1}</th>
                      <td>
                        <img
                          src={`https://admin.ezicalc.com/public/storage/product/${product.image}`}
                          alt={product.name}
                          className="h-16 w-16 object-cover"
                        />
                      </td>
                      <td className="text-[15px]">{product.name}</td>
                      <td className="text-[15px]">{product.code}</td>
                      <td className="text-[15px] ">
                        <button
                          className={`px-2 py-1 w-28 rounded-lg font-semibold ${
                            stockStatus === "Stock In"
                              ? "text-green-700 bg-green-200"
                              : stockStatus === "Low Stock"
                              ? "text-yellow-700 bg-yellow-200"
                              : "text-red-700 bg-red-200"
                          }`}
                        >
                          {stockStatus}
                        </button>
                      </td>
                      <td className="text-[15px] ">
                        {product.variation_combinations.length > 0 ? (
                          <ul>
                            {product.variation_combinations.map((variation) => (
                              <li className="list-none" key={variation.id}>
                                {`${variation.values} - ${variation.stock}`}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          product.stock
                        )}
                      </td>
                      <td className="text-[15px]">
                        {new Date(product.updated_at).toLocaleString()}
                      </td>
                      <td>
                        <div className="dropdown dropdown-end">
                          <button className="text-[20px]">
                            <CiMenuKebab />
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                          >
                            <li>
                              <Link
                                to={{
                                  pathname: "/stock/add",
                                }}
                                state={{ product }}
                              >
                                <FaEye className="text-blue-500 text-[20px] pl-1" />
                                Adjust
                              </Link>
                            </li>
                            <li>
                    <Link  to={{
      pathname: "/stock/log",
    }} 
    state={{ product }} >
                      <FaRegEdit className="text-green-500 text-[20px] pl-1" />
                      Log
                    </Link>
                  </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllStock;
