import React from "react";
import { useState, useEffect } from "react";
import { FaSearch, FaPen } from "react-icons/fa"; // For icons

const CourierReturn = () => {
  const customers = [
    {
      id: 1,
      name: "Customer Name",
      phone: "01712345678",
      address: "Address",
      productName: "Name",
      quantity: "01",
      variation: "Red, M",
      date: "00/00/0000",
    },
    {
      id: 2,
      name: "Customer Name",
      phone: "01712345678",
      address: "Address",
      productName: "Name",
      quantity: "05",
      variation: "Red, M",
      date: "00/00/0000",
    },
    {
      id: 3,
      name: "Customer Name",
      phone: "01712345678",
      address: "Address",
      productName: "Name",
      quantity: "05",
      variation: "Red, M",
      date: "00/00/0000",
    },
  ];

  return (
    <div>
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 justify-between">
        <h2 className="px-4 text-xl font-semibold">Courier Return (Upcoming...)  </h2>
      </div>

      <div className="p-4 mb-5 w-full shadow-sm rounded-md border border-gray-300 justify-between overflow-auto">
        {/* Search Bar */}
        <div className="mb-4 flex items-center space-x-2 border border-gray-300 rounded-md p-2 w-full md:w-[40%]">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="SKU, Product Name, Product Code"
            className="w-full outline-none bg-transparent placeholder-gray-400"
          />
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-collapse ">
            {/* Table Header */}
            <thead className="text-gray-600 bg-[#EFEFEF]">
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Variation</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Note</th>
                <th className="p-3 text-left"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-100 text-sky-800">
                  {/* Image */}
                  <td className="p-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-sm"></div>
                  </td>

                  {/* Customer Name */}
                  <td className="p-3">{customer.name}</td>

                  {/* Phone */}
                  <td className="p-3">{customer.phone}</td>

                  {/* Address */}
                  <td className="p-3">{customer.address}</td>

                  {/* Product Name */}
                  <td className="p-3">{customer.productName}</td>

                  {/* Quantity */}
                  <td className="p-3">{customer.quantity}</td>

                  {/* Variation */}
                  <td className="p-3">{customer.variation}</td>

                  {/* Date */}
                  <td className="p-3">{customer.date}</td>

                  {/* Note */}
                  {/* Inside your table row */}
                  <td className="p-3 flex items-center mt-3">
                    <FaPen className="text-blue-500 cursor-pointer hover:text-blue-700" />
                  </td>

                  {/* Receive Btn */}
                  <td>
                    <button className="text-blue-600 border border-blue-600 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white transition">
                      Received
                    </button>
                  </td>
                </tr>
              ))}

              {/* Empty Rows */}
              <tr className="border-b">
                <td className="p-3" colSpan="9"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourierReturn;
