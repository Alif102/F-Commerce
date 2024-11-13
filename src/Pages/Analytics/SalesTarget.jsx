import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

import { FaDownload } from "react-icons/fa6";
import { IoMdPrint } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";

// Bar Chart Start
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { name: "Sat", Target: 4000, Achieved: 2400 },
  { name: "Sun", Target: 3000, Achieved: 1398 },
  { name: "Mon", Target: 2000, Achieved: 9800 },
  { name: "Tue", Target: 2780, Achieved: 3908 },
  { name: "Wed", Target: 1890, Achieved: 4800 },
  { name: "Thu", Target: 2390, Achieved: 3800 },
  { name: "Fri", Target: 3490, Achieved: 4300 },
];

const monthlyData = [
  { name: "Week 1", Target: 16000, Achieved: 10400 },
  { name: "Week 2", Target: 12000, Achieved: 8398 },
  { name: "Week 3", Target: 14000, Achieved: 11000 },
  { name: "Week 4", Target: 10000, Achieved: 7400 },
];

const yearlyData = [
  { name: "Jan", Target: 12000, Achieved: 10400 },
  { name: "Feb", Target: 11000, Achieved: 9000 },
  { name: "Mar", Target: 14000, Achieved: 12000 },
  { name: "Apr", Target: 15000, Achieved: 12500 },
  { name: "May", Target: 16000, Achieved: 13000 },
  { name: "Jun", Target: 17000, Achieved: 14000 },
  { name: "Jul", Target: 18000, Achieved: 15000 },
  { name: "Aug", Target: 19000, Achieved: 16000 },
  { name: "Sep", Target: 20000, Achieved: 17000 },
  { name: "Oct", Target: 21000, Achieved: 18000 },
  { name: "Nov", Target: 22000, Achieved: 19000 },
  { name: "Dec", Target: 23000, Achieved: 20000 },
];

// Bar Chart End

