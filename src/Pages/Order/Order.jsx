import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsBoxes } from "react-icons/bs";
import sampleImage from '../../assets/unnamed.png';

import {
  FaEllipsisV,
  FaEye,
  FaTrash,
  FaSearch,
  FaRegEdit,
} from "react-icons/fa";
import Datepicker from "react-tailwindcss-datepicker";
import { printInvoice } from "./InvoicePrint";
import AllSelectedBusiness from "../../Component/AllSelectedBusiness";
import InvoiceModal from "./InvoiceModal";
import { MdDeleteForever } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import Swal from "sweetalert2";
import { FcPrint } from "react-icons/fc";
import { TfiPrinter } from "react-icons/tfi";

const Order = () => {
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");
  const [displayOrders, setDisplayOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
 
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(selectedBusiness);
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
  useEffect(() => {
    const fetchOrders = async () => {
      // const localStorageKey = `orders_${clientId}`;
      // const cachedData = localStorage.getItem(localStorageKey);
      // const now = Date.now();

      // if (cachedData) {
      //   const { timestamp, orders } = JSON.parse(cachedData);
      //   if (now - timestamp < 2 * 60 * 1000) {
      //     setDisplayOrders(orders);
      //     setFilteredOrders(orders);
      //     return;
      //   }
      // }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://admin.ezicalc.com/api/orders/all/get/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          const orders = response.data.data.data;
          setDisplayOrders(orders);
          setFilteredOrders(orders);

          // localStorage.setItem(
          //   localStorageKey,
          //   JSON.stringify({ timestamp: now, orders })
          // );
        } else {
          console.error("Failed to fetch orders:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [clientId, token]);

  // Filter orders based on selected business, date range, and search term
  useEffect(() => {
    let filtered = displayOrders;

    // Filter by selected business if applicable
    if (selectedBusiness) {
      filtered = filtered.filter((order) => order.business_id === selectedBusiness);
    }

    // Filter by selected date range if both start and end dates are selected
    if (value.startDate && value.endDate) {
      const start = new Date(value.startDate);
      const end = new Date(value.endDate);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= start && orderDate <= end;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((order) =>
        // (order.creator.name && order.creator.name.toLowerCase().includes(lowerSearchTerm)) ||
        (order.c_name && order.c_name.toLowerCase().includes(lowerSearchTerm)) ||
        (order.c_phone && order.c_phone.includes(lowerSearchTerm))
      );
    }

    setFilteredOrders(filtered);
  }, [selectedBusiness, value, displayOrders, searchTerm]);
  

 

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
  };

  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Select/Deselect all orders
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]); // Deselect all
    } else {
      setSelectedOrders(orders.map(order => order.id)); // Select all
    }
    setSelectAll(!selectAll);
  };

  // Toggle individual order selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter(id => id !== orderId)
        : [...prevSelected, orderId]
    );
  };
  const handlePrintAllInvoices = () => {
    const getBackgroundColor = (index) => {
      const colors = ['#f8f9fa', '#e9ecef', '#f1f3f5', '#dee2e6', '#ced4da']; // Define your background colors
      return colors[index % colors.length]; 
    };
  
    const selectedOrderDetails = orders
      .filter(order => selectedOrders.includes(order.id)) 
      .map(order => ({
        c_name: order.c_name,
        logo: order.business.logo,
        outside_dhaka: order.business.outside_dhaka,
        cod_amount: order.cod_amount,
        discount_amount: order.discount_amount,
        item_total: order.item_total,
        advance: order.advance,
        delivery_charge: order.delivery_charge,
        c_phone: order.c_phone,
        address: order.address,
        order_products: order.order_products,
        order_variable_products: order.order_variable_products,
        s_product_qty: order.s_product_qty,
        v_product_qty: order.v_product_qty,
        businessName: order.business.name,
        businessAddress: order.business.address,
        businessPhone: order.business.phone,
      }));
  
    const printContent = selectedOrderDetails
      .map((details, index) => `
        <div class="w-full  mb-8 p-6" style="background-color: ${getBackgroundColor(index)}; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"> 
          <div class="flex gap-8 justify-between mb-4">
            <div>
              <h3 class="text-lg "><span class=" font-bold">Customer Name: </span> ${details.c_name}</h3>
              <p ><span class=" font-bold">Phone Number :</span> ${details.c_phone}</p>
              <p > <span class=" font-bold">Delivery Address:</span> ${details.address}</p>
            </div>
            <div>
              ${details.logo
                ? `<img src="https://admin.ezicalc.com/public/storage/business/logo/${details.logo}"
                   class="w-36 h-16   rounded-lg" />`
                : `<img src="${sampleImage}" class="w-40 h-12 object-cover mt-4 rounded-lg" />`}
              <h3 class="text-lg font-bold ">${details.businessName}</h3>
              <p ><span class=" font-bold">Phone Number :</span> ${details.businessPhone}</p>
              <p class="w-auto   "><span class=" font-bold">Office Address:</span> ${details.businessAddress}</p>
            </div>
          </div>
          <table class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg mt-4">
            <thead class="bg-gray-200 text-gray-700">
              <tr class="text-center">
                <th class="px-3 py-2">Image</th>
                <th class="px-3 py-2">Product Name</th>
                <th class="px-3 py-2">Size</th>
                <th class="px-3 py-2">Price</th>
                <th class="px-3 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody class="text-center bg-white divide-y divide-gray-200">
              ${details.order_products.map(product => `
                <tr class="hover:bg-gray-50">
                  <td class="px-3 py-2">
                    <img src="https://admin.ezicalc.com/public/storage/product/${product.image}" class="w-20 h-20 mx-auto object-cover rounded-lg" alt="${product.name}" />
                  </td>
                  <td class="px-3 py-2">${product.name}</td>
                  <td class="px-3 py-2">N/A</td>
                  <td class="px-3 py-2">${product.price}</td>
                  <td class="px-3 py-2">${details.s_product_qty || ''}, ${details.v_product_qty || ''}</td>
                </tr>`).join('')}
              ${details.order_variable_products.map(product => `
                <tr class="hover:bg-gray-50">
                  <td class="px-3 py-2">
                    <img src="https://admin.ezicalc.com/public/storage/product/${product.product.image}" class="w-20 h-20 mx-auto object-cover rounded-lg" alt="${product.product.name}" />
                  </td>
                  <td class="px-3 py-2">${product.product.name}</td>
                  <td class="px-3 py-2">${product.values}</td>
                  <td class="px-3 py-2">${product.price}</td>
                  <td class="px-3 py-2">${details.s_product_qty || ''}, ${details.v_product_qty || ''}</td>
                </tr>`).join('')}
            </tbody>
          </table>
          <div class="flex flex-col  items-end mt-4">
            <p>Total Price: ${details.item_total} <span class="text-xl ">৳</span></p>
            ${details.advance ? `<p>Advance: ${details.advance} <span class="text-xl ">৳</span></p>` : ''}
            ${details.discount_amount ? `<p>Discount Amount: ${details.discount_amount} <span class="text-xl ">৳</span></p>` : ''}
            ${details.delivery_charge ? `<p>Delivery Charge: ${details.delivery_charge} <span class="text-xl ">৳</span></p>` : ''}

            <p class=" font-bold text-xl">Payable Amount: ${details.cod_amount} <span class="text-2xl font-bold">৳</span></p>
          </div>
        </div>
        <div class="page-break"></div> 
      `).join('');
  
    // Print window setup
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Order Details</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            .page-break {
              page-break-after: always; /* Forces a page break after each invoice */
            }
          </style>
        </head>
        <body class="p-5">
          <h2 class="text-2xl text-center font-bold mb-4">Order Details</h2>
          ${printContent}
        </body>
      </html>
    `);
  
    printWindow.document.close();
  
    // Wait until content loads before printing
    printWindow.onload = () => {
      printWindow.focus(); // Focus on the new window
    };
  };
  
  
  
  
  
  
  




  const handlePrintInvoice = (order) => {
 
    printInvoice(order);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const orders = filteredOrders.slice(0, pageSize);

  const handleDelete = async (id) => {
    // Show a confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `https://admin.ezicalc.com/api/order/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          Swal.fire(
            "Deleted!",
            response.data.message || "USER deleted successfullyyy."
          );

          // Remove the deleted SMS from the state
          setDisplayOrders((prevSms) => prevSms.filter((sms) => sms.id !== id));
        } else {
          Swal.fire(
            "Error!",
            response.data.message || "Failed to delete SMS.",
            "error"
          );
        }
      } catch (error) {
        console.error(
          "Error deleting SMS:",
          error.response ? error.response.data : error.message
        );
        Swal.fire("Error!", "Failed to delete SMS.", "error");
      }
    }
  };


  const [todaysOrders, setTodaysOrders] = useState(0);
  const [todaySell, setTodaySell] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
      // Fetch data with Axios
      const fetchData = async () => {
          try {
              const response = await axios.get(`https://admin.ezicalc.com/api/dashboard/count/${clientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }); // Replace with actual API URL
              if (response.data.status) {
                  const data = response.data.data;
                  setTodaysOrders(data.todays_orders);
                  setTodaySell(data.todaySell);
                  setTotalOrders(data.totalOrders);
                 
              }
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };

      fetchData();
  }, []);

  console.log(orders);

  return (
    <div>
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 justify-between px-6">
        <h1 className="text-md md:text-2xl font-semibold">Order</h1>
        <AllSelectedBusiness onBusinessSelect={setSelectedBusiness} />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4 my-4">
        {/* Statistics cards */}
        <div className="flex col-span-2 flex-col hover:bg-sky-400 hover:text-white w-full py-1 rounded-md border border-gray-300 px-2 shadow-sm gap-3 justify-center">
          <h2 className="text-3xl font-semibold text-center">{totalOrders}</h2>
          <div className="flex justify-center items-center gap-2">
            <BsBoxes size={25} color="skyblue" />
            <h2 className="text-md">All Order</h2>
          </div>
        </div>

        <div className="flex flex-col col-span-2 hover:bg-sky-400 hover:text-white w-full py-1 rounded-md border border-gray-300 px-2 shadow-sm gap-3 justify-center">
          <h2 className="text-3xl font-semibold text-center">{todaysOrders} Pis</h2>
          <div className="flex justify-center items-center gap-2">
            <BsBoxes size={25} color="skyblue" />
            <h2 className="text-md">Todays Order</h2>
          </div>
        </div>

        <div className="flex flex-col col-span-2 hover:bg-sky-400 hover:text-white w-full py-1 rounded-md border border-gray-300 px-2 shadow-sm gap-3 justify-center">
        <h2 className="text-3xl font-semibold text-center">{Number(todaySell).toLocaleString()} ৳</h2>

          <div className="flex justify-center items-center gap-2">
            <BsBoxes size={25} color="skyblue" />
            <h2 className="text-md">Todays Sell</h2>
          </div>
        </div>
        <div className="flex flex-col col-span-2 hover:bg-sky-400 hover:text-white w-full py-1 rounded-md border border-gray-300 px-2 shadow-sm gap-3 justify-center">
          <h2 className="text-3xl font-semibold text-center">0</h2>
          <div className="flex justify-center items-center gap-2">
            <BsBoxes size={25} color="skyblue" />
            <h2 className="text-md">On Process</h2>
          </div>
        </div>

        

      
        <div className="flex flex-col col-span-2 hover:bg-sky-400 hover:text-white w-full py-1 rounded-md border border-gray-300 px-2 shadow-sm gap-3 justify-center">
          <h2 className="text-3xl font-semibold text-center">0</h2>
          <div className="flex justify-center items-center gap-2">
            <BsBoxes size={25} color="skyblue" />
            <h2 className="text-md">Total Return</h2>
          </div>
        </div>

        {/* <div className="flex flex-col col-span-2 hover:bg-sky-400 hover:text-white w-full py-1 rounded-md border border-gray-300 px-2 shadow-sm gap-3 justify-center">
          <h2 className="text-2xl font-semibold text-center">0</h2>
          <div className="flex justify-center items-center gap-2">
            <BsBoxes size={25} color="skyblue" />
            <h2 className="text-md">Confirm</h2>
          </div>
        </div> */}
      </div>

      <div className="flex pt-4 flex-col md:flex-row gap-3 justify-between items-center">
        <div className=" flex  items-center gap-3 ">
          <div>
            <select
              onChange={handlePageSizeChange}
              value={pageSize}
              className="border border-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-xl  md:px-4 px-1 py-1"
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="200">200</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
          </div>

          <h2   onClick={handlePrintAllInvoices} className="bg-sky-500 whitespace-nowrap cursor-pointer text-white hover:bg-green-500 rounded-lg text-[16px] md:px-4 px-2 flex flex-col md:flex-row gap-2 items-center  py-2">
            Print All Invoice<TfiPrinter color="white" className=" lg:block hidden"  size={20} />
          </h2>

          <div>
            <div className="border relative  border-gray-300 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <Datepicker
  useRange
  value={value}
  onChange={(newValue) => setValue(newValue)}
  popoverDirection="down"
/>
            </div>
          </div>
        </div>

        <div className="flex items-center">
        <input
          type="text"
          className="block w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-md focus:outline-none sm:text-sm"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="px-4 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700">
          <FaSearch />
        </button>
      </div>
      </div>
      {/* <h2
  className="bg-sky-500 cursor-pointer text-white hover:bg-green-500 rounded-lg text-md px-4 py-2"
  onClick={handlePrintAllInvoices}
>
  Print All Invoice
</h2> */}
      <div className="overflow-x-auto my-6">
        <div className="w-full">
          <table className="table mb-28">
            <thead className="md:text-[16px] text-gray-600 bg-[#EFEFEF]">
              <tr>
                <th className="">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="">Placed On</th>
                <th className="">Order By</th>
                <th className="">Order ID</th>
                <th className="">Customer Id</th>
                <th className=" ">Tracking Code</th>
                <th className="">Qty</th>
                <th className="">Source</th>
                <th className="">Address</th>
                <th className="p">Courier</th>

                <th className="">COD</th>
                <th className="">Status</th>
                <th className="">Action</th>
              </tr>
            </thead>

            <tbody className="md:text-[16px] text-[#575f69]">
          {isLoading ? (
            <tr>
              <td colSpan="13" className="text-center">
                <span className="loading loading-ring loading-md"></span>
                <h1 className=" text-sky-500">Loading Orders...</h1>
              </td>
            </tr>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.id} className="cursor-pointer  hover:bg-gray-100 text-sky-800">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                  />
                </td>
                <td className="flex flex-col">
                  <span>{formatDate(order.created_at)}</span>
                  <span>{formatTime(order.created_at)}</span>
                </td>
                <td className="text-center">{order.creator.name}</td>
                <td>{order.unique_id}</td>
                <td className="flex flex-col">
                  <span>{order.c_name}</span>
                  <span>{order.c_phone}</span>
                </td>
                <td className="text-center">
                  {order.steadfast_responce?.tracking_code || "n/a"}
                </td>
                <td>{Number(order.s_product_qty) + Number(order.v_product_qty)}</td>
                <td>{order.source}</td>
                <td>
                  {order.address.length > 20
                    ? `${order.address.substring(0, 15)}.....`
                    : order.address}
                </td>
                <td>{order.courier}</td>
                <td>{order.cod_amount} ৳</td>
                <td>{order.status}</td>
                <td>
          <div className="relative">
            <div className="dropdown">
              <button className="text-[20px]">
                <CiMenuKebab />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-50 p-2 shadow absolute right-2"
              >
                <li>
                  <a>
                    <FaEye className="text-blue-500 text-[20px] pl-1" />
                    View
                  </a>
                </li>
                <li onClick={() => handlePrintInvoice(order)} id="printInvoice">
                  <a>
                    <FaRegEdit className="text-green-500 text-[20px] pl-1" />
                    Invoice
                  </a>
                </li>
                <li>
                  <a onClick={() => handleDelete(order.id)}>
                    <MdDeleteForever className="text-red-500 text-[20px]" />
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" className="text-center">
                <div className="flex flex-col items-center">
                  <p className="my-4 text-xl font-semibold mr-4">No orders found</p>
                  <img
                    className="w-[15%] animate-pulse"
                    src="https://cdn-icons-png.flaticon.com/256/4076/4076478.png"
                    alt="No Orders found"
                  />
                </div>
              </td>
            </tr>
          )}
        </tbody>
          </table>
        </div>

        {modalVisible && (
          <InvoiceModal
            order={selectedOrder}
            onClose={() => setModalVisible(false)}
            onPrint={handlePrint}
          />
        )}
      </div>
    </div>
  );
};

export default Order;
