import React, { useState, useEffect } from "react";
import Select from "react-select";
import Datepicker from "react-tailwindcss-datepicker";
import { useNavigate } from "react-router-dom";

import { ImSpinner10 } from "react-icons/im";

import { IoClose } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import CategoryItems from "../../Component/CategoryItems";
import ImageDrawer from "../../Component/Product/ImageDrawer";

import axios from "axios";
import toast from "react-hot-toast";
import ProductSelectedBusiness from "./ProductSelectedBusiness";
import StockLocation from "../../Component/Product/StockLocation";

import { LuImagePlus } from "react-icons/lu";

const CreateProduct = () => {
  const [image, setImage] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const productImage = (id) => {
    setImage(id);

    console.log(id);
  };

  // Update selected image when an image is selected

  const clientId = localStorage.getItem("clientId");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [short_desc, setShort_desc] = useState("");
  const [category_id, setCategoryId] = useState("");

  const [stockLocationId, setStockLocationId] = useState("");

  const [businessId, setBusinessId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");

  const [code, setCode] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");

  const [discountType, setDiscountType] = useState("fixed");


  const [discountDate, setDiscountDate] = useState("");

  const [upload_by, setUpload_by] = useState("");

  const generateRandomCode = () => {
    const prefix = "EPP";
    const randomNumber = Math.floor(
      10000000 + Math.random() * 90000000
    ).toString();
    const randomCode = `${prefix}${randomNumber}`;
    setCode(randomCode);
  };

  useEffect(() => {
    generateRandomCode();
  }, []);

  const handleCategoryIdChange = (id) => {
    setCategoryId(id);
  };

  const handleLocationIdChange = (id) => {
    setStockLocationId(id);

    console.log(stockLocationId);
  };

  const handleBusinessIdChange = (id) => {
    setBusinessId(id);
    // console.log('Updated category_id:', id);
  };

  const [isOpen, setIsOpen] = useState(false);

  // const [selectedFile, setSelectedFile] = useState(null);

  const [images, setImages] = useState([]);

  const [errors, setErrors] = useState({});

  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  // for image upload

  const [variationsData, setVariationsData] = useState([]);

  useEffect(() => {
    const fetchVariation = async () => {
      try {
        const response = await axios.get(
          `https://admin.ezicalc.com/api/product/variation/values/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          setVariationsData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching variationsData:", error);
      }
    };
    fetchVariation();
  }, [token, clientId]);

  // console.log(variationsData);

  const [variationIds, setVariationIds] = useState([]);
  const [variationValuesIds, setVariationValuesIds] = useState([]);
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState([
    {
      selectedVariation: null,
      options: [],
      selectedValues: [],
      price: "",
      stock: "",
      discount: "",
      code: "",
    },
  ]);

  const variationOptions = variationsData.map((variation) => ({
    id: variation.id,
    value: variation.name.toLowerCase(),
    label: variation.name.toLowerCase(),
    variationValues: variation.variation_values.map((v) => ({
      id: v.id,
      name: v.name.trim(),
    })),
  }));

  const handleCheckboxChange = (e) => {
    // e.preventDefault()
    setHasVariations(!hasVariations);
    setHasVariation(e.target.checked ? 1 : 0);
  };

  // const handleVariationChange = (selectedOption, index) => {
  //   const updatedVariations = [...variations];
  //   updatedVariations[index].selectedVariation = selectedOption;
  //   updatedVariations[index].options = getOptionsForVariation(
  //     selectedOption.value
  //   );
  //   updatedVariations[index].selectedValues = []; // Reset selected values when changing variation
  //   setVariations(updatedVariations);

  //   setVariationIds((prevVariationId) => {
  //     if (!prevVariationId.includes(selectedOption.id)) {
  //       return [...prevVariationId, selectedOption.id]; // Append new id
  //     }
  //     return prevVariationId; // If already present, return unchanged
  //   });
  // };

  // const handleValuesChange = (selectedOptions, index) => {
  //   const updatedVariations = [...variations];
  //   updatedVariations[index].selectedValues = selectedOptions;
  //   setVariations(updatedVariations);

  //   const selectedValues = selectedOptions
  //     ? selectedOptions.map((option) => option.value)
  //     : [];

  //   setVariationValuesIds((prevVariationValuesId) => {
  //     const updatedVariationValues = [...prevVariationValuesId];
  //     updatedVariationValues[index] = selectedValues; // Replace or add the values for the specific index
  //     return updatedVariationValues;
  //   });
  // };

  const handleVariationChange = (selectedOption, index) => {
    const updatedVariations = [...variations];
    updatedVariations[index].selectedVariation = selectedOption;
    updatedVariations[index].options = getOptionsForVariation(
      selectedOption.value
    );
    updatedVariations[index].selectedValues = []; // Reset selected values when changing variation
    setVariations(updatedVariations);

    // Do not setVariationIds yet. Only set it after values are selected.
  };

  const handleValuesChange = (selectedOptions, index) => {
    const updatedVariations = [...variations];
    updatedVariations[index].selectedValues = selectedOptions;
    setVariations(updatedVariations);

    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];

    setVariationValuesIds((prevVariationValuesId) => {
      const updatedVariationValues = [...prevVariationValuesId];
      updatedVariationValues[index] = selectedValues; // Replace or add the values for the specific index
      return updatedVariationValues;
    });

    // Once values are selected, we add the variation ID
    setVariationIds((prevVariationId) => {
      const variationId = updatedVariations[index].selectedVariation.id;

      // Ensure the variationId is only added after selecting values
      if (!prevVariationId.includes(variationId) && selectedValues.length > 0) {
        return [...prevVariationId, variationId]; // Append new id if values are selected
      }
      return prevVariationId; // If already present or no values selected, return unchanged
    });
  };

  // Handle input change for price, stock, discount, and code in combinations
  const handleInputChange = (e, index, field) => {
    const updatedCombinations = [...combinations]; // Copy the current combinations state
    updatedCombinations[index][field] = e.target.value; // Update the specific field
    setCombinations(updatedCombinations); // Update state with new combinations
  };

  const handleDelete = (index) => {
    const updatedVariations = variations.filter((_, i) => i !== index);
    setVariations(updatedVariations);
    setVariationIds((prevIds) => prevIds.filter((_, i) => i !== index));
    setVariationValuesIds((prevValues) =>
      prevValues.filter((_, i) => i !== index)
    );
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        selectedVariation: null,
        options: [],
        selectedValues: [],

        buying_price: "",
        price: "",
        stock: "",
        discount_date: "",
        discount_type: "fixed",
        discount: "",
        code: "",
      },
    ]);
  };

  const getOptionsForVariation = (variationType) => {
    const variation = variationsData.find(
      (v) => v.name.toLowerCase() === variationType.toLowerCase()
    );

    if (!variation) {
      return [];
    }

    return variation.variation_values.map((value) => ({
      value: value.name.toLowerCase().trim(),
      label: value.name.charAt(0).toUpperCase() + value.name.slice(1).trim(),
    }));
  };

  const [combinations, setCombinations] = useState([]); // Define combinations state

  // Function to generate combinations
  const generateCombinations = () => {
    const selectedVariations = variations.filter(
      (v) => v.selectedValues.length > 0
    );
    if (selectedVariations.length === 0) return [];

    const combinations = selectedVariations.reduce((acc, currVariation) => {
      const newCombinations = [];
      currVariation.selectedValues.forEach((value) => {
        if (acc.length === 0) {
          newCombinations.push({
            values: [value],
            buying_price: "",
            price: "",
            stock: "",
            discount_type: "fixed",

            discount_date: "",

            discount: "",
            code: code,
          });
        } else {
          acc.forEach((existingCombination) => {
            newCombinations.push({
              values: [...existingCombination.values, value],

              buying_price: existingCombination.buying_price || "",

              price: existingCombination.price || "",
              stock: existingCombination.stock || "",
              discount_date: existingCombination.discount_date || "",
              discount_type: existingCombination.discount_type || "",

              discount: existingCombination.discount || "",
              code: code,
            });
          });
        }
      });
      return newCombinations;
    }, []);

    return combinations;
  };

  // Generate combinations and store in state
  useEffect(() => {
    setCombinations(generateCombinations());
  }, [variations]);

  // console.log('variationIds:' + variationIds);

  // console.log('variationValuesIds:' + variationValuesIds);

  // console.log(combinations);

  const cacheKey = `products_${clientId}`;
  const cacheTimeKey = `products_${clientId}_timestamp`;

  const [hasVariation, setHasVariation] = useState(0);

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("user_id", userId);

    formData.append("created_by", userId);

    formData.append("name", name);
    formData.append("short_desc", short_desc);
    formData.append("category_id", category_id);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("code", code);
    formData.append("is_published", status);
    formData.append("has_variation", hasVariation);

    formData.append("business_ids", businessId);

    formData.append("discount_date", discountDate);

    formData.append("discount_type", discountType);


    formData.append("discount_amount", discountAmount);
    formData.append("buying_price", buyingPrice);
    formData.append("is_discount", 0);

    formData.append("stock_location_id", stockLocationId);

    formData.append("variation_ids", JSON.stringify(variationIds));
    formData.append("variation_values", JSON.stringify(variationValuesIds));
    formData.append("combinations", JSON.stringify(combinations));

    // console.log(formData);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/product/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.data.status) {
        toast.success(response.data.message || "product upload successfully!", {
          duration: 2000,
          position: "top-right",
        });

        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimeKey);

        // Reset form fields
        setName("");

        setPrice("");
        setStock("");
        setDiscountAmount("");

        setDiscountType("");


        setBusinessId("");
        setCategoryId("");
        setShort_desc("");

        setErrors({});

        navigate("/product/all-product");
      } else {
        setErrors(response.data.error || {});

        console.log(response.data.error);
      }
    } catch (error) {
      console.error(
        "Error saving business:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "An error occurred while saving the business. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // setVariationValuesId(variations.selectedValues)

  // handle Svae .............

  return (
    <div id="section-1" className="mx-4 md:mx-10">
      <div className="w-full shadow-sm py-4 flex items-center pe-4 mb-4 rounded-md border border-gray-300">
        <h2 className="px-4 text-xl font-semibold ">Create Product</h2>
      </div>

      <div id="section-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* "Select Option" Div */}
          <div className="md:col-span-1 order-1 md:order-2">
            <div className="mb-4 p-4 rounded-md shadow-sm transition duration-300 ease-in-out hover:border-blue-500 border border-gray-300">
              <label
                htmlFor="dropdown"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Select Business
              </label>
              <ProductSelectedBusiness
                onBusinessIdChange={handleBusinessIdChange}
                className="rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out hover:border-blue-400"
              />

              {errors.business_ids && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.business_ids[0]}
                </p>
              )}
            </div>

            <div className=" p-4 rounded-md shadow-sm transition duration-300 ease-in-out hover:border-blue-500 border border-gray-300">
              <label
                htmlFor="category_id"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Warehouse Location
              </label>
              <StockLocation onLocationIdChange={handleLocationIdChange} />
              {errors.stock_location_id && (
                <p className="text-red-500 text-sm">
                  {errors.stock_location_id[0]}
                </p>
              )}
            </div>
          </div>

          {/* Left Side Content */}

          <form
            onSubmit={handleSave}
            className="md:col-span-2 order-2 md:order-1"
          >
            <div className="mb-4">
              <label
                htmlFor="Product_name"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              {/* <input
                name="name"
                type="text"
                className="mt-1 block w-full rounded-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 
             0"
                id="Product_name"
                value={name}
                placeholder="Product Name"
                onChange={(e) => setName(e.target.value)}
              /> */}

              <input
                name="name"
                type="text"
                id="Product_name"
                value={name}
                placeholder="Product Name"
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition hover:border-blue-500 placeholder-gray-400"
              />

              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name[0]}</p>
              )}
              <span className="text-red-500 error-text product_name_error"></span>
            </div>

            <div className="mb-4">
              <label
                htmlFor="short_desc"
                className="block text-sm font-medium text-gray-700"
              >
                Short Description
              </label>
              {/* <textarea
                value={short_desc}
                onChange={(e) => setShort_desc(e.target.value)}
                name="short_desc"
                id="short_desc"
                className="mt-1 w-full rounded-3 h-36 p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:border-blue-500 focus:outline-none  focus:ring-blue-500"
              /> */}

              <textarea
                value={short_desc}
                onChange={(e) => setShort_desc(e.target.value)}
                name="short_desc"
                id="short_desc"
                placeholder="Enter a brief description..."
                className="mt-1 w-full h-36 p-3 border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-blue-500 transition duration-200 ease-in-out"
              />
            </div>
            {/* {errors.short_desc && (
              <p className="text-red-500 text-sm">{errors.short_desc[0]}</p>
            )} */}

            {/* Image Upload Start */}

            <div className="mb-4 " id="">
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700 required"
              >
                Image
              </label>

              <div className="relative">
                {/* Drawer Toggle Button */}
                <button
                  type="button"
                  onClick={toggleDrawer}
                  className="rounded w-full flex flex-col items-center cursor-pointer bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 py-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="70"
                    height="70"
                    viewBox="0 0 80 80"
                    fill="none"
                    className="mb-2"
                  >
                    {image ? (
                      <image
                        href={`https://admin.ezicalc.com/public/storage/product/${image}`}
                        width="90"
                        height="70"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="70"
                        height="70"
                        viewBox="0 0 80 80"
                        fill="none"
                        className="mb-2"
                      >
                        <circle cx="40" cy="40" r="40" fill="#D9D9D9" />
                        <line
                          x1="20"
                          y1="40"
                          x2="60"
                          y2="40"
                          stroke="white"
                          strokeWidth="4"
                        />
                        <line
                          x1="40"
                          y1="20"
                          x2="40"
                          y2="60"
                          stroke="white"
                          strokeWidth="4"
                        />
                      </svg>
                    )}
                  </svg>

                  <div className="mt-2 text-center">Add Image</div>
                </button>
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mx-4">{errors.image[0]}</p>
              )}
            </div>

            {/* Image Upload End */}

            {/* Product Category & Product Status Start*/}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
              id="section-3"
            >
              <div>
                <div className="mb-2 px-4 py-3 h-28 bg-white flex flex-col border border-gray-300 rounded-md shadow-sm transition duration-300 ease-in-out hover:border-blue-400 ">
                  <label
                    htmlFor="category_id"
                    className="block text-base font-semibold text-gray-800 mb-4"
                  >
                    Product Category
                  </label>
                  <CategoryItems onCategoryIdChange={handleCategoryIdChange} />
                  {errors.category_id && (
                    <p className="text-red-600 text-sm ">
                      {errors.category_id[0]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 px-4 py-3 h-28 bg-white flex flex-col border border-gray-300 rounded-md shadow-sm transition duration-300 ease-in-out hover:border-blue-400 ">
                  <label
                    htmlFor="product_status"
                    className="block text-base font-semibold text-gray-800 mb-4"
                  >
                    Product Status
                  </label>
                  <select
                    name="product_status"
                    id="product_status"
                    className="form-select rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3  focus:outline-none"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="1">On</option>
                    <option value="0">Off</option>
                  </select>
                  <span className="text-red-600 text-sm error-text product_status_error"></span>
                </div>
              </div>
            </div>
            {/* Product Category & Product Status End */}

            {/* variation code start */}

            <div className="col-span-12 shadow-sm border border-gray-300 rounded-md transition duration-300 ease-in-out hover:border-blue-400 ">
              <div className="mb-3 py-4 shadow bg-white flex-shrink-0">
                <div className="flex justify-between mb-2">
                  <div className="mx-4 my-2 text-lg font-semibold">
                    Price, Stock, Code
                  </div>
                  <div className="mx-4 my-2 flex items-center">
                    <input
                      type="checkbox"
                      className="toggle toggle-info scale-75"
                      checked={hasVariations}
                      onChange={handleCheckboxChange}
                      aria-label="Toggle Variations"
                    />
                    <span className="ml-2">Has Variations?</span>
                  </div>
                </div>

                {!hasVariations && (
                  <div className="container-fluid">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mx-5 items-center">
                      <div className="col-span-1">
                        <div className="mb-3">
                          <label className="form-label">Cost Price</label>
                          <input
                            type="number"
                            className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-full"
                            id="price"
                            placeholder="Enter cost price"
                            aria-label="Price"
                            onChange={(e) => setBuyingPrice(e.target.value)}
                          />

                          {errors.buying_price && (
                            <p className="text-red-500 text-sm">
                              {errors.buying_price[0]}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-2">
                        <label
                          htmlFor="stock"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Stock
                        </label>
                        <input
                          type="number"
                          className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-full"
                          id="stock"
                          placeholder="Enter stock"
                          aria-label="Stock"
                          onChange={(e) => setStock(e.target.value)}
                        />
                        {errors.stock && (
                          <p className="text-red-500 text-sm">
                            {errors.stock[0]}
                          </p>
                        )}
                      </div>

                      <div className="mb-2">
                        <label
                          htmlFor="code"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Code
                        </label>
                        <input
                          type="text"
                          className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-full"
                          id="code"
                          placeholder="Enter code"
                          aria-label="Code"
                          value={code} // Set the input field value to the generated code
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {hasVariations && (
                <div className="mb-4 py-4 bg-white shadow">
                  <div className="mx-5">
                    {variations.map((variation, index) => (
                      <div key={index} className="">
                        <div className="mb-6">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Variation
                              </label>
                              <Select
                                options={variationOptions}
                                className="rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300"
                                placeholder="Select a variation"
                                isSearchable
                                onChange={(selectedOption) =>
                                  handleVariationChange(selectedOption, index)
                                }
                                value={variation.selectedVariation}
                              />
                            </div>

                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Values
                              </label>
                              <Select
                                id="variation_value_ids"
                                options={variation.options || []}
                                className="rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300"
                                placeholder="Select values"
                                isSearchable
                                isMulti
                                onChange={(selectedOptions) =>
                                  handleValuesChange(selectedOptions, index)
                                }
                                value={variation.selectedValues}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addVariation}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none mb-6"
                    >
                      + Add another variation
                    </button>
                  </div>
                  <div className="mx-4 mb-6 overflow-x-auto">
                    <div className="border rounded p-2 bg-gray-100">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Variation & Value
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Costing Price
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              selling Price
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Discount
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fixed or %
                            </th>

                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Discount Date
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Code
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Remove
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {combinations.map((combination, combIndex) => (
                            <tr key={`comb-${combIndex}`}>
                              <td className="px-4 py-4 whitespace-nowrap">
                                {combination.values.map((value, i) => (
                                  <span key={i} className="block">
                                    {value.label}
                                  </span>
                                ))}
                              </td>

                              <td className="px-2 py-4 whitespace-nowrap">
                                <input
                                  required
                                  type="number"
                                  value={combination.buying_price || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      combIndex,
                                      "buying_price"
                                    )
                                  }
                                  className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2  w-[120px]"
                                  placeholder="cost price"
                                />
                              </td>

                              <td className="px-2 py-4 whitespace-nowrap">
                                <input
                                  required
                                  type="number"
                                  value={combination.price || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, combIndex, "price")
                                  }
                                  className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2  w-[120px]"
                                  placeholder="price"
                                />
                              </td>
                              <td className="px-2 py-4 whitespace-nowrap">
                                <input
                                  required
                                  type="number"
                                  value={combination.stock || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, combIndex, "stock")
                                  }
                                  className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-[120px]"
                                  placeholder="stock"
                                />
                              </td>

                              <td className="px-2 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  value={combination.discount || ""}
                                  onChange={(e) =>
                                    handleInputChange(e, combIndex, "discount")
                                  }
                                  className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-[120px]"
                                  placeholder="discount"
                                />
                              </td>

                              <td className="px-2 py-4 whitespace-nowrap">
                                    <select
                                  name=""
                                  className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-[120px]"
                                  onChange={(e) =>  handleInputChange(e, combIndex, "discount_type")}
                                >
                                  <option selected value="fixed">Fixed</option>
                                  <option value="percent">Percent</option>

                                </select>
                              </td>

                              <td className="px-2 py-4 whitespace-nowrap">
                                <input
                                  type="date"
                                  value={combination.discount_date || ""}
                                  onClick={(e) => e.target.showPicker()}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      combIndex,
                                      "discount_date"
                                    )
                                  }
                                  className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-[120px]"
                                  placeholder="date"
                                />
                              </td>

                              <td className="px-2 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  value={code}
                                  onChange={(e) =>
                                    handleInputChange(e, combIndex, "code")
                                  }
                                  className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-[120px]"
                                  placeholder="Enter code"
                                />
                              </td>
                              <td className="px-2 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleDelete(combIndex)}
                                  className="text-red-500 hover:text-red-700 focus:outline-none"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {!hasVariations && (
                <div className=" shadow-sm rounded-md hover:border-blue-500 focus:outline-none  focus:ring-blue-500 bg-white">
                  <div className="card-body p-4" id="section-7">
                    <h5 className="mb-4 text-lg font-semibold">
                      Product Costing / Discount
                    </h5>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4 items-center">
                      <div className="mb-2">
                        <label
                          htmlFor="Selling price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Selling Price
                        </label>
                        <input
                          type="number"
                          className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-full"
                          id="price"
                          placeholder="Enter price"
                          aria-label="Price"
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        {errors.price && (
                          <p className="text-red-500 text-sm">
                            {errors.price[0]}
                          </p>
                        )}
                      </div>

                     

                      <div className="col-span-1">
                        <div className="mb-3">
                          <label className="form-label">Discount Amount</label>
                          <input
                            type="number"
                            name="discount_value"
                            defaultValue=""
                            className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-full"
                            onChange={(e) => setDiscountAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-span-1">
                        <div className="mb-3">
                          <label className="form-label">Percent Or Fixed</label>
                          <select
                            name="discount_type"
                            className="py-[9px] rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-full"
                            onChange={(e) => setDiscountType(e.target.value)}
                          >
                            <option selected value="fixed">Fixed</option>
                            <option  value="percent">Percent</option>

                          </select>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="mb-3">
                          <label className="form-label">Discount Date</label>
                          <input
                            type="date"
                            onClick={(e) => e.target.showPicker()}
                            className="form-control rounded-lg shadow border hover:border-blue-500 focus:outline-none  focus:ring-blue-500 border-gray-300 p-2 w-full"
                            placeholder="Enter discount"
                            onChange={(e) => setDiscountDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* variation code end */}

            <div className="flex justify-end mt-4">
              <button
                className="btn hover:bg-[#444CB4] bg-[#28DEFC] text-white px-5 text-lg"
                type="submit"
              >
                {loading ? (
                  <div className="flex justify-center w-full">
                    <ImSpinner10
                      className="animate-spin text-white"
                      size={20}
                    />
                    <span className="px-2">Uploading...</span>
                  </div>
                ) : (
                  <>Upload</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Drawer */}

        <ImageDrawer
          isOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
          productImage={productImage}
        />

        {/* end Bottom Drawer */}
      </div>
    </div>
  );
};

export default CreateProduct;
