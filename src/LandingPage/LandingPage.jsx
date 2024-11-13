// import sampleImg from '../../assets/package_image.png';
import {
  FaDailymotion,
  FaDiscourse,
  FaEllipsisV,
  FaTimes,
} from "react-icons/fa"; // Import cross icon
import { RiBarChartHorizontalLine } from "react-icons/ri";
import React, { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { IoDiamond } from "react-icons/io5";
import { GiGoldBar } from "react-icons/gi";

import logo from "../../public/assets/pos-logo.png";
import banner from "../../public/assets/Hero.png";
import p1 from "../../assets/Product-Upload.png";
import p2 from "../../assets/User.png";
import p3 from "../../assets/invoice.png";
import p4 from "../../assets/cs.png";
import s1 from "../../assets/s1.png";
import s2 from "../../assets/s2.jpg";
import pp1 from "../../assets/p1.png";
import pp2 from "../../assets/p2.png";
import pp3 from "../../assets/p3.png";
import pp4 from "../../assets/p4.png";
import pp5 from "../../assets/p5.png";
import pp6 from "../../assets/p6.png";
import pp7 from "../../assets/p7.jpg";
import pp9 from "../../assets/p9.png";
import pp8 from "../../assets/p8.png";
import pp10 from "../../assets/p10.png";
import s3 from "../../assets/s3.png";
import s4 from "../../assets/s4.png";
import r1 from "../../public/assets/vector1.png";
import log3 from "../../assets/log3.png";
import sampleImg from "../../assets/package_image.png";

import Poster from "../../assets/Poster.png";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { GiTireIronCross } from "react-icons/gi";
import { Link } from "react-router-dom";
import axios from "axios";
import Register from "../Pages/Register/Register";
const LandingPage = () => {
  // const token = localStorage.getItem("token");

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const features = [
    {
      number: "01",
      title: "বিক্রয় এবং অর্থপ্রদান প্রক্রিয়া",
      description:
        "আমাদের POS সিস্টেমে বিক্রয় এবং অর্থপ্রদান প্রক্রিয়া সহজ এবং দ্রুত গ্রাহকরা নিরাপদে বিভিন্ন পেমেন্ট পদ্ধতি  ব্যবহার করে লেনদেন করতে পারেন।",
    },
    {
      number: "02",
      title: "প্রতিবেদন এবং বিশ্লেষণ",
      description:
        "আমাদের POS সিস্টেমের প্রতিবেদন এবং বিশ্লেষণ ফিচার ব্যবসায়ীদের জন্য গুরুত্বপূর্ণ তথ্য সরবরাহ করে, যা কার্যকরী সিদ্ধান্ত নিতে সহায়তা করে।",
    },
    {
      number: "03",
      title: "নিরাপদ দ্রুত লেনদেন",
      description:
        "আমাদের POS সিস্টেম নিরাপদ এবং দ্রুত লেনদেন নিশ্চিত করে, যা ব্যবসাকে সহজতর করে। উন্নত নিরাপত্তার মাধ্যমে গ্রাহকরা নির্ভরযোগ্য লেনদেনের অভিজ্ঞতা পান।",
    },
    {
      number: "04",
      title: "নিরাপদ দ্রুত লেনদেন",
      description:
        "আমাদের POS সিস্টেম নিরাপদ এবং দ্রুত লেনদেন নিশ্চিত করে, যা ব্যবসাকে সহজতর করে। উন্নত নিরাপত্তার মাধ্যমে গ্রাহকরা নির্ভরযোগ্য লেনদেনের অভিজ্ঞতা পান।",
    },
  ];

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApiData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://admin.ezicalc.com/api/package/all/get"
      );
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
    setExpandedPackageId(
      expandedPackageId === packageTypeId ? null : packageTypeId
    );
  };
  console.log(packages);

  // const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(packages);
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
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg px-4 md:px-6 lg:px-8 transition-colors duration-300">
        {/* Navbar container */}
        <div className="container mx-auto flex justify-between items-center py-3 md:py-4">
          {/* Left Section: Logo and Toggle */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                className="text-xl"
              >
                {isOpen ? <GiTireIronCross /> : <RiBarChartHorizontalLine />}
              </button>
            </div>

            {/* Logo */}
            <div className="w-[180px] md:w-[200px] lg:w-[220px]">
              <img src={logo} alt="logo" className="w-full h-auto" />
            </div>
          </div>

          {/* Middle Section: Menu Links (Visible on larger screens) */}
          <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-blue-600 transition">
              ফিচার
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              কাষ্টমার
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              প্রাইসিং
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              হেল্প পোষ্ট
            </a>
          </div>

          {/* Right Section: Contact Info and User Icon */}
          <div className="flex items-center space-x-3">
            {/* Contact Info */}
            <div
              className="hidden md:flex items-center text-white text-sm px-4 py-2 rounded transform -skew-x-12"
              style={{
                background: "linear-gradient(to right, #2EBEEC, #444EB4)",
              }}
            >
              <span className="transform skew-x-12 flex items-center gap-1">
                <TfiHeadphoneAlt /> ৮৮০-১৭৭৯০২৫৩২২
              </span>
            </div>

            {/* User Icon */}
            <Link to="/login" className="block md:ml-4">
              <img
                src={log3}
                alt="user"
                className="w-10 h-10 rounded-full border-2 border-gray-300"
              />
            </Link>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-60 text-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            background: isDarkMode
              ? "linear-gradient(to right, #1c1c1c, #444)"
              : "linear-gradient(to right, #2EBEEC, #444EB4)",
          }}
        >
          {/* Close Icon */}
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-2xl focus:outline-none"
            aria-label="Close Menu"
          >
            <GiTireIronCross size={20} />
          </button>

          {/* Drawer Links */}
          <div className="mt-16 space-y-4">
            <a
              href="#"
              className="block text-center hover:text-green-300 transition"
            >
              ফিচার
            </a>
            <a
              href="#"
              className="block text-center hover:text-green-300 transition"
            >
              কাষ্টমার
            </a>
            <a
              href="#"
              className="block text-center hover:text-green-300 transition"
            >
              প্রাইসিং
            </a>
            <a
              href="#"
              className="block text-center hover:text-green-300 transition"
            >
              হেল্প পোষ্ট
            </a>
          </div>
        </div>
      </nav>

      <div className="relative mt-24 flex flex-col md:flex-row items-center justify-between bg-[#f3f4f6] p-8 md:p-12 lg:p-16">
        {/* Content on the Left */}
        <div className="flex-1 md:w-[50%]">
          <div className="text-center md:text-left">
            {/* Headline */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-[#243E92]">
              Welcome to Ezicalc
            </h1>
            <p className="text-[#243E92] text-md md:text-lg lg:text-xl mb-6">
              Easy Solution for F-commerce Users
            </p>

            {/* Buttons - Always Side by Side */}
            <div className="flex gap-4 justify-center md:justify-start">
              <button className="bg-[#243E92] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold shadow-lg transition duration-300 hover:bg-[#333B85] transform hover:scale-105 text-sm md:text-base lg:text-lg">
                Start 15-Day Free Trial
              </button>
              <Link
                to="/register"
                className="bg-[#243E92] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold shadow-lg transition duration-300 hover:bg-[#333B85] transform hover:scale-105 text-sm md:text-base lg:text-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Image on the Right */}
        <div className="flex-1  flex items-center justify-center">
          <img
            src={banner}
            className="w-full sm:h-[250px] md:h-[300px] lg:h-[600px] object-contain rounded-lg"
            alt="Banner"
          />
        </div>
      </div>

      <div
        className={`grid md:grid-cols-12 grid-cols-6 gap-3 w-[80%] mx-auto my-8 py-6 rounded-xl transition-all duration-300 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-sky-300 text-white"
        }`}
        style={{
          background: isDarkMode
            ? "linear-gradient(to right, #2C3E50, #4CA1AF)"
            : "linear-gradient(to right, #2EBEEC, #444EB4)",
        }}
      >
        {/* First Column */}
        <div className="col-span-3 flex flex-col items-center">
          <img
            className="w-16 md:w-24 bg-white p-2 rounded-full"
            src={p1}
            alt="pppp"
          />
          <h1 className="md:text-xl text-xs">২০০০</h1>
          <h1 className="text-xs">পণ্য আপলোড</h1>
        </div>

        {/* Second Column */}
        <div className="col-span-3 flex flex-col items-center border-l border-white">
          <img
            className="bg-white p-2 rounded-full w-16 md:w-24"
            src={p2}
            alt="pppp"
          />
          <h1 className="md:text-xl text-xs">১০০</h1>
          <h1 className="text-xs">সক্রিয় ব্যবহারকারী</h1>
        </div>

        {/* Third Column */}
        <div className="col-span-3 flex flex-col items-center border-l border-white">
          <img
            className="bg-white p-2 rounded-full w-16 md:w-24"
            src={p3}
            alt="pppp"
          />
          <h1 className="md:text-xl text-xs">১০০</h1>
          <h1 className="text-xs">পণ্য আপলোড</h1>
        </div>

        {/* Fourth Column */}
        <div className="col-span-3 flex flex-col items-center border-l border-white">
          <img
            className="bg-white p-2 rounded-full w-16 md:w-24"
            src={p4}
            alt="pppp"
          />
          <h1 className="md:text-xl text-xs">১০০</h1>
          <h1 className="text-xs">পণ্য আপলোড</h1>
        </div>
      </div>

      <div className="mt-32 mb-8">
        <h1
          className={`md:text-2xl text-sm font-bold text-center my-5 ${
            isDarkMode ? "text-white" : "text-black"
          }font-poppins`}
        >
          {/* অনায়াসে{" "}
          <span className="text-sky-400">সরল এবং আশ্চর্যজনকভাবে কার্যকর</span> ,
          <br /> আমাদের পয়েন্ট অফ সেল সিস্টেম */}
          Discover the seamless efficiency of our{" "}
          <span className="text-sky-400">
            point-of-sale system simple in design,
          </span>{" "}
          ,
          <br /> yet remarkably powerful in performance
          <br />
        </h1>

        <div className="grid w-[80%] gap-3 mx-auto lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
          {/* Card 1 */}
          <div
            className={`card w-full px-5 ${
              isDarkMode ? "bg-gray-800" : "bg-[#2EBEEC]"
            }`}
          >
            <img
              src={s1}
              className="w-16 bg-white p-2 rounded-full my-4"
              alt="image"
            />
            <h1 className="text-white font-bold mb-4">
              Suitable for all f-commerce businesses
            </h1>
            <p className="text-white my-4 text-sm">
              The point of sale (POS) system we developed is for f-commerce
              businesses Perfect for. It simplifies every aspect of your online
              business Makes, where you can easily upload products, order
              management, and You can keep track of sales.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className={`card w-full px-5 ${
              isDarkMode ? "bg-gray-800" : "bg-[#2EBEEC]"
            }`}
          >
            <img
              src={s3}
              className="w-16 bg-white p-2 rounded-full my-4"
              alt="image"
            />
            <h1 className="text-white font-bold mb-4">
              Cost effective and budget-friendly
            </h1>
            <p className="text-white my-4 text-sm">
              Ezicalc system is designed in such a way So that it is cost
              effective and budget-friendly solution for every business works as
            </p>
          </div>

          {/* Card 3 */}
          <div
            className={`card w-full px-5 ${
              isDarkMode ? "bg-gray-800" : "bg-[#2EBEEC]"
            }`}
          >
            <img
              src={s2}
              className="w-16 bg-white p-2 rounded-full my-4"
              alt="image"
            />
            <h1 className="text-white font-bold mb-4">
              সহজে সেটআপ করা যায় এবং কোনো প্রযুক্তিগত জ্ঞান প্রয়োজন নেই
            </h1>
            <p className="text-white my-4 text-sm">
              ব্যবহারকারীর বন্ধুত্বপূর্ণ ইন্টারফেস এবং স্বয়ংক্রিয় সেটআপ গাইডের
              মাধ্যমে, আপনি সহজেই সিস্টেমটি চালু করতে পারবেন।
            </p>
          </div>

          {/* Card 4 */}
          <div
            className={`card w-full px-5 ${
              isDarkMode ? "bg-gray-800" : "bg-[#2EBEEC]"
            }`}
          >
            <img
              src={s4}
              className="w-16 bg-white p-2 rounded-full my-4"
              alt="image"
            />
            <h1 className="text-white font-bold mb-4">
              আধুনিক এবং আকর্ষণীয় ব্যবহারকারী ড্যাশবোর্ড
            </h1>
            <p className="text-white my-4 text-sm">
              ব্যবহারকারী ড্যাশবোর্ডে প্রয়োজনীয় সব তথ্য একজায়গায় পাওয়া
              যায়, যেমন বিক্রয় তথ্য, স্টক স্থিতি এবং গ্রাহক বিশ্লেষণ।
            </p>
          </div>
        </div>
      </div>

      <div className="w-[80%] mx-auto flex md:flex-row justify-between items-center flex-col gap-3">
        <div className="flex-1">
          {/* <img src={r1} className="w-[80%] md:w-full h-auto" alt="image" /> */}
        </div>

        <div className="flex-1">
          <h1
            className={`text-sky-500 text-center md:text-end ${
              isDarkMode ? "text-gray-800" : "text-gray-800"
            }`}
          >
            সফ্টওয়্যার মূল বৈশিষ্ট্য
          </h1>
          <p
            className={`md:text-2xl text-sm mt-2 font-bold mb-6 text-center md:text-end ${
              isDarkMode ? "text-gray-800" : "text-gray-800"
            }`}
          >
            বিশেষ বৈশিষ্ট্যসমূহ অভিজাত ডিজাইনসহ
          </p>

          <div
            className={`grid grid-cols-2 gap-1 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-4 rounded-lg`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col items-start rounded-lg p-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                } transition duration-200`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 ${
                    isDarkMode ? "bg-sky-500" : "bg-sky-400"
                  } text-white font-bold rounded-full`}
                >
                  {feature.number}
                </div>
                <h3
                  className={`mt-4 font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`w-[80%] mx-auto px-9 py-4 mt-16 rounded-lg ${
          isDarkMode ? "text-gray-300" : "text-white"
        }`}
        style={{
          background: isDarkMode
            ? "linear-gradient(to right, #1c1c1c, #444)"
            : "linear-gradient(to right, #2EBEEC, #444EB4)",
        }}
      >
        <h1
          className={`text-center text-2xl mt-8 font-bold ${
            isDarkMode ? "text-gray-100" : "text-white"
          }`}
        >
          আমাদের আধুনিক POS সলিউশনের সাথে আপনার ব্যবসাকে উন্নত করুন
        </h1>
        <p
          className={`text-center md:w-[60%] w-full mx-auto text-sm mt-8 ${
            isDarkMode ? "text-gray-400" : "text-white"
          }`}
        >
          লেনদেনের ভবিষ্যতের অভিজ্ঞতা! আজই একটি ডেমো নির্ধারণ করুন এবং সাক্ষী
          হোন কিভাবে আমাদের POS সমাধান আপনার ব্যবসায় বিপ্লব ঘটাতে পারে। আমাদের
          অত্যাধুনিক প্রযুক্তি আপনার লেনদেনের প্রক্রিয়াকে দ্রুত, নিরাপদ এবং সহজ
          করে তুলবে। অটোমেটেড ফিচার এবং রিয়েল-টাইম ডেটা বিশ্লেষণের মাধ্যমে,
          ব্যবসার প্রতিটি পদক্ষেপ হবে আরও স্মার্ট এবং দক্ষ। এখনই আমাদের POS
          সিস্টেম ব্যবহার শুরু করে আপনার ব্যবসার নতুন দিগন্ত উন্মোচন করুন।
        </p>

        <div className="flex justify-center gap-4 mt-8 mb-5">
          <button
            className={`p-3 rounded-lg font-bold ${
              isDarkMode ? "bg-gray-600 text-white" : "bg-sky-400 text-white"
            }`}
          >
            বিনামূল্যে ট্রায়াল শুরু করুন
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-bold ${
              isDarkMode ? "bg-gray-300 text-gray-800" : "bg-white text-sky-500"
            }`}
          >
            এখনই কিনুন
          </button>
        </div>
      </div>

      <div className="w-[80%] mx-auto">
        <div className=" text-center">
          <h1 className="my-5 text-sky-400">আমাদের মূল্য নির্ধারণ</h1>
          <h1 className=" text-xl font-bold">
            স্বচ্ছ মূল্য পরিকল্পনা, আপনার চাহিদার জন্য সঠিক নির্বাচন করুন
          </h1>
        </div>

        <div>
          {loading ? (
            <div className="text-center text-gray-500 text-lg p-4">
              <span className="loading loading-ring loading-md"></span>
              <h1 className=" text-sky-500"> Loading packages....</h1>
            </div>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.package_type_id}
                className="border p-4 my-2 rounded-lg shadow"
              >
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
                    {expandedPackageId === pkg.package_type_id ? "-" : "+"}
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
                              <p className="text-gray-500">
                                One line about the package
                              </p>
                              <p className=" text-sky-500">{p.name}</p>
                            </div>
                            <hr className="border-t border-gray-300 opacity-50" />

                            <div className="bg-slate-100 px-4 md:px-8 py-4">
                              <div className="text-center px-4 flex items-center">
                                <span className="mr-2 text-md md:text-lg text-gray-500">
                                  only
                                </span>
                                <div className="text-2xl md:text-4xl font-bold"></div>
                                <span className="mx-1 text-2xl md:text-4xl font-bold">
                                  ৳ {p.price}
                                </span>
                                <span className="mx-1 text-md md:text-lg text-gray-500">
                                  /month
                                </span>
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
                              <h1 className="my-2 text-sky-600">
                                Create Business: business {p.business}
                              </h1>
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                              <h1 className="my-2 text-sky-600">
                                Create User: {p.user}
                              </h1>
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                              <h1 className="my-2 text-sky-600">
                                Invoice Template: {p.invoice}
                              </h1>
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                              <h1 className="my-2 text-sky-600">
                                SMS: {p.sms}
                              </h1>
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                              <h1 className="my-2 text-sky-600">
                                Create Product: {p.product}
                              </h1>
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                              <h1 className="my-2 text-sky-600">
                                Warehouse: {p.stock}
                              </h1>
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                              <h1 className="my-2 text-sky-600">
                                Order: {p.order}
                              </h1>
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                              <h1 className="my-2 text-sky-600">
                                Follow Up: {p.follow_up}
                              </h1>
                              <hr className="border-t border-gray-300 my-2 opacity-50 w-[80%] mx-auto" />
                              <h1 className="my-2 text-sky-600">
                                POS Data: {p.data}
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
                                Target Audience:
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
            ))
          )}
        </div>
      </div>

      <div className=" mt-6 mb-6">
        <div className="w-[80%] mx-auto  flex md:flex-row justify-between items-center mb-5  flex-col ">
          <div className=" flex-1   ">
            <img
              src={Poster}
              className=" md:w-[70%] h-auto ml-3 md:ml-20 "
              alt="image"
              srcset=""
            />
          </div>

          <div className=" flex-1">
            <h1 className=" text-sky-500 mt-6 md:mt-2 ">যোগাযোগ করুন</h1>
            <p className=" md:text-2xl text-sm mt-2 font-bold mb-6 ">
              সরাসরি যোগাযোগ করুন! আজই আমাদের কাছে পৌঁছান
            </p>

            <div className=" flex gap-4">
              <input
                type="text"
                placeholder="পুরো নাম"
                className="input input-bordered bg-gray-100 w-full "
              />
              <input
                type="text"
                placeholder="ইমেইল"
                className="input input-bordered w-full bg-gray-100 "
              />
            </div>
            <div className=" flex gap-4 mt-3 mb-3">
              <input
                type="text"
                placeholder="মোবাইল"
                className="input input-bordered bg-gray-100 w-full "
              />
              <input
                type="text"
                placeholder="বিষয়"
                className="input input-bordered w-full bg-gray-100 "
              />
            </div>

            <textarea
              placeholder="বিস্তারিত লিখুন . . . . ."
              className="textarea textarea-bordered textarea-lg w-full bg-gray-100 "
            ></textarea>

            <div className=" flex justify-center my-4">
              <button className="btn bg-sky-400 text-center text-white">
                বার্তা পাঠান
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-[80%] mx-auto mb-6">
        <h1 className="font-bold text-3xl text-center mt-14">
          POS সফ্টওয়্যার সিস্টেম বৈশিষ্ট্য
        </h1>

        <div className="grid w-[90%] py-10 mx-auto gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 text-center">
          <div>
            <img
              src={pp2}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1>পণ্য স্টক রিপোর্ট</h1>
          </div>
          <div className=" mt-2">
            <img
              src={pp1}
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
              alt="image"
            />
            <h1 className=" mt-3 ">দ্রুত বিলিং চালান</h1>
          </div>
          <div>
            <img
              src={pp3}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1>পণ্য স্টক রিপোর্ট অনুযায়ী</h1>
          </div>
          <div>
            <img
              src={pp4}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1>অটো সুকু জেনারেট</h1>
          </div>
          <div>
            <img
              src={pp5}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1>মাসিক ব্যাকআপ</h1>
          </div>
          <div>
            <img
              src={pp6}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1>পণ্যের জন্য বারকোড স্ক্যানার</h1>
          </div>
          <div>
            <img
              src={pp7}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1>ব্যবহারকারীদের জন্য টিউটোরিয়াল</h1>
          </div>
          <div>
            <img
              src={pp9}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1 className="">একাধিক চালান টেমপ্লেট</h1>
          </div>
          <div>
            <img
              src={pp8}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1>গ্রাহক ডেটা রিপোর্ট</h1>
          </div>
          <div>
            <img
              src={pp10}
              alt="image"
              className="w-16 md:w-24 h-16 md:h-24 mx-auto"
            />
            <h1>ঝামেলা মুক্ত বিল পরিশোধ</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
