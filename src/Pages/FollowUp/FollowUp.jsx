import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEllipsisV,
  FaTrash,
  FaEye,
  FaTimes,
  FaRegCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import { SlNote } from "react-icons/sl";
import axios from "axios";
import toast from "react-hot-toast";
import AllSelectedBusiness from "../../Component/AllSelectedBusiness";
import InvoiceModal from "../Order/InvoiceModal";
import { ImSpinner10 } from "react-icons/im";

import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const FollowUp = () => {
  const userId = localStorage.getItem("userId");

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [errors, setErrors] = useState({});

  // console.log(selectedBusiness)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("modal-content");
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(
      "<html><head><title>Print Order</title></head><body>"
    );
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const toggleDropdown = (orderId) => {
    setDropdownVisible((prevState) => {
      const newState = {};
      for (const id in prevState) {
        newState[id] = false;
      }
      // Toggle the clicked dropdown
      newState[orderId] = !prevState[orderId];
      return newState;
    });
  };

  const [showTargetAudience, setShowTargetAudience] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const fetchOrders = async (forceRefresh = false) => {
    try {
      const cacheKey = `s_orders_${clientId}`;
      const cacheTimeKey = `s_orders_${clientId}_timestamp`;
      const cacheValidityDuration = 1 * 1000; // 10 seconds


      const now = Date.now();
      let fetchedOrders = [];

      // Check if we should use cached data
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(cacheTimeKey);

        if (
          cachedData &&
          cachedTimestamp &&
          now - cachedTimestamp < cacheValidityDuration
        ) {
          fetchedOrders = JSON.parse(cachedData);
        }
      }

      // If not using cache or forced refresh, fetch fresh data
      if (fetchedOrders.length === 0) {
        const response = await axios.get(
          `https://admin.ezicalc.com/api/schedule/orders/get/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          fetchedOrders = response.data.data.data;
          localStorage.setItem(cacheKey, JSON.stringify(fetchedOrders));
          localStorage.setItem(cacheTimeKey, now.toString());
        } else {
          setError("Failed to fetch orders.");
          return;
        }
      }

      // Apply filters based on checkbox state and selectedBusiness
      if (showTargetAudience) {
        fetchedOrders = fetchedOrders.filter(
          (order) => order.is_target_audience === 1
        );
      } else if (showSchedule) {
        fetchedOrders = fetchedOrders.filter(
          (order) => order.is_target_audience === 0
        );
      }

      const filteredOrders = selectedBusiness
        ? fetchedOrders.filter(
            (order) => order.business_id === selectedBusiness
          )
        : fetchedOrders;

      setOrders(filteredOrders);
    } catch (error) {
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [clientId, token, showTargetAudience, showSchedule, selectedBusiness]);

  const handleTargetAudienceChange = (e) => {
    setShowTargetAudience(e.target.checked);
    setShowSchedule(false); // Uncheck Schedule when Target Audience is checked
  };

  const handleScheduleChange = (e) => {
    setShowSchedule(e.target.checked);
    setShowTargetAudience(false); // Uncheck Target Audience when Schedule is checked
  };

  const handleAddNoteClick = (order) => {
    console.log(order.id);

    setSelectedOrder(order);
    setIsModalOpen(true);

    fetchNotes(order.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Calenderrrr start
  const [scheduleDate, setScheduleDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState({});

  const toggleDateInput = (orderId) => {
    setCalendarVisible((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId], // Toggle the calendar for the specific order
    }));
  };

  const calculateTimeRemaining = (createdAt, orderId) => {
    const timeDiff = calculateTimeRemainingInMs(createdAt);

    if (timeDiff <= 0) {
      return (
        <div className="relative">
          <FaRegCalendarAlt
            size={20}
            className="text-red-500 cursor-pointer"
            onClick={() => toggleDateInput(orderId)}
          />

          {calendarVisible[orderId] && (
            <input
              type="date"
              name="scheduleDate"
              id="scheduleDate"
              value={scheduleDate}
              onClick={handleClick}
              onChange={(e) => {
                setScheduleDate(e.target.value);
                updatePaymentDate(orderId, e.target.value);
              }}
              className="bg-white shadow-[rgba(0,0,0,0.20)_0px_2px_6px] text-[14px] w-full md:text-[16px] rounded-lg p-1 mt-2"
            />
          )}
        </div>
      );
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12";

    return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const calculateTimeRemainingInMs = (createdAt) => {
    const createdDate = new Date(createdAt);
    const timeDiff = Math.max(
      0,
      0.2 * 60 * 60 * 1000 - (Date.now() - createdDate)
    );
    return timeDiff;
  };

  const cacheKey = `s_orders_${clientId}`;
  const cacheTimeKey = `s_orders_${clientId}_timestamp`;

  const updatePaymentDate = async (orderId, newDate) => {
    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/order/change/payment_date",
        {
          order_id: orderId,
          payment_date: newDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        console.log(response.data);
        toast.success(response.data.message);

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, payment_date: newDate } : order
          )
        );

        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimeKey);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating payment date:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Add Note
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/order/note/create",
        {
          order_id: selectedOrder.id,
          body: note,
          created_by: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message);

        // const creatorName = response.data.data?.creator?.name || "Unknown User";

        // Update the notes state with the new note
        setNotes((prevNotes) => [
          ...prevNotes,
          {
            body: note,
            creator: { name: response.data.data?.creator?.name },
            created_at: new Date().toISOString(),
          },
        ]);

        setNote("");
        setErrors({});
      } else {
        const newErrors = response.data.error || {};
        setErrors(newErrors);
        toast.error(
          Object.keys(response.data.error).map(
            (field) => ` ${response.data.error[field][0]}`
          )
        );
      }
    } catch (error) {
      toast.error("Error adding note:", error);
    }
  };

  // get notes

  const [notes, setNotes] = useState([]);
  const fetchNotes = async (orderId) => {
    try {
      const response = await axios.get(
        `https://admin.ezicalc.com/api/order/note/get/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setNotes(
          response.data.data.map((note) => ({
            body: note.body,
            creator: {
              name: note.creator.name,
              id: note.creator.id,
            },
            created_at: note.created_at,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    if (isModalOpen && selectedOrder) {
      setNotes([]);
      setNote("");

      fetchNotes(selectedOrder.id);
    }
  }, [isModalOpen, selectedOrder]);

  const [confirmOrders, setConfirmOrders] = useState([]);

  const fetchConfirmOrder = async (orderId) => {
    try {
      const response = await axios.get(
        `https://admin.ezicalc.com/api/order/schedule/confirm/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        // Remove the confirmed order from the displayed orders
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching order confirmation:", error);
    }
  };
console.log(orders)
  // Edit
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  // const handleEditClick = (order) => {
  //   setSelectedOrderForEdit(order);
  //   setEditModalVisible(true);
  // };
  const navigate =  useNavigate();
  const handleEditClick = (order) => {
    setSelectedOrderForEdit(order);
    navigate('/edit-order', { state: { order } });
  };
  useEffect(() => {
    if (selectedOrderForEdit) {
      setName(selectedOrderForEdit?.c_name || "");
      setPhone(selectedOrderForEdit?.c_phone || "");
      setCourier(selectedOrderForEdit?.courier || "");
      setPaymentDate(selectedOrderForEdit?.payment_date || "");
      setPaymentMethod(selectedOrderForEdit?.payment_method || "");
      setAddress(selectedOrderForEdit?.address || "");
      setOrderId(selectedOrderForEdit?.id || "");
    }
  }, [selectedOrderForEdit]);

  const handleErrors = (newErrors) => {
    setErrors(newErrors);
  };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [courier, setCourier] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [orderId, setOrderId] = useState("");

  const handleEditSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("order_id", orderId);
    formData.append("c_name", name);
    formData.append("c_phone", phone);
    formData.append("courier", courier);
    formData.append("payment_date", paymentDate);
    formData.append("payment_method", paymentMethod);
    formData.append("address", address);

    setLoading(true); // Start loading
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
        setOrderId(null);
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

  const handleClick = (e) => {
    e.target.showPicker(); // Open the date picker when the input is clicked
  };

  console.log(orders);

  //   if (loading) return  <div className="flex flex-col items-center justify-center">
  //   <div className="spinner-border animate-spin inline-block mt-72 w-8 h-8 border-4 rounded-full text-blue-500" role="status"></div>
  //   <span className="  text-blue-500 mt-3">Loading Follow Up...</span>
  // </div>
  //   if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Header Section */}
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 justify-between px-6">
        <h1 className="text-md md:text-2xl font-semibold">Follow Up</h1>
        <AllSelectedBusiness onBusinessSelect={setSelectedBusiness} />
      </div>

      {/* Filters Section */}
      <div className="my-4 flex justify-between gap-3 flex-col md:flex-row">
        <div className="flex items-center space-x-4 ml-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-blue-600"
              checked={showTargetAudience}
              onChange={handleTargetAudienceChange}
            />
            <span className="ml-2">Target Audience</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-blue-600"
              checked={showSchedule}
              onChange={handleScheduleChange}
            />
            <span className="ml-2">Schedule</span>
          </label>
        </div>

        <div className="flex gap-3">
          {/* Dropdown */}
          <select className="bg-white border border-gray-100 rounded-md py-2 px-3 shadow-md sm:text-sm">
            <option value="">Select</option>
            <option value="option1">Recall</option>
            <option value="option2">Bin</option>
          </select>

          {/* Search Field */}
          <div className="flex items-center">
            <input
              type="text"
              className="block w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-md focus:outline-none sm:text-sm"
              placeholder="Search..."
            />
            <button className="px-4 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto my-6">
        <table className="table w-full mb-28">
          <thead className="text-[16px] text-gray-600 bg-[#EFEFEF]">
            <tr className="">
              <th>Customer Id</th>
              <th>Courier</th>
              <th>Business</th>
              <th>Address</th>
              <th>Add Note</th>
              <th>Payment Date</th>
              <th>Status</th>
              {!showTargetAudience ? (
                        <th
                         
                        >
                          Confirm Order
                        </th>
                      ) : <th>
                    
                      </th>
                      }
             
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-[16px]">
            {loading ? (
              // Show loading message while data is being fetched
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <span className="loading loading-ring loading-md"></span>
                  Schedule...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              // Display the orders if data is available
              orders.map((order, index) => {
                const timeDifferenceInMinutes = Math.floor(
                  (new Date() - new Date(order.created_at)) / (1000 * 60)
                );
                const dateToUse = order.payment_date || order.created_at;
                let bgColor = "";
                if (timeDifferenceInMinutes <= 10) {
                  bgColor = "bg-cyan-200";
                } else if (timeDifferenceInMinutes <= 20) {
                  bgColor = "bg-sky-200";
                } else if (timeDifferenceInMinutes <= 40) {
                  bgColor = "bg-indigo-200";
                } else {
                  bgColor = "bg-red-300";
                }

                return (
                  <tr
                    key={order.id || index}
                    className={`${bgColor} ${
                      index % 2 === 1
                        ? "shadow-[rgba(0,_0,_0,_0.24)_0px_1px_5px]"
                        : ""
                    }`}
                  >
                    <td>
                      {order.c_name} <br /> {order.c_phone}
                    </td>
                    <td>{order.courier}</td>
                    <td>{order.business.name }</td>
                    <td>
                      {order.address.length > 20
                        ? `${order.address.substring(0, 15)}.....`
                        : order.address}
                    </td>
                    <td>
                      <button
                        className="text-blue-600 ml-5 hover:text-blue-800"
                        onClick={() => handleAddNoteClick(order)}
                      >
                        <SlNote size={20} />
                      </button>
                    </td>
                    <td>
                      <div className="flex w-80 px-3 py-2 gap-3">
                        <h1>{formatDate(dateToUse)}</h1>
                        <h1>{calculateTimeRemaining(dateToUse, order.id)}</h1>
                      </div>
                    </td>
                    <td>{order.status}</td>
                 
                      {!showTargetAudience && order.is_target_audience !== 1 ? (
                        <td>
                        <button
                          className="btn bg-[#daf5e6] text-[#3AC977] border border-[#daf5e6] hover:bg-[#daf5e6] rounded-lg flex gap-2 py-2 px-3"
                          onClick={() => fetchConfirmOrder(order.id)}
                        >
                          Confirm Order
                        </button>
                        </td>
                      ) : <td>
                      
                      </td>
                      }
                    
                    <td>
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(order.id)}
                          className="p-2 rounded-full hover:bg-gray-100 text-sky-800"
                        >
                          <FaEllipsisV />
                        </button>
                        {dropdownVisible[order.id] && (
                          <ul className="absolute z-10 right-0 w-36 bg-white rounded-md shadow-lg py-2">
                           
                            <li
                              className="flex items-center px-4 py-2 hover:bg-gray-100 text-sky-800 cursor-pointer"
                              onClick={() => handleEditClick(order)}
                            >
                              <FaEdit color="blue" className="mr-2" /> Edit
                            </li>
                            <li className="flex items-center px-4 py-2 hover:bg-gray-100 text-sky-800 cursor-pointer">
                              <FaTrash color="red" className="mr-2" /> Delete
                            </li>
                          </ul>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              // Show this message if there are no orders
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className=" flex flex-col items-center justify-center mt-44">
                    <p className=" my-4 text-xl font-semibold mr-4">
                      No Schedule orders found
                    </p>
                    <img
                      className=" w-[20%] "
                      src="https://cdn-icons-png.flaticon.com/512/6902/6902611.png"
                      alt="No Schedule orders found"
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Viewwwwwwwwwwwwwwwwwwwwwwwwwwww */}

        {modalVisible && (
          <InvoiceModal
            order={selectedOrder}
            onClose={() => setModalVisible(false)}
            onPrint={handlePrint}
          />
        )}

        {/* Editttttttttttttttttttttttttt */}

        {editModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white p-6 space-y-3 rounded-md w-[25%]">
              {/* Close Icon */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setEditModalVisible(false)}
              >
                <IoClose size={25} />
              </button>

              <h2 className="text-xl font-bold mb-4">Edit Order</h2>

              {/* Display Product Image and Name */}
              {selectedOrderForEdit?.order_variable_products?.map((product) => (
                <div key={product.id} className="flex gap-3 items-center mb-4">
                  <img
                    src={`https://admin.ezicalc.com/public/storage/product/${product.product.image}`}
                    alt={product.product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {product.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Code: {product.product.code}
                    </p>
                    <p className="text-sm text-gray-500">
                      Variation: {product.values.split(",").join(" | ")}{" "}
                      {/* Modified this line */}
                    </p>
                  </div>
                </div>
              ))}

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
          </div>
        )}
      </div>

      {/* Modal for Adding Notes */}
      {isModalOpen && selectedOrder && (
        <form
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="bg-white rounded-lg shadow-lg md:w-[30%] w-[90%]">
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="px-2 space-y-2">
              <h1 className="font-semibold">Add Note</h1>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 h-40 border border-gray-300 rounded-md"
                placeholder="Add a note..."
              />
              {errors.body && (
                <p className="text-red-500 text-sm">{errors.body[0]}</p>
              )}
              <div className="flex justify-end ">
                <button
                  type="submit"
                  className="bg-sky-400 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {notes.length > 0 ? (
                  notes.map((note, index) => (
                    <div key={index} className="py-1 rounded-md">
                      <div className=" flex justify-between">
                        <p>{note.creator.name}</p>
                        <p>{formatDate(note.created_at)}</p>
                      </div>
                      <p className="bg-gray-100 p-2 ">{note.body}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No notes available</p>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default FollowUp;
