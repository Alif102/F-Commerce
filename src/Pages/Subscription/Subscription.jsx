import axios from "axios";
import React, { useState, useEffect } from "react";
import { IoDiamond } from "react-icons/io5";

import { Link } from "react-router-dom";

const Subscription = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApiData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://admin.ezicalc.com/api/package/all/get');
      if (response.data.status) {
        setPackages(response.data.data);
        console.log("API Data fetched: ", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);
  const [expandedPackageId, setExpandedPackageId] = useState(2);

  const toggleExpand = (packageTypeId) => {
    setExpandedPackageId(expandedPackageId === packageTypeId ? null : packageTypeId);
  };
  console.log(packages)



  // const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


console.log(packages)
  const handleOpenModal = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };



  

  return (
    <div>
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 ">
        <h2 className="px-4 text-xl font-semibold">Packages & Subscription</h2>
      </div>

      {/* Package Start */}

      {/* <div className="mx-auto mt-4">
        {groupedPackages.map((group, index) => (
          <div
            key={index}
            className="mb-4 py-2 px-4 border border-gray-300 rounded-md"
          >
            <button
              className="w-full text-left text-lg font-medium text-gray-700 focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex justify-between items-center py-4">
                <span>
                  {customGroupNames[index] || `Package Group ${index + 1}`}
                </span>
                <span className="bg-sky-400 px-2 font-bold text-xl rounded-full text-white">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
            </button>
            {activeIndex === index && (
              <div className="flex flex-wrap justify-center mb-4">
                {group.map((pkg, pkgIndex) => (
                  <div
                    key={pkg.id}
                    className={`flex gap-5 mb-4 w-full sm:w-1/3 ${
                      index === 1 && pkgIndex === Math.floor(group.length / 2)
                        ? "scale-110"
                        : ""
                    }`}
                  >
                    <div className="flex justify-center items-center mt-10 w-full">
                      <div className="relative rounded-3xl shadow-[0_3px_10px_rgb(0,0,0,0.1)] py-6 bg-white">
                        <div className="absolute top-[-8px] left-0 w-full h-10 bg-[#2FBDEC] rounded-t-3xl -z-10"></div>
                        <div className="relative -mt-9">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2FBDEC] rounded-full w-16 h-16 flex items-center justify-center">
                            <IoDiamond className="text-white w-8 h-8" />
                          </div>
                        </div>
                        <div className="text-center mt-12 mb-4">
                          <h2 className="my-1 text-2xl font-bold">
                            {pkg.name}
                          </h2>
                          <p className="text-gray-500">
                            One line about the package
                          </p>
                        </div>
                        <hr className="border-t border-gray-300 opacity-50" />

                        <div className="bg-slate-100 px-4 md:px-8 py-4">
                          <div className="text-center px-4 flex items-center">
                            {pkgIndex === 2 && index === 2 ? (
                              <div className="text-2xl md:text-4xl font-bold">
                                Call for Price
                              </div>
                            ) : (
                              <>
                                <span className="mr-2 text-md md:text-lg text-gray-500">
                                  only
                                </span>
                                <div className="text-2xl md:text-4xl font-bold">
                                  {pkg.price}
                                </div>
                                <span className="mx-1 text-2xl md:text-4xl font-bold">
                                  ৳
                                </span>
                                <span className="mx-1 text-md md:text-lg text-gray-500">
                                  /month
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-center mt-4">
                            {index === 2 && pkgIndex === 2 ? (
                              <button
                                onClick={() => handleOpenModal(pkg)}
                                className="bg-[#444DB5] text-white px-6 py-2 rounded font-bold"
                              >
                                Call Now
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenModal(pkg)}
                                className="bg-[#444DB5] text-white px-6 py-2 rounded font-bold"
                              >
                                Order Now
                              </button>
                            )}
                          </div>
                        </div>

                        <hr className="border-t border-gray-300 opacity-50" />

                        <ul className="p-0 text-center">
                          {index === 2 && (
                            <>
                              <h1 className="my-2 text-sky-600 font-bold">
                                E-commerce Website: {pkg.ecommerce}
                              </h1>
                            
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                            </>
                          )}

                          <h1 className="my-2 text-sky-600">
                            Create Business: {pkg.BusinessCreate}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Create User: {pkg.UserCreate}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Invoice Template: {pkg.Invoice}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">SMS : {pkg.SMS}</h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Create Product: {pkg.ProductCreate}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Warehouse: {pkg.Warehouse}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Order: {pkg.Order}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Follow Up: {pkg.FollowUp}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            POS Data: {pkg.POSDatasave}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Fraud Checker: {pkg.FraudChecker}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Auto Queriar Entry: {pkg.AutoQueriarEntry}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Promotional Marketing: {pkg.PromotionalMarketing}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Target Audiance: {pkg.TargetAudiance}
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

<div className="flex justify-center items-center mt-10 w-full">
                      <div className="relative rounded-3xl shadow-[0_3px_10px_rgb(0,0,0,0.1)] py-6 bg-white">
                        <div className="absolute top-[-8px] left-0 w-full h-10 bg-[#2FBDEC] rounded-t-3xl -z-10"></div>
                        <div className="relative -mt-9">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2FBDEC] rounded-full w-16 h-16 flex items-center justify-center">
                            <IoDiamond className="text-white w-8 h-8" />
                          </div>
                        </div>
                        <div className="text-center mt-12 mb-4">
                          <h2 className="my-1 text-2xl font-bold">
                           
                          </h2>
                          <p className="text-gray-500">
                            One line about the package
                          </p>
                        </div>
                        <hr className="border-t border-gray-300 opacity-50" />

                        <div className="bg-slate-100 px-4 md:px-8 py-4">
                          <div className="text-center px-4 flex items-center">
                           
                              <>
                                <span className="mr-2 text-md md:text-lg text-gray-500">
                                  only
                                </span>
                                <div className="text-2xl md:text-4xl font-bold">
                                
                                </div>
                                <span className="mx-1 text-2xl md:text-4xl font-bold">
                                  ৳ 500000
                                </span>
                                <span className="mx-1 text-md md:text-lg text-gray-500">
                                  /month
                                </span>
                              </>
                         
                          </div>
                          <div className="text-center mt-4">
                           
                              <button
                                onClick={() => handleOpenModal(pkg)}
                                className="bg-[#444DB5] text-white px-6 py-2 rounded font-bold"
                              >
                                Order Now
                              </button>
                          
                          </div>
                        </div>

                        <hr className="border-t border-gray-300 opacity-50" />

                        <ul className="p-0 text-center">
                         

                          <h1 className="my-2 text-sky-600">
                            Create Business: business
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Create User: 
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Invoice Template:
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">SMS : </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Create Product:
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Warehouse: 
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Order: 
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Follow Up:
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            POS Data:
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Fraud Checker: 
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Auto Queriar Entry:
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Promotional Marketing
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                          <h1 className="my-2 text-sky-600">
                            Target Audiance:
                          </h1>
                          <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                        </ul>
                      </div>
                    </div>

        {isModalOpen && (
          <div className="modal">
            <button onClick={handleCloseModal}>Close</button>
            <h2>{selectedPackage?.name}</h2>
          </div>
        )}
      </div> */}
     <div>
  {loading ? (
    <div className="text-center text-gray-500 text-lg p-4">
   
         
          <span className="loading loading-ring loading-md"></span>
          <h1 className=" text-sky-500"> Loading packages....</h1>
    
      
    </div>
  ) : (
    packages.map((pkg) => (
      <div key={pkg.package_type_id} className="border p-4 my-2 rounded-lg shadow">
        <div className="flex justify-between">
          <h2
            className="cursor-pointer text-blue-500 text-xl"
            onClick={() => toggleExpand(pkg.package_type_id)}
          >
            {pkg.package_type}
          </h2>
          <h1
            onClick={() => toggleExpand(pkg.package_type_id)}
            className="bg-sky-400 hover:bg-green-500 px-2 font-bold text-xl rounded-full text-white cursor-pointer"
          >
            {expandedPackageId === pkg.package_type_id ? '-' : '+'}
          </h1>
        </div>

        {expandedPackageId === pkg.package_type_id && (
          <div className="mt-2 flex flex-wrap justify-evenly space-y-2">
            {pkg.packages.map((p) => (
              <div key={p.id} className="p-2">
                <div className="flex justify-center items-center mt-10 w-full">
                  <div className="relative rounded-3xl shadow-[0_3px_10px_rgb(0,0,0,0.1)] py-6 bg-white">
                    <div className="absolute top-[-8px] left-0 w-full h-10 bg-[#2FBDEC] rounded-t-3xl -z-10"></div>
                    <div className="relative -mt-9">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2FBDEC] rounded-full w-16 h-16 flex items-center justify-center">
                        <IoDiamond className="text-white w-8 h-8" />
                      </div>
                    </div>
                    <div className="text-center mt-12 mb-4">
                      <h2 className="my-1 text-2xl font-bold"></h2>
                      <p className="text-gray-500">One line about the package</p>
                      <p className=" text-sky-500">{p.name}</p>
                    </div>
                    <hr className="border-t border-gray-300 opacity-50" />

                    <div className="bg-slate-100 px-4 md:px-8 py-4">
                      <div className="text-center px-4 flex items-center">
                        <span className="mr-2 text-md md:text-lg text-gray-500">only</span>
                        <div className="text-2xl md:text-4xl font-bold"></div>
                        <span className="mx-1 text-2xl md:text-4xl font-bold">৳ {p.price}</span>
                        <span className="mx-1 text-md md:text-lg text-gray-500">/month</span>
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="bg-[#444DB5] text-white px-6 py-2 rounded font-bold"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>

                    <hr className="border-t border-gray-300 opacity-50" />

                    <ul className="p-0 text-center">
                      <h1 className="my-2 text-sky-600">Create Business: business {p.business}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Create User: {p.user}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Invoice Template: {p.invoice}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">SMS: {p.sms}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Create Product: {p.product}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Warehouse: {p.stock}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Order: {p.order}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Follow Up: {p.follow_up}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">POS Data: {p.data}</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Fraud Checker:</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Auto Queriar Entry:</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Promotional Marketing</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                      <h1 className="my-2 text-sky-600">Target Audience:</h1>
                      <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ))
  )}
</div>

      {/* Package End */}
      

      

      <div className="w-full border border-gray-300 rounded-md py-4 flex items-center my-4 pe-4">
        <h2 className="px-4 text-xl font-semibold">
          Total Payable:{" "}
          {selectedPackage ? `${selectedPackage.price} BDT` : "0 BDT"}
        </h2>
        <div className="ml-auto flex items-center">
          {selectedPackage ? (
            <Link
              to="/checkout"
              state={{ selectedPackage }}
              className="btn bg-sky-400 hover:bg-green-400 text-white text-xl"
            >
              Make Purchase
            </Link>
          ) : (
            <button
              className="btn bg-sky-400 hover:bg-green-400 text-white text-xl"
              disabled
            >
              Make Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;



{/* <ul className="p-0 text-center">
  <h1 className="my-2 text-sky-600">
    Create Business: {p.business || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">
    Create User: {p.user || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">
    Invoice Template: {p.invoice || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">
    SMS: {p.sms || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">
    Create Product: {p.product || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">
    Warehouse: {p.stock || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">
    Order: {p.order || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">
    Follow Up: {p.follow_up || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">
    POS Data: {p.data || "Unlimited"}
  </h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">Fraud Checker: Unlimited</h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">Auto Queriar Entry: Unlimited</h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">Promotional Marketing</h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />

  <h1 className="my-2 text-sky-600">Target Audience: Unlimited</h1>
  <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
</ul> */}
