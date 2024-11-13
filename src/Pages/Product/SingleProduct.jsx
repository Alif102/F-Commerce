import React from 'react'
import shoee from '../../assets/shoee.jfif'
import { FaBackward } from 'react-icons/fa'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
const SingleProduct = () => {


    const navigate = useNavigate();
    const location = useLocation();
    const { product } = location.state || {}; 

    const handleGoBack = () => {
        navigate(-1); // This will navigate back to the previous URL
    };


    const hasVariations = product?.variation_combinations && product.variation_combinations.length > 0;


    console.log(product);
    return (
        <div>


            <div className='w-[13%] my-5 mx-auto'>

                <div >
                    <img className='mb-2' src={`https://admin.ezicalc.com/public/storage/product/${product.image}`} alt="s" />

                </div>
                <div >
                    <h1 >Name : {product.name}</h1>
                    <h1  >Category : {product.category.name}</h1>
                </div>

            </div>




          {/* for single product  */}

          {!hasVariations ? (

            <div className=' flex  gap-6'>

                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" >Stock :  {product.stock}</h1>
                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" >Code : {product.code}</h1>
                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" > price : {product.price ?? 'n/a'}</h1>

                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" > Discount : {product.discount_amount ?? 'n/a'}</h1>
                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" > Discount date : {product.discount_date}</h1>

            </div>

            ) : null}


          {/* end single product  */}


          {/* for variable product  */}


          {hasVariations && (


            <div className=' mt-16 mb-5'>
                <h1 className=' font-bold text-2xl'>Variation & Value</h1>


                {product.variation_combinations.map((variation) => (
                            <div className=' flex mb-6  gap-6'>
                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" > Variation : {variation.values}</h1>

                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" >Stock :  {variation.stock}</h1>
                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" >Code : {variation.code}</h1>
                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" > price : {variation.price ?? 'n/a'}</h1>

                <h1 className=" shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-2" > Discount : {variation.discount?? 'n/a'}</h1>

                            </div>



                      ))}

                         
                   


            </div>
               )}

          {/* for variable product  */}   

            <div className=' flex justify-end'>



                <button onClick={handleGoBack} className=' shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px] font-semibold rounded-lg mt-4  px-3 py-2 flex gap-3'><FaBackward size={25} /> Go Back </button>
            </div>



        </div>
    )
}

export default SingleProduct