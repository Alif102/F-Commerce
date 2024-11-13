import React, { useState, useEffect } from "react";
import axios from "axios";
import AllSelectedBusiness from "../../Component/AllSelectedBusiness";

const Customer = ({ onCustomersData }) => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // const cacheKey = `customers_${clientId}`;
        // const cacheTimeKey = `customers_${clientId}_timestamp`;
        // const cacheValidityDuration = 1 * 60 * 60 * 1000; // 1 hour

        // const cachedData = localStorage.getItem(cacheKey);
        // const cachedTimestamp = localStorage.getItem(cacheTimeKey);

        // const now = Date.now();

        // if (cachedData && cachedTimestamp && now - cachedTimestamp < cacheValidityDuration) {
        //   const data = JSON.parse(cachedData);
        //   setCustomers(data);
        //   setFilteredCustomers(data); // Set initial filtered data
        //   onCustomersData(data);
        //   return;
        // }

        const response = await axios.get(
          `https://admin.ezicalc.com/api/customer/get/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data.data || [];
        // localStorage.setItem(cacheKey, JSON.stringify(data));
        // localStorage.setItem(cacheTimeKey, now.toString());
        setCustomers(data);
        setFilteredCustomers(data); 
        onCustomersData(data);
      } catch (error) {
        console.error("Error fetching customers:", error.response ? error.response.data : error.message);
      }
    };

    fetchCustomers();
  }, [clientId, token, onCustomersData]);

  useEffect(() => {
    const applyFilter = () => {
      let filtered = customers;

      if (selectedBusiness) {
        filtered = filtered.filter(
          (customer) => customer.business_id === parseInt(selectedBusiness)
        );
      }

      setFilteredCustomers(filtered);
    };

    applyFilter();
  }, [selectedBusiness, customers]);

  return (
    <div className="mx-4 md:mx-10">
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 justify-between">
        <h2 className="px-4 text-xl font-semibold">Customer</h2>
        <div className="ml-auto flex items-center">
          <AllSelectedBusiness onBusinessSelect={setSelectedBusiness} />
        </div>
      </div>

      <div className="overflow-auto xl:overflow-hidden mt-6 mb-5">
        <table className="table mb-24">
          <thead className="text-gray-600 bg-[#EFEFEF]">
            <tr>
              <th className="text-[15px]">SL</th>
              <th className="text-[15px]">User Name</th>
              <th className="text-[15px]">Order ID</th>
              <th className="text-[15px]">Date</th>
              <th className="text-[15px]">Items</th>
              <th className="text-[15px]">Source</th>
              <th className="text-[15px]">Phone No.</th>
              <th className="text-[15px]">Location</th>
              <th className="text-[15px]">Banned</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr className="hover" key={index}>
                <th className="text-[15px]">{index + 1}</th>
                <td className="text-[15px]">{customer.c_name}</td>
                <td className="text-[15px]">{customer.order_id}</td>
                <td className="text-[15px]">{customer.created_at}</td>
                <td className="text-[15px]">{customer.product_ids}</td>
                <td className="text-[15px]">{customer.source}</td>
                <td className="text-[15px]">{customer.c_phone}</td>
                <td className="text-[15px]">{customer.address}</td>
                <td className="text-[15px]">
                  <input
                    type="checkbox"
                    className="toggle toggle-info scale-75"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customer;
