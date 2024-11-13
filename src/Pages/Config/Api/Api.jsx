import React, { useState, useEffect } from "react";
import SelectedBusiness from "../../../Component/SelectedBusiness";
import Swal from "sweetalert2";
import axios from "axios";

const Api = () => {
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");

  const [pathaoKey, setPathaoKey] = useState("");
  const [pathaoSecret, setPathaoSecret] = useState("");
  const [steadfastKey, setSteadfastKey] = useState("");
  const [steadfastSecret, setSteadfastSecret] = useState("");
  const [redxKey, setRedxKey] = useState("");
  const [redxSecret, setRedxSecret] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const [apiData, setApiData] = useState([]);

  const handleSelectBusinesses = (businesses) => {
    if (businesses.length > 0) {
      setSelectedBusiness(businesses[0]);
    } else {
      setSelectedBusiness(null);
    }
  };

  const businessId = selectedBusiness?.id;

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("business_id", businessId);
    formData.append("pathao_key", pathaoKey);
    formData.append("pathao_secret", pathaoSecret);
    formData.append("steadfast_key", steadfastKey);
    formData.append("steadfast_secret", steadfastSecret);
    formData.append("redx_key", redxKey);
    formData.append("redx_secret", redxSecret);

    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/api/set",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: response.data.message || "API created successfully!",
          showConfirmButton: false,
          timer: 2000,
        });

        setPathaoKey("");
        setPathaoSecret("");
        setSteadfastKey("");
        setSteadfastSecret("");
        setRedxKey("");
        setRedxSecret("");

        fetchApiData();
      } else {
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error(
        "Error saving API data:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Fetch API Data
  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `https://admin.ezicalc.com/api/api/get/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setApiData(response.data.data);
        console.log("API Data fetched: ", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, [token, clientId]);

  // Populate fields based on selected business
  useEffect(() => {
    if (apiData && businessId) {
      const selectedApiData = apiData.find(
        (api) => api.business_id === businessId
      );
      if (selectedApiData) {
        setPathaoKey(selectedApiData.pathao_key || "");
        setPathaoSecret(selectedApiData.pathao_secret || "");
        setSteadfastKey(selectedApiData.steadfast_key || "");
        setSteadfastSecret(selectedApiData.steadfast_secret || "");
        setRedxKey(selectedApiData.redx_key || "");
        setRedxSecret(selectedApiData.redx_secret || "");
      } else {
        // Clear fields if no matching business data found
        setPathaoKey("");
        setPathaoSecret("");
        setSteadfastKey("");
        setSteadfastSecret("");
        setRedxKey("");
        setRedxSecret("");
      }
    }
  }, [apiData, businessId]);

  console.log(apiData)

  return (
    <form onSubmit={handleSave} className="mx-4 md:mx-10">
      <div className="w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300  mb-5">
        <h2 className="px-4 text-xl font-semibold">API Config</h2>
        <div className="ml-auto flex items-center">
          <SelectedBusiness isMulti={false} onSelectBusinesses={handleSelectBusinesses} />
        </div>
      </div>

      {/* Steadfast Courier */}
      <div className="shadow-sm rounded-md border border-gray-300 p-5 mb-10">
        <div>
          <div className="mb-3 text-2xl font-semibold">Steadfast Courier</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2">API Key</div>
              <input
                value={steadfastKey}
                onChange={(e) => setSteadfastKey(e.target.value)}
                className="py-2 px-3 hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full md:w-11/12 shadow-sm rounded-md border border-gray-300"
                type="text"
              />
            </div>
            <div>
              <div className="mb-2">API Secret</div>
              <input
                value={steadfastSecret}
                onChange={(e) => setSteadfastSecret(e.target.value)}
                className="py-2 px-3 hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full md:w-11/12 shadow-sm rounded-md border border-gray-300"
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg">
            Save
          </button>
        </div>
      </div>

      {/* Pathao Courier */}
      <div>
        <div className="shadow-sm rounded-md border border-gray-300 p-5 mb-10">
          <div>
            <div className="mb-3 text-2xl font-semibold">Pathao Courier</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2">API Key</div>
                <input value={pathaoKey}  onChange={(e) => setPathaoKey(e.target.value)}
                  className="py-2 px-3 hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full md:w-11/12 shadow-sm rounded-md border border-gray-300"
                  type="text"
                />
              </div>
              <div>
                <div className="mb-2">API Secret</div>
                <input value={pathaoSecret}  onChange={(e) => setPathaoSecret(e.target.value)}
                  className="py-2 px-3 hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full md:w-11/12 shadow-sm rounded-md border border-gray-300"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg">
              Save
            </button>
          </div>
        </div>
      </div>


        {/* RedX Courier */}

      <div>
        <div className="shadow-sm rounded-md border border-gray-300 p-5">
          <div>
            <div className="mb-3 text-2xl font-semibold">RedX Courier</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2">API Key</div>
                <input value={redxKey}  onChange={(e) => setRedxKey(e.target.value)}
                  className="py-2 px-3 hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full md:w-11/12 shadow-sm rounded-md border border-gray-300"
                  type="text"
                />
              </div>
              <div>
                <div className="mb-2">API Secret</div>
                <input value={redxSecret}  onChange={(e) => setRedxSecret(e.target.value)}
                  className="py-2 px-3 hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full md:w-11/12 shadow-sm rounded-md border border-gray-300"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="btn bg-[#28DEFC] text-white px-6 text-lg hover:bg-[#28DEFC]">
              Save
            </button>
          </div>
        </div>
      </div>


    </form>
  );
};

export default Api;
