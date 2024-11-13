import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { ImSpinner10 } from "react-icons/im";


export default function ImageDrawer({ isOpen, toggleDrawer, productImage }) {
  const [image, setImage] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTopIndex, setSelectedTopIndex] = useState(null);
  const [selectedBottomIndex, setSelectedBottomIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [loading, setLoading] = useState(false);


  const [ImageProduct, setImageProduct] = useState(""); 


  useEffect(() => {
    if (ImageProduct) {
      productImage(ImageProduct);
    }
  }, [ImageProduct, productImage]);

  const handleTopSelect = (index) => {
    setSelectedTopIndex(index);
  };


  const clientId = localStorage.getItem("clientId");
  const token = localStorage.getItem("token");



 

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };


 

  const handleImageSave = async (e) => {
    e.preventDefault();

    // Validate image selection
    if (!image) {
      toast.error("Please select an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("image", image);

    try {
      // Upload the image
      const response = await axios.post(
        "https://admin.ezicalc.com/api/product/image/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle the response
      if (response.data.status) {
        toast.success("Image uploaded successfully!", {
            duration: 2000,
            position: "top-right",
        });
    
        const uploadedImageId = response.data.data.id;
        console.log('Uploaded Image ID:', uploadedImageId);
    
        // Clear states after upload
        setErrors({});
        setSelectedFile(null); // Clear the selected file after upload
        setImage(null); // Clear image file
        setImages([]); 
    
        document.getElementById('customFile').value = '';


        await fetchImages(uploadedImageId); 

        toggleDrawer();

        console.log('trr');

      } else {
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error("Error saving image:", error.response ? error.response.data : error.message);
      toast.error("An error occurred while saving the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (id) => {
    try {
        const response = await axios.get(
            `https://admin.ezicalc.com/api/product/image/get/${clientId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setImages(response.data.data || []);
        
        console.log(id);
       handleImageSelect(id ,response.data.data);

        // Ensure images are always set to an array
        console.log("Fetched images:", response.data.data); // Log fetched images
    } catch (error) {
        console.error("Error fetching images:", error.response ? error.response.data : error.message);
    }
};

  useEffect(() => {
    if (token) {
      fetchImages(); // Fetch images whenever token changes
    }
  }, [token]);



   const handleImageSelect = (id ,imagess) => {

    console.log(id);

    console.log('tttttttt');
    console.log(imagess);


    const selectedImage = imagess.find((image) => image.id === id);

    if (selectedImage) {
      console.log('Image selected:', selectedImage.id);

      console.log('found');
      setSelectedImage(selectedImage.name);
      setImageProduct(selectedImage.name);
      handleTopSelect(id); // Call top selection handler
    }
  };


  return (
    <div>




      <div
        className={`fixed inset-x-0 bottom-0 bg-white z-40 shadow-lg transition-transform transform h-[100%] ${isOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="h-full flex flex-col justify-between">
          <div className="overflow-auto">
            <div className="text-lg font-semibold">
              <div className="px-4 mb-6 w-full text-lg font-semibold bg-gray-100 h-16 flex items-center justify-between shadow-md rounded-lg">
                <span className="text-gray-800">
                  Recently uploaded files
                </span>
                <div className="flex justify-end">
                  <button
                    className="mr-4 text-[30px] cursor-pointer hover:text-[#28DEFC]"
                    onClick={toggleDrawer} // Close the drawer when clicked
                  >
                    <IoClose />
                  </button>
                </div>
              </div>





              <div className="flex justify-between mx-4 gap-2">
                <div className="mb-3">
                  <div className="flex flex-wrap gap-3">
                  {images.slice(0, 3).map((image, index) => (
                <div
                  key={image.id} // Use image.id as key
                  className={`relative bg-white shadow-md h-52 w-full md:w-60 flex items-end cursor-pointer transition duration-200 ${
                    selectedTopIndex === image.id ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => handleImageSelect(image.id , images)} // Pass image.id to handleImageSelect
                >
                  <img
                    src={`https://admin.ezicalc.com/public/storage/product/${image.name}`}
                    alt="img"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute w-full py-1 px-3 bottom-0 bg-white shadow-md text-sm">
                    Image Name
                    <div className="text-sm">jpeg</div>
                  </div>
                  {selectedTopIndex === image.id && (
                    <div className="absolute flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full top-2 right-2">
                      ✓
                    </div>
                  )}
                </div>
          ))}


                  </div>
                </div>
                <div className="flex  gap-2">
                  {selectedFile && (
                    <div className="ml-4">
                      <img
                        src={selectedFile}
                        alt="Selected"
                        className="h-52 w-auto object-cover border-2 border-blue-500"
                      />
                    </div>
                  )}
                  <div className="flex justify-center items-center border-4 border-dashed border-[#606BD0] bg-white h-52 w-full">
                    <form onSubmit={handleImageSave} id="imageUploadFrom">
                      <div className="text-center px-2">
                        <input
                          type="file"
                          id="customFile"
                          className=" block h-10 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                          accept="image/*"
                          onChange={handleFileChange}
                        />

                        <button

                          className="mt-3 bg-blue-500 text-white py-2 px-4 rounded" disabled={loading}
                        >
                          {loading ? (
                            <div className='flex justify-center w-full'>
                              <ImSpinner10 className='animate-spin text-white' size={20} />
                              <span className='px-2'>Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <h1 className=' font-bold'>  Upload
                              </h1>
                            </>
                          )}
                        </button>
                        {errors.image && (
                          <p className="text-red-500 text-sm">
                            {errors.image[0]}
                          </p>
                        )}
                      </div>
                    </form>
                  </div>

                </div>
                 </div>
            </div>

            <div className="px-4 my-4 text-lg font-semibold bg-gray-100 h-16 flex items-center justify-between shadow-md rounded-lg">
              <span className="text-gray-800">
                Previously uploaded files
              </span>
              <div className="w-1/4">
                <div className="flex items-center">
                  <input
                    type="text"
                    className=" border border-gray-300 rounded-l-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search for..."
                  />
                  <button className="bg-[#28DEFC] text-white rounded-r-md py-2 px-4 transition duration-200 hover:bg-[#28DEFC]">
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="mx-4">
              <div className="w-full mb-3">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {images.slice(3).map((image) => (
              <div
                key={image.id} // Use image.id as key
                className={`relative bg-white shadow-md h-52 w-full cursor-pointer transition duration-200 ${
                  selectedTopIndex === image.id ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleImageSelect(image.id , images)} // Pass image.id to handleImageSelect
              >
                <img
                  src={`https://admin.ezicalc.com/public/storage/product/${image.name}`}
                  alt="img"
                  className="h-full w-full object-cover"
                />
                <div className="absolute w-full py-1 px-3 bottom-0 bg-white shadow-md text-sm">
                  Image Name
                  <div className="text-sm">jpeg</div>
                </div>
                {selectedTopIndex === image.id && (
                  <div className="absolute flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full top-2 right-2">
                    ✓
                  </div>
                )}
              </div>
            ))}

                </div>


              </div>
            </div>
          </div>

          <div className="flex-grow flex items-end justify-center">
            <button
              type="submit"
              onClick={toggleDrawer}
              className="bg-[#28DEFC] text-white px-4 py-2 rounded w-80"
            >
              Select
            </button>
          </div>
        </div>
      </div>



    </div>
  )
}