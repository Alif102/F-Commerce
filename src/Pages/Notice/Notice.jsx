import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
const Notice = () => {

    const [searchTerm, setSearchTerm] = useState('');

    const notices = [
        { id: 1, title: 'System Update', notice: 'This is a sample notice about the system update. Please review it.', date: '2/5/2024 10:30 AM' },
        { id: 2, title: 'Maintenance', notice: 'Scheduled maintenance will occur on the server at 3 AM.', date: '3/5/2024 3:00 AM' },
        { id: 3, title: 'New Features', notice: 'We are excited to introduce new features in our application.', date: '4/5/2024 11:00 AM' },
        { id: 4, title: 'Security Update', notice: 'A security update has been released. Please update your system.', date: '5/5/2024 2:30 PM' },
        { id: 5, title: 'Downtime Notice', notice: 'We are experiencing unexpected downtime. We are working on it.', date: '6/5/2024 9:00 AM' },
        { id: 6, title: 'Holiday Announcement', notice: 'Our office will be closed on the upcoming holiday.', date: '7/5/2024 5:00 PM' },
        { id: 7, title: 'Policy Update', notice: 'Our company policies have been updated. Please review them.', date: '8/5/2024 8:00 AM' },
        { id: 8, title: 'Employee Meeting', notice: 'An all-hands meeting will take place next week.', date: '9/5/2024 1:30 PM' },
    ];

    const filteredNotices = notices.filter((notice) =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.notice.toLowerCase().includes(searchTerm.toLowerCase())
    );
  return (
    <div>
         <div className='flex shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] justify-between  mt-3 px-6 py-4 items-center'>
            <h1 className=" text-md md:text-4xl font-bold">Notice Board</h1>

            <div className="form-control scale-95 font-bold">
   
      <select className="select font-semibold select-bordered">
        <option disabled selected>All</option>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
        <option>Option 4</option>
      </select>
    </div>
        </div>


        {/* table */}

        <div className="py-4">
        <div className="flex justify-end my-4 items-center mb-4">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-md border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="text-gray-600 bg-[#EFEFEF]">
                    <tr className=' bg-gray-50'>
                        <th className="py-2 px-4 border-b">SL</th>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Notice</th>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredNotices.map((notice, index) => (
                        <tr key={notice.id} className={index % 2 === 1 ? 'shadow-md' : ''}>
                            <td className="py-2 text-[18px] px-4 border-b text-center">{notice.id}</td>
                            <td className="py-2 text-[18px] px-4 border-b">{notice.title}</td>
                            <td className="py-2 text-[18px] px-4 border-b">{notice.notice}</td>
                            <td className="py-2 text-[18px] px-4 border-b justify-center flex flex-col">
                                <span>{notice.date.split(' ')[0]}</span>
                                <span className=' text-gray-400'>{notice.date.split(' ')[1]}</span>
                            </td>
                            <td className="py-2 text-[18px] px-4 border-b">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Notice