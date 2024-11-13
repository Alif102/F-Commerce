import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker"; // Date Picker Start
import { FaDownload } from "react-icons/fa6";
import { IoMdPrint } from "react-icons/io";

const Report = () => {
  // Download Btn START function
  const handleDownload = () => {
    const data = JSON.stringify({
      name: "John Doe",
      age: 28,
      job: "Software Developer",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([data], { type: "application/json" })
    );
    link.download = "data.json";
    link.click();
  };
  // Download Btn END function

  // Date Picker Start
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };
  // Date Picker End

  {
    /* Print btn START */
  }
  const handlePrint = () => {
    const printContent = document.getElementById("printTableContent").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // To reload the page after printing
  };
  {
    /* Print btn END */
  }

  return (
    <div className="mx-4 md:mx-10">
      <div className="w-full shadow py-4 flex pe-4 mb-5">
        <h2 className="px-4 text-xl font-semibold">Report</h2>
        <div className="ml-auto flex items-center">
          <select
            name="category_id"
            className="shadow-md border border-gray-300 rounded-lg py-1 px-2 text-gray-700 focus:outline-none focus:ring-2   transition duration-150 ease-in-out"
            id="category_id"
          >
            <option value="" disabled selected>
              Business Name
            </option>
            <option value="1">Business Name 1</option>
            <option value="2">Business Name 2</option>
            <option value="3">Business Name 3</option>
            <option value="4">Business Name 4</option>
            <option value="5">Business Name 5</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        {/* Search Bar Start */}
        <div className="flex flex-row flex-wrap items-center space-x-2">
          <select
            className="rounded border border-[#2B2F67] bg-white shadow-md h-8 w-20 flex items-center justify-center"
            id="paginate_input"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50" selected>
              50
            </option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="400">400</option>
            <option value="500">500</option>
          </select>

          {/* Print btn START */}
          <button
            className="bg-[#28DEFC] text-white px-4 py-1 rounded shadow-md flex items-center gap-2"
            onClick={handlePrint}
          >
            <IoMdPrint />
            Print
          </button>
          {/* Print btn END */}

          <button
            className="bg-green-400 text-white px-4 py-1 rounded shadow-md flex items-center gap-2"
            onClick={handleDownload}
          >
            <FaDownload /> Download
          </button>
        </div>

        {/* Date Picker Start */}
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md">
          <Datepicker
            value={value}
            onChange={handleValueChange}
            showShortcuts={true}
          />
        </div>
        {/* Date Picker End */}
      </div>

      {/* Table Content Start */}
      <div
        id="printTableContent"
        className="overflow-auto xl:overflow-hidden mt-6 pb-20"
      >
        <table className="table mb-24">
          <thead className="text-gray-600 bg-[#EFEFEF]">
            <tr>
              <th className="text-[15px]">SL</th>
              <th className="text-[15px]">Image</th>
              <th className="text-[15px]">Code</th>
              <th className="text-[15px]">Category</th>
              <th className="text-[15px]">Quantity</th>
              <th className="text-[15px]">Price</th>
              <th className="text-[15px]">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover">
              <th className="text-[15px]">1</th>
              <td>
                <img src="#" alt="Logo" className="h-8 w-8" />
              </td>
              <td className="text-[15px]">ABC123</td>
              <td className="text-[15px]">Category Name</td>
              <td className="text-[15px]">120</td>
              <td className="text-[15px]">৳188</td>
              <td className="text-[15px]">৳188</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Table Content End */}
    </div>
  );
};

export default Report;
