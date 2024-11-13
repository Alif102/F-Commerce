import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
const SMS = ({customersData}) => {
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Checkbox start
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const [singleChecked, setSingleChecked] = useState(false);

  const handleSingleCheckboxChange = () => {
    setSingleChecked(!singleChecked);
  };
  const [pandaChecked, setPandaChecked] = useState(false);

  const handlePandaCheckboxChange = () => {
    setPandaChecked(!pandaChecked);
  };
  // Checkbox End

  // All UseState start
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sms, setSms] = useState([]);
  const [bodyText, setBodyText] = useState("");
  const [remainingChars, setRemainingChars] = useState(160);

  const [singleselectedTemplate, setSingleSelectedTemplate] = useState(null);
  const [singleBodyText, setSingleBodyText] = useState("");
  const [singleRemainingChars, setSingleRemainingChars] = useState(160);

  const [pandaselectedTemplate, setPandaSelectedTemplate] = useState(null);
  const [pandaBodyText, setPandaBodyText] = useState("");
  const [pandaRemainingChars, setPandaRemainingChars] = useState(160);

  // All UseState End

  // Fething Start

  const fetchSMS = async () => {
    try {
      const response = await axios.get(
        `https://admin.ezicalc.com/api/sms/template/get-all/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setSms(response.data.data);
      } else {
        console.error("Failed to fetch SMS templates:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching SMS templates:", error);
    }
  };

  useEffect(() => {
    fetchSMS();
  }, [token, clientId]);

  //   post
  const [phone, setPhone] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("user_id", userId);
    formData.append("phone", phone);
    formData.append("message", singleBodyText);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/sms/send",
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
          title: response.data.message || "SMS updated successfully!",
          showConfirmButton: false,
          timer: 2000,
        });

        // Clear form fields
        setPhone(null);
        setSingleBodyText("");

        setErrors({});
        handleErrors("");

        // Close the modal
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

  // Fething End

  const handleCheck = (type) => {
    switch (type) {
      case "isChecked":
        setIsChecked(true);
        setSingleChecked(false);
        setPandaChecked(false);
        break;
      case "singleChecked":
        setIsChecked(false);
        setSingleChecked(true);
        setPandaChecked(false);
        break;
      case "pandaChecked":
        setIsChecked(false);
        setSingleChecked(false);
        setPandaChecked(true);
        break;
      default:
        break;
    }
  };

  // Function start
  const options = sms.map((template) => ({
    value: template.id,
    label: template.title,
    body: template.body,
  }));
  console.log(sms);

  const handleSelectChange = (selectedOption) => {
    setSelectedTemplate(selectedOption);
    const body = selectedOption ? selectedOption.body : "";
    setBodyText(body);
    setRemainingChars(160 - body.length);

    // Save selected template to localStorage
    localStorage.setItem("selectedTemplate", JSON.stringify(selectedOption));
  };

  const handleTextareaChange = (event) => {
    const newText = event.target.value;
    setBodyText(newText);
    setRemainingChars(160 - newText.length);
  };

  const handleSingleSelectChange = (selectedOption) => {
    setSingleSelectedTemplate(selectedOption);
    const body = selectedOption ? selectedOption.body : "";
    setSingleBodyText(body);
    setSingleRemainingChars(160 - body.length);

    // Save selected template to localStorage
    localStorage.setItem("selectedTemplate", JSON.stringify(selectedOption));
  };

  const handleSingleTextareaChange = (event) => {
    const newText = event.target.value;
    setSingleBodyText(newText);
    setSingleRemainingChars(160 - newText.length);
  };

  const handlePandaSelectChange = (selectedOption) => {
    setPandaSelectedTemplate(selectedOption);
    const body = selectedOption ? selectedOption.body : "";
    setPandaBodyText(body);
    setPandaRemainingChars(160 - body.length);

    // Save selected template to localStorage
    localStorage.setItem("selectedTemplate", JSON.stringify(selectedOption));
  };

  const handlePandaTextareaChange = (event) => {
    const newText = event.target.value;
    setPandaBodyText(newText);
    setPandaRemainingChars(160 - newText.length);
  };
  // Function End

  return (
    <div>
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 ">
      <h1 className="text-md md:text-2xl font-semibold px-4">Marketing SMS</h1>   
           <div className="ml-auto flex items-center">
          {/* <AllSelectedBusiness /> */}
        </div>
      </div>

      <div>
        <h1 className=" font-semibold text-xl pl-3 my-5">Send SMS to</h1>

        {/* Allll Customer start */}
        <div className="rounded-md border border-gray-300  py-4 px-5">
          <div className="flex justify-between">
            <h1 className="font-semibold text-lg">All Customer ( {customersData.length} )</h1>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleCheck("isChecked")}
              className="checkbox checkbox-info"
            />
          </div>

          {/* Show or hide this div based on checkbox state */}
          {isChecked && (
            <div className="text-lg  mt-5">
              <h2 className="my-2 font-bold">Select SMS Template</h2>

              <Select
                className=""
                options={options}
                value={selectedTemplate}
                onChange={handleSelectChange}
                placeholder="Select a template"
              />
              <h1 className="font-bold my-2">Message</h1>
              <textarea
                value={bodyText}
                onChange={handleTextareaChange}
                placeholder="Write custom message....."
                className="py-4 px-5 resize-none hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full shadow-sm rounded-md border border-gray-300"
                maxLength="160"
              />
              <p className="text-gray-600 text-sm mt-1">
                {remainingChars} characters remaining
              </p>

              {/* Date Picker */}
              <div className=" flex  justify-center md:justify-end ">
                <div className="mt-10">
                  <h1 className="font-bold my-2">Pick a Date & Time</h1>

                  <div className="flex flex-col md:flex-row gap-2 items-center space-x-4">
                    <input
                      type="date"
                      onClick={(e) => e.target.showPicker()}
                      className="form-control  rounded-md border border-gray-300  p-2"
                    />
                    <div className="flex items-center rounded-md border border-gray-300 p-2 w-40">
                      <input
                        type="time"
                        placeholder="10 : 30 pm"
                        className="outline-none flex-grow bg-transparent"
                      />
                    </div>
                    <button className=" btn bg-sky-400 text-white text-xl px-7 hover:bg-green-500">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Allll Customer End */}

        {/* Single Customer start */}
        <form onSubmit={handleSave} className="rounded-md border border-gray-300 my-5 py-4 px-5">
          <div className="flex justify-between">
            <h1 className="font-semibold text-lg">Single Customer</h1>
            <input
              type="checkbox"
              checked={singleChecked}
              className="checkbox checkbox-info"
              onChange={() => handleCheck("singleChecked")}
            />
          </div>

          {/* Show or hide this div based on checkbox state */}
          {singleChecked && (
            <div className="text-lg  mt-5">
              <div>
                <h1 className="font-bold my-2">Phone Number</h1>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="number"
                  className="py-2 px-5  hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full shadow-sm rounded-md border border-gray-300"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone[0]}</p>
                )}
              </div>
              <h2 className="my-2 font-bold">Select SMS Template</h2>
              <Select
                className=""
                options={options}
                value={singleselectedTemplate}
                onChange={handleSingleSelectChange}
                placeholder="Select a template"
              />

              <div>
                <h1 className="font-bold my-2">Message</h1>
                <textarea
                  value={singleBodyText}
                  onChange={handleSingleTextareaChange}
                  placeholder="Write custom message....."
                  className="py-4 px-5 resize-none  hover:border-blue-500 focus:outline-none focus:ring-blue-500 w-full shadow-sm rounded-md border border-gray-300"
                  maxLength="160"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message[0]}</p>
                )}

                <p className="text-gray-600 text-sm mt-1">
                  {singleRemainingChars} characters remaining
                </p>
              </div>

              {/* Date Picker */}
              <div className=" flex  justify-center md:justify-end ">
                <div className="mt-10">
                  <h1 className="font-bold my-2">Pick a Date & Time</h1>

                  <div className="flex flex-col md:flex-row gap-2 items-center space-x-4">
                    <input
                      type="date"
                      onClick={(e) => e.target.showPicker()}
                      className="form-control  rounded-md border border-gray-300  p-2"
                    />
                    <div className="flex items-center rounded-md border border-gray-300 p-2 w-40">
                      <input
                        type="time"
                        placeholder="10 : 30 pm"
                        className="outline-none flex-grow bg-transparent"
                      />
                    </div>
                    {/* <button type='submit' className=' btn bg-sky-400 text-white text-xl px-7 hover:bg-green-500'>Send</button> */}
                    <button
                      className=" btn bg-sky-400 text-white text-xl px-7 hover:bg-green-500"
                      type="submit"
                      disabled={loading}
                    >
                      {loading && (
                        <FaSpinner className="animate-spin mr-2" /> // Spinner icon
                      )}
                      {loading ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Single Customer End */}

        {/* Panda Pos Marketing start */}
        <div className="rounded-md border border-gray-300 py-4 px-5">
          <div className="flex justify-between">
            <h1 className="font-semibold text-lg">
               Ezicalc Marketing
            </h1>
            <input
              type="checkbox"
              checked={pandaChecked}
              onChange={() => handleCheck("pandaChecked")}
              className="checkbox checkbox-info"
            />
          </div>

          {/* Show or hide this div based on checkbox state */}
          {pandaChecked && (
            <div className="text-lg  mt-5">
              <h2 className="my-2 font-bold">Select SMS Template</h2>

              <Select
                className=""
                options={options}
                value={pandaselectedTemplate}
                onChange={handlePandaSelectChange}
                placeholder="Select a template"
              />
              <h1 className="font-bold my-2">Message</h1>
              <textarea
                value={pandaBodyText}
                onChange={handlePandaTextareaChange}
                placeholder="Write custom message....."
                className="w-full py-4 px-5  hover:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm rounded-md border border-gray-300 resize-none"
                maxLength="160"
              />
              <p className="text-gray-600 text-sm mt-1">
                {pandaRemainingChars} characters remaining
              </p>

              {/* Date Picker */}
              <div className=" flex  justify-center md:justify-end ">
                <div className="mt-10">
                  <h1 className="font-bold my-2">Pick a Date & Time</h1>

                  <div className="flex flex-col md:flex-row gap-2 items-center space-x-4">
                    <input
                      type="date"
                      onClick={(e) => e.target.showPicker()}
                      className="form-control  rounded-md border border-gray-300  p-2"
                    />
                    <div className="flex items-center rounded-md border border-gray-300 p-2 w-40">
                      <input
                        type="time"
                        placeholder="10 : 30 pm"
                        className="outline-none flex-grow bg-transparent"
                      />
                    </div>
                    <button className=" btn bg-sky-400 text-white text-xl px-7 hover:bg-green-500">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panda Pos Marketing End */}
      </div>
    </div>
  );
};

export default SMS;
