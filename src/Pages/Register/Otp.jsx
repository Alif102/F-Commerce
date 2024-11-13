import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import NProgress styles
import regilogo from '../../../public/assets/pos-logo.png'
import otp from "../../../assets/otp.jpg";

const Otp = ({userInfo}) => {
 
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);

  function handleOtpChange(e, index) {
    const value = e.target.value;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
  
    // Move focus to the next or previous input
    if (value && index < otpValues.length - 1) {
      e.target.nextElementSibling.focus();
    } else if (!value && index > 0) {
      e.target.previousElementSibling.focus();
    }
  }

  const handleOtpSubmit = async () => {
    try {
      NProgress.start(); // Start the progress bar

      const otpString = otpValues.join("");
      const response = await axios.post("https://admin.ezicalc.com/api/phone_verify", {
        phone: localStorage.getItem("phone"),
        otp: otpString,
      });

      NProgress.done(); // Complete the progress bar

      if (response.data.status) {
        await Swal.fire({
          text: 'Welcome to your Dashboard',
          icon: 'success',
          timer: 2000,
          position: 'top-end', 
        });

        localStorage.setItem('userId', response.data.data.user_id); 
        localStorage.setItem('clientId', response.data.data.client_id); 
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('packageId', response.data.data.package_id);


        console.log(response.data.data.token);
        if (userInfo?.package_id === null) {
          console.log("Navigating to subscription...");
          window.location.href = "/subscription";
        } else {
          console.log("Navigating to dashboard...");
          window.location.href = "/dashboard";
        }

        // navigate("/dashboard");
      } else {
        console.error("OTP verification failed:", response.data.message);
      }
    } catch (error) {
      NProgress.done(); // Complete the progress bar even if there's an error
      console.error("Error:", error);
    }
  };

  const showOtp = localStorage.getItem("otp");
  console.log(showOtp);

  return (
    <div>
      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mb-5 mx-auto md:h-screen lg:py-0">
          <img className="my-3 w-48 mb-5" src={regilogo} alt="regi" />
        
          <div className="w-full bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div>
                <h2 className="text-center font-semibold">A 6 digit OTP has been sent to your number, kindly apply it below</h2>
                <img className="w-24 h-24 mx-auto my-2" src={otp} alt="otp" />
              </div>

              <div className="px-4 bg-white rounded">
                <h1 className="text-center">OTP : {showOtp}</h1>
                <h2 className="mb-4 text-lg font-semibold text-center">Enter your OTP</h2>
                <div className="flex justify-center space-x-2">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={value}
                      className="w-10 h-10 text-center border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !value && index > 0) {
                          e.target.previousElementSibling.focus();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleOtpSubmit}
                className="btn bg-[#3AD5EA] w-full text-white my-4 px-3 py-2 hover:text-blue-600 hover:bg-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Otp;
