import React, { useState, useEffect } from "react";
import { FaPlus, FaFilter } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { FaFileExport } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import AllSelectedBusiness from "../../Component/AllSelectedBusiness";
import Swal from "sweetalert2";

const AllProduct = () => {
  const navigate = useNavigate();
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get(`https://admin.ezicalc.com/api/product/get/${clientId}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     const fetchedProducts = response.data.data.data || [];
  //     setProductsToDisplay(fetchedProducts);
  //     setFilteredProducts(fetchedProducts); // Set initial filtered products
  //   } catch (error) {
  //     console.error('Error fetching products:', error.response ? error.response.data : error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, [token, clientId]);

  const fetchProducts = async () => {
    try {
      const cacheKey = `products_${clientId}`;
      const cacheTimeKey = `products_${clientId}_timestamp`;
      const cacheValidityDuration = 60 * 60 * 1000; // 1 hour
  
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimeKey);
  
      const now = Date.now();
  
      if (cachedData && cachedTimestamp && (now - cachedTimestamp < cacheValidityDuration)) {
        // Use cached data if within the validity duration
        setProductsToDisplay(JSON.parse(cachedData));
        setFilteredProducts(JSON.parse(cachedData)); // Set initial filtered products from cache
        return;
      }
  
      // Otherwise, make the API call
      const response = await axios.get(`https://admin.ezicalc.com/api/product/get/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const fetchedProducts = response.data.data.data || [];
  
      // Store the fetched data in cache along with the timestamp
      localStorage.setItem(cacheKey, JSON.stringify(fetchedProducts));
      localStorage.setItem(cacheTimeKey, now.toString());
  
      // Update the state with the fetched data
      setProductsToDisplay(fetchedProducts);
      setFilteredProducts(fetchedProducts); // Set initial filtered products
  
    } catch (error) {
      console.error('Error fetching products:', error.response ? error.response.data : error.message);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [token, clientId]);
  
  useEffect(() => {
    if (selectedBusiness) {
      setFilteredProducts(
        productsToDisplay.filter(product =>
          product.businesses.some(business => business.id === selectedBusiness)
        )
      );
    } else {
      setFilteredProducts(productsToDisplay); // Reset to all products if no business is selected
    }
  }, [selectedBusiness, productsToDisplay]);
  

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const products = filteredProducts.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleEdit = (id) => {
    const productToEdit = products.find(product => product.id === id);
    if (productToEdit) {
      navigate('/product/edit-product', { state: { editProduct: productToEdit } });
    } else {
      console.error('Product not found');
    }
  };



  const getPriceRange = (variations) => {
    const prices = variations.map(variation => variation.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { minPrice, maxPrice };
  };




  // console.log(products);

  const handleDelete = async (id) => {
    // Show a confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.get(`https://admin.ezicalc.com/api/product/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.status) {
          Swal.fire('Deleted!', response.data.message || 'SMS deleted successfully.', 'success');
  
          // Remove the deleted SMS from the state
          setProductsToDisplay((prevProd) => prevProd.filter((product) => product.id !== id));
        } else {
          Swal.fire('Error!', response.data.message || 'Failed to delete SMS.', 'error');
        }
      } catch (error) {
        console.error('Error deleting SMS:', error.response ? error.response.data : error.message);
        Swal.fire('Error!', 'Failed to delete SMS.', 'error');
      }
    }
  };

