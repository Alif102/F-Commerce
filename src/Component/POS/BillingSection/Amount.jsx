import React from 'react';

const Amount = ({ deliveryCharge = '0', totalPrice = '0' }) => {
  // Convert deliveryCharge and totalPrice to numbers, setting them to 0 if they are invalid
  const deliveryChargeNum = Number(deliveryCharge) || 0;
  const totalPriceNum = Number(totalPrice) || 0;
  
  // Calculate the subtotal
  const subtotal = deliveryChargeNum + totalPriceNum;

  return (
    <div>
      <div className='md:mt-2 mb-5 mt-0'>
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400 '>Delivery Charge</h1>
          <h1 className='text-gray-400 text-[14px]'>
            <span className='text-[15px] md:text-[12px]'>৳</span> {deliveryChargeNum}
          </h1>
        </div>
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400 '>Order Price</h1>
          <h1 className='text-gray-400 text-[14px]'>
            <span className='text-[15px] md:text-[12px]'>৳</span> {totalPriceNum}
          </h1>
        </div>
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400 '>Discount</h1>
          <h1 className='text-gray-400 text-[14px]'>
            <span className='text-[15px] md:text-[12px]'>৳</span> 0
          </h1>
        </div>
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400 '>Advance</h1>
          <h1 className='text-gray-400 text-[14px]'>
            <span className='text-[15px] md:text-[12px]'>৳</span> 0
          </h1>
        </div>
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400 '>Due</h1>
          <h1 className='text-gray-400 text-[14px]'>
            <span className='text-[15px] md:text-[12px]'>৳</span> 0
          </h1>
        </div>
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-500 '>Subtotal</h1>
          <h1 className='text-gray-500 text-[14px]'>
            <span className='text-[15px] md:text-[12px]'>৳</span> {subtotal}
          </h1>
        </div>
        <div className='fixed bottom-0 left-5 w-[91%] rounded-lg px-2 py-3 text-white bg-[#28DEFC] flex justify-between items-center md:static md:w-auto md:py-2'>
          <h1 className='text-[14px] md:text-[12px] font-semibold'>Complete Order</h1>
          <h1 className='text-[14px]'>
            <span className='text-[15px] md:text-[12px]'>৳</span> {subtotal}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Amount;
