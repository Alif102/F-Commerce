import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Log = () => {

    const location = useLocation();
    const { product } = location.state || {};
    
    const product_id = product?.id;
    
    console.log(product_id); 
    
    const token = localStorage.getItem("token");


    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchStockLogs = async () => {
        try {
            const response = await axios.get(`https://admin.ezicalc.com/api/stock/log/get/${product_id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
          if (response.data.status) {
            console.log(response.data.status); 
            console.log(response.data.data); 
            setLogs(response.data.data); 
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); 
        }
      };
  
      fetchStockLogs();
    }, []);
  console.log(logs)
    if (loading) {
      return <div className=' flex justify-center items-center text-center mt-24'>
      <span className="loading loading-ring loading-lg"></span
      ></div>; 
    }
  return (
    <div>

<div className="w-full shadow py-4 flex pe-4">
                <h2 className="px-4 text-xl font-semibold">Log</h2>
                <div className="ml-auto flex items-center">
                    <Link to='/stock/add'>

                    <button className=' bg-sky-400 text-white px-5 py-2 rounded-md'>Back</button>
                    </Link>
                </div>
            </div>

            <div>
          <select  className="border  border-sky-300 mt-4 rounded-lg text-xl font-bold px-4 py-1">
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>


        {/* Table */}
        <div className="overflow-x-auto">
      <table className="table w-full mt-8">
       
        <thead className="md:text-[16px] text-gray-700 bg-gray-200 ">
          <tr>
            <th>SL</th>
            <th>Emp . Name</th>
            <th>Prev Stock</th>
            <th>Updated Stock</th>
            <th>Note</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="md:text-[16px] text-sky-800 ">
        {logs.length > 0 ? (
  logs.map((log, index) => (
    <tr key={log.id}>
      <td>{index + 1}</td>
      <td>{log.update_by.name}</td>
      <td>{log.pre_stock}</td>
      <td>{log.update_stock}</td>
      <td>{log.note}</td>
      <td>{new Date(log.created_at).toLocaleString()}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="6" className="text-center">
        <img className=' text-center mx-auto w-[20%]' src="https://www.spireskills.com/assets/images/no-records.png" alt="No record found" srcset="" />
    </td>
  </tr>
)}

        </tbody>
      </table>
    </div>
    </div>
  )
}

export default Log
