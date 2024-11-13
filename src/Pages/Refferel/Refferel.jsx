import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Refferel = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Fetch data from the API
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('./data.json'); // Replace with your API URL
          setData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    console.log(data)
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
  return (
    <div>

<div className='flex shadow-md justify-between mt-3 px-6 py-1 items-center'>
        <h1 className="text-md md:text-2xl font-semibold">Refferal Links</h1>
      </div>

      <div className='flex shadow-md  justify-between mt-6 px-6 py-10 items-center'>
        <h1 className="text-md md:text-2xl font-semibold whitespace-nowrap mr-6 ">Refferal Link</h1>
        <input
          type="text"
          className="form-control text-lowercase shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-2 px-3 w-[90%]  focus:outline-none focus:border-none"
          
        />

        <h1 className=' whitespace-nowrap ml-6 font-bold text-xl '>Balance : 00 Taka</h1>
      </div>


      <div className="overflow-x-auto mt-5">
      <table className="table w-full">
        {/* Table Head */}
        <thead className='md:text-[18px] text-gray-700 shadow-[rgba(0,_0,_0,_0.24)_0px_1px_5px]'>
          <tr>
            <th>SL</th>
            <th>ID</th>
            <th>Phone</th>
            <th>Package</th>
            <th>Date</th>
            <th>Referral Percentage</th>
            <th>Amount</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className='md:text-[16px]  font-semibold'>
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 1 ? 'shadow-[rgba(0,_0,_0,_0.24)_0px_1px_5px]' : ''}>
              <td>{index + 1}</td> {/* SL */}
              <td>{item.id}</td>
              <td>{item.phone}</td>
              <td>{item.package}</td>
              <td>{item.date}</td>
              <td>{item.referralPercentage}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
 
      
    </div>
  )
}

export default Refferel
