import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Datepicker from "react-tailwindcss-datepicker";

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const [payments, setPayments] = useState([]);

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://admin.ezicalc.com/api/client/payments/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token, clientId]);

  console.log(payments);

  return (
    <div>
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 justify-between ">
        <h2 className="px-4 text-xl font-semibold">Payment</h2>
      </div>

      <div className="mt-5">
        <div className="bg-white p-6  rounded-md border border-gray-300">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold ">Invoice</h1>
            <div>
              <div className="border relative z-30 border-gray-300 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <Datepicker
                  useRange={false}
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  popoverDirection="down" // Forces the calendar to open downwards
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className=" text-gray-600 bg-[#EFEFEF]  ">
                <tr className="text-left">
                  <th className="px-6 py-3 text-[15px] font-light">SL</th>
                  <th className="px-6 py-3 text-[15px] font-medium">
                    Package Name
                  </th>
                  <th className="px-6 py-3 text-[15px] font-medium">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-[15px] font-medium">Method</th>
                  <th className="px-6 py-3 text-[15px] font-medium">Amount</th>
                  <th className="px-6 py-3 text-[15px] font-medium">Status</th>
                  <th className="px-6 py-3 text-[15px] font-medium">Date</th>
                  <th className="px-6 py-3 text-[15px] font-medium">Action</th>
                </tr>
              </thead>

              <hr />

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="13" className="text-center mt-5">
                      <span className="loading text-sky-500 loading-ring loading-md mt-7"></span>
                      <h1>Loading Payments...</h1>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-none bg-white hover:bg-gray-100 text-sky-800 transition ease-in-out duration-200"
                    >
                      <td className="px-6 py-4 ">{index + 1}</td>
                      <td className="px-6 py-4 ">
                        {payment.package.name}
                      </td>
                      <td className="px-6 py-4 ">
                        {payment.transaction_id}
                      </td>
                      <td className="px-6 py-4 ">
                        {payment.payment_method}
                      </td>
                      <td className="px-6 py-4 ">
                        {payment.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`whitespace-nowrap px-3 py-1 rounded-md text-sm font-semibold  ${
                            payment.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 ">
                        {new Date(payment.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                        ,{" "}
                        {new Date(payment.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="dropdown dropdown-end">
                          <button className="text-[20px]">
                            <CiMenuKebab />
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                          >
                            <li>
                              <a>
                                <FaEye className="text-blue-500 text-[20px] pl-1" />
                                View
                              </a>
                            </li>
                            <li>
                              <a onClick={() => handleDelete(payment.id)}>
                                <MdDeleteForever className="text-red-500 text-[20px]" />
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