console.log(products)
  return (
    <div className="mx-4 md:mx-10">
      <div className="w-full shadow-sm py-4 flex items-center  rounded-md border border-gray-300">
        <h2 className="px-4 md:text-xl text-sm font-semibold">All Products</h2>
        <div className="ml-auto flex pr-2 items-center">
          <AllSelectedBusiness onBusinessSelect={setSelectedBusiness} />
        </div>
      </div>

      <div className="flex justify-end mt-5 mr-5">
        <Link to="/product/createproduct" className="flex items-center px-4 py-2 bg-[#28DEFC] text-white rounded shadow hover:bg-[#28DEFC] focus:outline-none focus:ring-2 mr-4">
          <FaPlus className="mr-2" />Create
        </Link>
        <button className="flex items-center px-4 py-2 bg-green-400 text-white rounded shadow hover:bg-green-500 focus:outline-none focus:ring-2">
          <FaFilter className="mr-2" />Filter
        </button>
      </div>

      <div className="mt-4 flex justify-between gap-3 items-center px-4">
        <div className="flex items-center space-x-2">
          <select
            className="border border-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg   px-2 py-1"
            id="paginate_input"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
           
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        
        </div>

        <form>
          <div className="max-w-xl w-full">
            <div className="flex space-x-4">
              <div className="flex rounded-md overflow-hidden w-full">
                <input
                  type="text"
                  className="w-full border border-gray-300 p-1 rounded-l-md rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search here"
                />
                <button className="bg-[#537AEE] text-white px-4 py-1 rounded-r-md flex items-center hover:bg-indigo-700 transition">
                  <IoIosSearch className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="overflow-auto xl:overflow-hidden mt-6 mx-5 pb-20">
        <table className="table mb-24">
            <thead className="text-gray-600 bg-[#EFEFEF]">
              <tr>
                <th className="text-[15px]">SL</th>
                <th className="text-[15px]">Image</th>
                <th className="text-[15px]">Name</th>
                <th className="text-[15px]">Business Name</th>
                <th className="text-[15px]">Type</th>
                <th className="text-[15px]">Code</th>
                <th className="text-[15px]">Category</th>
                <th className="text-[15px]">Product Cost</th>
                <th className="text-[15px]">Stock</th>
                <th className="text-[15px]">Action</th>
              </tr>
            </thead>
          <tbody>
          {products.map((product, index) => {
  // Calculate price range for products with variations
  const priceRange = product.has_variation === 1 ? getPriceRange(product.variation_combinations) : null;

  const totalStock = product.has_variation === 1 
  ? product.variation_combinations.reduce((sum, variation) => sum + variation.stock, 0) 
  : product.stock;

  return (
    <tr className="hover" key={product.id}>
      <th className="text-[15px]">{startIndex + index + 1}</th>
      <td>
        <img
          src={`https://admin.ezicalc.com/public/storage/product/${product.image}`}
          alt="Logo"
          className="h-12 w-12"
        />
      </td>
      <td className="text-[15px]">{product.name}</td>
      <td className="text-[15px]">
  {product.businesses.map((business) => business.name).join(', ')}
</td>


      <td className="text-[15px]">
        {product.has_variation === 1 ? 'Variant' : 'Single'}
      </td>
      <td className="text-[15px]">{product.code}</td>
      <td className="text-[15px]">{product.category ? product.category.name : 'N/A'}</td>
      <td className="text-[15px]">
        {product.has_variation === 1
          ? `৳${priceRange.minPrice} - ৳${priceRange.maxPrice}`
          : `৳${product.price}`}
      </td>
      <td className="text-[15px]">{totalStock}pc</td>
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


            <Link  to={{  pathname: "/product/single-product/", }}  state={{ product }} >
            <FaEye className="text-blue-500 text-[20px] pl-1"/>
            View
           </Link>

             
            </li>
            <li>
              <a onClick={() => handleEdit(product.id)}>
                <FaRegEdit className="text-green-500 text-[20px] pl-1" />
                Edit
              </a>
            </li>
            <li>
              <a onClick={() => handleDelete(product.id)}>
                <MdDeleteForever className="text-red-500 text-[20px]" />
                Delete
              </a>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
})}

</tbody>

        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} entries
          </div>
          <div className="">
            <button
              className="btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              « Previous  
            </button>
            <button className="btn px-2">{currentPage}</button>
            <button
              className="btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
