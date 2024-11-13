
import { useState } from "react";
import {FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";


const Access = () => {

    const toggleDropdown = (e) => {
        const dropdownMenu = e.currentTarget.nextElementSibling;
        dropdownMenu.classList.toggle("hidden");
      };

    const [searchTerm, setSearchTerm] = useState("");

    const users = [
        {
          id: 1,
          name: "John Doe",
          phoneNumber: "123-456-7890",
          email: "johndoe@example.com",
          password: "password123",
          packageName: "Premium",
        },
        {
          id: 2,
          name: "Jane Smith",
          phoneNumber: "098-765-4321",
          email: "janesmith@example.com",
          password: "password456",
          packageName: "Basic",
        },
        {
          id: 3,
          name: "Michael Johnson",
          phoneNumber: "456-789-1230",
          email: "michaeljohnson@example.com",
          password: "password789",
          packageName: "Pro",
        },
        {
          id: 4,
          name: "Emily Davis",
          phoneNumber: "789-123-4560",
          email: "emilydavis@example.com",
          password: "password012",
          packageName: "Standard",
        },
        {
          id: 5,
          name: "David Brown",
          phoneNumber: "321-654-9870",
          email: "davidbrown@example.com",
          password: "password345",
          packageName: "Premium",
        },
        {
          id: 6,
          name: "Sarah Wilson",
          phoneNumber: "654-321-7890",
          email: "sarahwilson@example.com",
          password: "password678",
          packageName: "Basic",
        },
        {
          id: 7,
          name: "James Anderson",
          phoneNumber: "987-654-3210",
          email: "jamesanderson@example.com",
          password: "password901",
          packageName: "Pro",
        },
        {
          id: 8,
          name: "Sophia Martinez",
          phoneNumber: "123-789-4560",
          email: "sophiamartinez@example.com",
          password: "password234",
          packageName: "Standard",
        },
      ];

      // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  ); 

  return (
    <div>
         <div className='flex shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] justify-between  mt-3 px-6 py-4 items-center'>
            <h1 className=" text-md md:text-4xl font-bold">User Access</h1>

            <div className='flex flex-col md:flex-row gap-3 items-center'>
                <h2 className='bg-blue-400 cursor-pointer text-center rounded-md px-4 whitespace-nowrap py-1  font-semibold text-md text-white'>Create User</h2>
                <h2 className='bg-green-400 cursor-pointer text-center rounded-md px-3 py-1 font-semibold text-md text-white'>Permission</h2>
                <div className="relative inline-block w-full z-40 scale-95">
  <select className="block w-full px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
    <option disabled selected>Business Name</option>
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
    <option>Option 4</option>
  </select>
</div>

            </div>
        </div>


        {/* table */}

        <div className="py-4">
      <div className="flex justify-end my-4 items-center mb-4">
        <div className="relative w-full max-w-xs">
          {/* <FaSearch className="transform -translate-y-1/2 text-gray-400" /> */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="text-gray-600 bg-[#EFEFEF]">
            <tr className="text-left bg-gray-50 border-b">
              <th className="p-4">SL</th>
              <th className="p-4">User Name</th>
              <th className="p-4">User Phone Number</th>
              <th className="p-4">Mail</th>
              <th className="p-4">Password</th>
              <th className="p-4">Package Name</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`${index % 2 === 1 ? "shadow-md" : ""} border-b`}
              >
                <td className="p-4 text-[18px]">{index + 1}</td>
                <td className="p-4 text-[18px]">{user.name}</td>
                <td className="p-4 text-[18px]">{user.phoneNumber}</td>
                <td className="p-4 text-[18px]">{user.email}</td>
                <td className="p-4 text-[18px]">{user.password}</td>
                <td className="p-4 text-[18px]">{user.packageName}</td>
                <td className="p-4 text-[18px]">
                <FaEllipsisV className="cursor-pointer" onClick={toggleDropdown} />
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
        <ul className="menu menu-compact">
          <li>
            <a href="#" className="flex justify-center items-center">
              <FaEye className="" color="green" /> View
            </a>
          </li>
          <li>
            <a href="#" className="flex justify-center items-center">
              <FaEdit color="blue" className="" /> Edit
            </a>
          </li>
          <li>
            <a href="#" className="flex justify-center items-center">
              <FaTrash color="red" className="" /> Delete
            </a>
          </li>
        </ul>
      </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default Access