const SalesTarget = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  {
    /* Date Picker Start */
  }
  return (
    <div className="mx-4 md:mx-10">
      <div className="w-full shadow py-4 flex pe-4 mb-5">
        <h2 className="px-4 text-xl font-semibold">Sales Target</h2>
        <div className="ml-auto flex items-center gap-4">
          <label
            htmlFor="sales_target"
            className="bg-[#28DEFC] text-white font-semibold py-1 px-6 mr-5 rounded cursor-pointer"
          >
            Add
          </label>

          {/* Modal Start */}
          <input type="checkbox" id="sales_target" className="modal-toggle" />
          <div
            className="modal"
            onClick={() =>
              (document.getElementById("sales_target").checked = false)
            }
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between font-bold pb-3 px-2">
                <p className="text-2xl">Set Sales Target</p>
                <label
                  htmlFor="sales_target"
                  className="text-3xl cursor-pointer"
                >
                  <IoClose />
                </label>
              </div>

              <details className=" relative">
                <summary className="btn font-semibold px-4 py-2 rounded-lg shadow-md cursor-pointer w-full">
                  Select Employee
                </summary>
                <ul className="menu dropdown-content absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg w-full shadow-lg z-10">
                  <li>
                    <a className="block px-4 py-2">Employee 1</a>
                  </li>
                  <li>
                    <a className="block px-4 py-2">Employee 2</a>
                  </li>
                </ul>
              </details>

              <div className="flex flex-col my-3 mx-1">
                <b>Weekly :</b>
                <input
                  type="number"
                  placeholder="Set target"
                  className="input input-bordered w-full focus:outline-none"
                />
              </div>

              <div className="flex flex-col my-3 mx-1">
                <b>Monthly :</b>
                <input
                  type="number"
                  placeholder="Set target"
                  className="input input-bordered w-full focus:outline-none"
                />
              </div>

              <div className="flex flex-col my-3 mx-1">
                <b>Yearly :</b>
                <input
                  type="number"
                  placeholder="Set target"
                  className="input input-bordered w-full focus:outline-none"
                />
              </div>

              <div className="modal-action">
                <label
                  htmlFor="sales_target"
                  className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white"
                >
                  Save
                </label>
              </div>
            </div>
          </div>

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
          <button className="bg-[#28DEFC] text-white px-4 py-1 rounded shadow-md flex items-center gap-2">
            <IoMdPrint />
            Print
          </button>
          <button className="bg-green-400 text-white px-4 py-1 rounded shadow-md flex items-center gap-2">
            <FaDownload />
            Download
          </button>
        </div>

        <div className="flex gap-3">
          <select
            name="category_id"
            className="shadow-md border border-gray-300 rounded-lg py-1 px-2 text-gray-700 focus:outline-none focus:ring-2   transition duration-150 ease-in-out"
            id="category_id"
          >
            <option value="" disabled selected>
              Employee Name
            </option>
            <option value="1">Employee 1</option>
            <option value="2">Employee 2</option>
            <option value="3">Employee 3</option>
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

      <div className="md:flex-row justify-between flex flex-col">
        {/* Bar Chart Start */} {/* Weekly */}
        <div className="md:w-[32%] w-[100%] mt-4">
          <div className="shadow-[0_3px_10px_rgb(0,0,0,0.1)] rounded-lg flex h-72 xl:h-auto">
            <div className="flex-col hidden xl:flex pl-2 pt-8">
              <b className="text-lg font-semibold mb-3 text-gray-700 whitespace-nowrap">
                Weekly Target
              </b>
              <div className="mb-4 relative pl-4">
                <div className="absolute left-0 top-0 h-full border-l-2 border-gray-300"></div>
                <p className="text-sm font-medium text-gray-600">Achievement</p>
                <p className="text-xl font-bold text-gray-800">00</p>
              </div>
              <div className="mb-4 relative pl-4">
                <div className="absolute left-0 top-0 h-full border-l-2 border-gray-300"></div>
                <p className="text-sm font-medium text-gray-600">Target</p>
                <p className="text-xl font-bold text-gray-800">00</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <b className="xl:hidden flex justify-center text-lg font-semibold text-gray-700 whitespace-nowrap">
                Weekly Target
              </b>
              <BarChart
                data={salesData}
                margin={{
                  top: 10,
                  right: 30,
                  bottom: 15,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="name" tick={{ fill: "#333" }} />
                <YAxis
                  tick={{ fill: "#333" }}
                  domain={[0, "dataMax"]}
                  tickCount={5}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", color: "#fff" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Target" fill="#28DEFC" />
                <Bar dataKey="Achieved" fill="pink" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Bar Chart End */}
        {/* Bar Chart Start */} {/* Monthly */}
        <div className="md:w-[32%] w-[100%] mt-4">
          <div className="shadow-[0_3px_10px_rgb(0,0,0,0.1)] rounded-lg flex h-72 xl:h-auto">
            <div className="flex-col hidden xl:flex pl-2 pt-8">
              <b className="text-lg font-semibold mb-3 text-gray-700 whitespace-nowrap">
                Monthly Target
              </b>
              <div className="mb-4 relative pl-4">
                <div className="absolute left-0 top-0 h-full border-l-2 border-gray-300"></div>
                <p className="text-sm font-medium text-gray-600">Achievement</p>
                <p className="text-xl font-bold text-gray-800">00</p>
              </div>
              <div className="mb-4 relative pl-4">
                <div className="absolute left-0 top-0 h-full border-l-2 border-gray-300"></div>
                <p className="text-sm font-medium text-gray-600">Target</p>
                <p className="text-xl font-bold text-gray-800">00</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <b className="xl:hidden flex justify-center text-lg font-semibold text-gray-700 whitespace-nowrap">
                Monthly Target
              </b>
              <BarChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 30,
                  bottom: 15,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="name" tick={{ fill: "#333" }} />
                <YAxis
                  tick={{ fill: "#333" }}
                  domain={[0, "dataMax"]}
                  tickCount={5}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", color: "#fff" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Target" fill="#28DEFC" />
                <Bar dataKey="Achieved" fill="pink" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Bar Chart End */}
        {/* Bar Chart Start */} {/* Yearly */}
        <div className="md:w-[32%] w-[100%] mt-4">
          <div className="shadow-[0_3px_10px_rgb(0,0,0,0.1)] rounded-lg flex h-72 xl:h-auto">
            <div className="flex-col hidden xl:flex pl-2 pt-8">
              <b className="text-lg font-semibold mb-3 text-gray-700 whitespace-nowrap">
                Yearly Target
              </b>
              <div className="mb-4 relative pl-4">
                <div className="absolute left-0 top-0 h-full border-l-2 border-gray-300"></div>
                <p className="text-sm font-medium text-gray-600">Achievement</p>
                <p className="text-xl font-bold text-gray-800">00</p>
              </div>
              <div className="mb-4 relative pl-4">
                <div className="absolute left-0 top-0 h-full border-l-2 border-gray-300"></div>
                <p className="text-sm font-medium text-gray-600">Target</p>
                <p className="text-xl font-bold text-gray-800">00</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <b className="xl:hidden flex justify-center text-lg font-semibold text-gray-700 whitespace-nowrap">
                Yearly Target
              </b>
              <BarChart
                data={yearlyData}
                margin={{
                  top: 10,
                  right: 30,
                  bottom: 15,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="name" tick={{ fill: "#333" }} />
                <YAxis
                  tick={{ fill: "#333" }}
                  domain={[0, "dataMax"]}
                  tickCount={5}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", color: "#fff" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Target" fill="#28DEFC" />
                <Bar dataKey="Achieved" fill="pink" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Bar Chart End */}
      </div>

      {/* Employee Table */}
      <div className="  mt-6 ">
        <table className="table mb-24">
          <thead className="text-gray-600 bg-[#EFEFEF]">
            <tr>
              <th className="text-[15px]">SL</th>
              <th className="text-[15px]">Name</th>
              <th className="text-[15px]">User ID</th>
              <th className="text-[15px]">This Months Target</th>
              <th className="text-[15px]">Total Sale Generated</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover">
              <td className="text-[15px]">1</td>
              <td className="text-[15px]">Tanmay</td>
              <td className="text-[15px]">ABC123</td>
              <td className="text-[15px]">20,000</td>
              <td className="text-[15px]">13,156</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTarget;
