import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

const LowStock = () => {
  const token = localStorage.getItem("token");
  // const userId = localStorage.getItem("userId");
  const clientId = localStorage.getItem("clientId");

  const [lowStock, setLowStock] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleErrors = (newErrors) => {
    setErrors(newErrors);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("client_id", clientId);
    // formData.append('user_id', userId);

    formData.append("low_stock", lowStock);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/sms/default/set",
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
          title: response.data.message || "Low Stock Added successfullyyyy!",
          showConfirmButton: false,
          timer: 2000,
        });

        // Reset form fields
        setLowStock(null);

        handleErrors("");
      } else {
        const newErrors = response.data.error || {};
        setErrors(newErrors);
        handleErrors(newErrors);

        toast.error(
          Object.keys(response.data.error).map(
            (field) => ` ${response.data.error[field][0]}`
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(lowStock);
  const [stock, setStock] = useState({ low_stock: "" }); // Set default structure

  // Fetch API data
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
        setStock(response.data.data);
        console.log("API Data fetched: ", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, [token, clientId]);

  // Set lowStock based on fetched stock
  useEffect(() => {
    if (stock) {
      setLowStock(stock.low_stock);
    }
  }, [stock]);

  console.log(stock);

  return (
    <div className="mx-4 md:mx-10">
      <div className="w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300  mb-5">
        <h2 className="px-4 text-xl font-semibold">Low Stock Management</h2>
      </div>

      <div>
        <form
          onSubmit={handleSave}
          className="shadow-sm pb-4 mb-4 rounded-md border border-gray-300"
        >
          <br />
          <div className="mx-5 my-3">
            <div className=" text-lg">
              <div className="w-[100%] lg:w-[100%] text-left mb-5">
                Low Stock Quantity
              </div>
              <div className="w-3/4">
                <input
                  type="number"
                  value={lowStock} // Use lowStock state here
                  onChange={(e) => setLowStock(e.target.value)}
                  placeholder="Stock Quantity"
                  className="w-[50%] py-4 px-5 hover:border-blue-500 focus:outline-none shadow-sm rounded-md border border-gray-300 resize-none"
                />
                {errors.low_stock && (
                  <p className="text-red-500 text-sm">{errors.low_stock[0]}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 mx-20">
            <button
              className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <FaSpinner className="animate-spin mr-2" /> // Spinner icon
              )}
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LowStock;
