import React, { useRef } from 'react';
import { FaShopify } from 'react-icons/fa';
import sampleImage from '../../assets/unnamed.png';

const InvoiceModal = ({ order, onClose }) => {
  const printRef = useRef();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  const handlePrint = () => {
    window.print(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-[50%]">
        <div id="printable-section" className="p-6 max-w-4xl mx-auto" ref={printRef}>
          {/* Invoice content */}
          <div className="flex justify-between">
            <div>
              <img src={sampleImage} alt="Company Logo" className="w-20 h-20 object-cover mb-4" />
              <h1 className="pb-2 mb-1">Customer Nameeeee: {order.c_name}</h1>
              <h1 className="pb-2 mb-1">Business Address: {order.address}</h1>
              <h1 className="pb-2 mb-1">Customer Phone: {order.c_phone}</h1>
            </div>
            <div>
              <h1 className="flex items-center">
                <FaShopify /> Shop Address
              </h1>
              <h1 className="text-3xl font-bold pb-2 mb-1">Invoice</h1>
              <h1 className="pb-2 mb-1">Invoice Date: {formatDate(order.created_at)}</h1>
              <h1 className="pb-2 mb-1">Delivery Method: {order.courier}</h1>
              <h1 className="pb-2 mb-1">Payment Method: {order.payment_method || 'Cash'}</h1>
            </div>
          </div>

          <div className="mb-6">
            <table className="w-full table border-collapse">
              <thead className="text-gray-600 bg-[#EFEFEF]">
                <tr className="text-center">
                  <th className="px-3 py-2">Image</th>
                  <th className="px-2 py-2">Product Name</th>
                  <th className="px-2 py-2">Size</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Quantity</th>
                  <th className="px-2 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {order?.order_products?.map((product, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2">
                      <img
                        src={`https://admin.ezicalc.com/public/storage/product/${product.image}`}
                        className="w-20 h-20 object-cover rounded-lg"
                        alt={product.name}
                      />
                    </td>
                    <td className="px-2 py-2">{product.name}</td>
                    <td className="px-2 py-2">N/A</td>
                    <td className="px-2 py-2">{product.price}</td>
                    <td className="px-2 py-2">
                      {order.s_product_qty || ''}, {order.v_product_qty || ''}
                    </td>
                    <td className="px-3 py-2">{order.cod_amount}</td>
                  </tr>
                ))}

                {order?.order_variable_products?.map((product, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2">
                      <img
                        src={`https://admin.ezicalc.com/public/storage/product/${product.product.image}`}
                        className="w-20 h-20 object-cover rounded-lg"
                        alt={product.product.name}
                      />
                    </td>
                    <td className="px-2 py-2">{product.product.name}</td>
                    <td className="px-2 py-2">{product.values}</td>
                    <td className="px-2 py-2">{product.price}</td>
                    <td className="px-2 py-2">
                      {order.s_product_qty || ''}, {order.v_product_qty || ''}
                    </td>
                    <td className="px-3 py-2">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            {order.cod_amount && <p>Total Amount: {order.cod_amount}</p>}
            <div className="flex justify-end">
              {order.advance && <p>Advanced Paid: {order.advance}</p>}
              {order.delivery_charge && <p>Delivery Charge: {order.delivery_charge}</p>}
              {order.discount_amount && <p>Discount Amount: {order.discount_amount}</p>}
            </div>
            <div className="text-center text-sm text-gray-600 mt-6">
              <h1>
                Terms & Condition: <br />
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </h1>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 mt-6">
            Thank you for your business!
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <button onClick={handlePrint} className="bg-green-500 font-semibold text-white px-4 py-2 rounded">
            Print
          </button>
          <button onClick={onClose} className="bg-red-400 font-semibold text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
