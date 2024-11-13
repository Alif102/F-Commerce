// InvoiceContent.js
import { FaShopify } from 'react-icons/fa';

export function InvoiceContent({ order, sampleImage }) {

  const formatInvoiceNumber = () => {
    const nameParts = order.business.name.split(' ');
    const initials = nameParts.slice(0, 4).map(word => word.charAt(0)).join('');
    return `${initials}${order.id}`;
  };
  return (
    `<div class="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
    <div class='flex justify-between items-center bg-gray-300 py-2 px-5'>
   <div>
    Invoice Number : <span class='font-semibold'> ${formatInvoiceNumber()}</span>
              <p class="text-sm mb-1">Invoice Date: <span class='font-semibold'> ${formatDate(order.created_at)} </span></p>

   </div>
 ${order.business.logo
      ? `<img src="https://admin.ezicalc.com/public/storage/business/logo/${order.business.logo}"
       class="w-[60%] h-24 object-cover mt-4 rounded-lg" />`
      : `<img src=${sampleImage}`}
    </div>
      <div class="bg-gray-100 p-4 rounded-t-lg flex justify-between items-center">
        <div>
          
          <h2 class="text-lg font-semibold mb-2">Business Address: ${order.address}</h2>
          <p class="text-sm font-semibold">Customer Phone: ${order.c_phone}</p>
        </div>
        <div class="text-right">
          <h1 class="text-4xl font-bold text-gray-700 mb-2">Invoice</h1>
          <p class="text-sm mb-1">Shop Address: ${order.business.address}</p>
          <p class="text-sm mb-1">Delivery Method: ${order.courier}</p>
          <p class="text-sm">Payment Method: ${order.payment_method || 'Cash'}</p>
        </div>
      </div>
      
      <div class="border-t border-gray-200 mt-4 mb-6"></div>

      <div class="mb-6">
        <table class="w-full border-collapse text-sm">
          <thead class="bg-gray-200">
            <tr class="text-center">
              <th class="px-3 py-2 border-b">Image</th>
              <th class="px-2 py-2 border-b">Product Name</th>
              <th class="px-2 py-2 border-b">Size</th>
              <th class="px-2 py-2 border-b">Price</th>
              <th class="px-2 py-2 border-b">Quantity</th>
              <th class="px-2 py-2 border-b">Total</th>
            </tr>
          </thead>
          <tbody class="text-center">
            ${order?.order_products?.map(
              (product) => `
              <tr class="hover:bg-gray-50">
                <td class="px-2 py-2 border-b">
                  <img src="https://admin.ezicalc.com/public/storage/product/${product.image}" class="w-20 h-20 object-cover rounded-lg" alt="${product.name}" />
                </td>
                <td class="px-2 py-2 border-b">${product.name}</td>
                <td class="px-2 py-2 border-b">N/A</td>
                <td class="px-2 py-2 border-b">${product.price.toFixed(2)}  <span class=" font-bold text-xl"> ৳ </span></td>
                <td class="px-2 py-2 border-b">${order.s_product_qty || ''}, ${order.v_product_qty || ''}</td>
                <td class="px-3 py-2 border-b">${order.cod_amount.toFixed(2)}  <span class=" font-bold text-xl"> ৳ </span></td>
              </tr>`
            ).join('')}
            ${order?.order_variable_products?.map(
              (product) => `
              <tr class="hover:bg-gray-50">
                <td class="px-2 py-2 border-b">
                  <img src="https://admin.ezicalc.com/public/storage/product/${product.product.image}" class="w-20 h-20 object-cover rounded-lg" alt="${product.product.name}" />
                </td>
                <td class="px-2 py-2 border-b">${product.product.name}</td>
                <td class="px-2 py-2 border-b">${product.values}</td>
                <td class="px-2 py-2 border-b">${product.price.toFixed(2)}  <span class=" font-bold text-xl"> ৳ </span></td>
                <td class="px-2 py-2 border-b">${order.s_product_qty || ''}, ${order.v_product_qty || ''}</td>
                <td class="px-3 py-2 border-b">${product.price.toFixed(2)}  <span class=" font-bold text-xl"> ৳ </span></td>
              </tr>`
            ).join('')}
          </tbody>
        </table>
      </div>

      <div class="border-t border-gray-200 mt-4 mb-6"></div>

      <div class="text-right space-y-2">
        ${order.item_total ? `<p>Advanced Paid: ${order.item_total.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        ${order.advance ? `<p>Advanced Paid: ${order.advance.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        ${order.delivery_charge ? `<p>Delivery Charge: ${order.delivery_charge.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        ${order.discount_amount ? `<p>Discount Amount: ${order.discount_amount.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        ${order.cod_amount ? `<p class="text-lg font-semibold">Total Amount: ${order.cod_amount.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}

      </div>
      
      <div class="bg-gray-100 p-4 mt-6 rounded-b-lg text-center text-sm text-gray-600">
        <p>Terms & Condition:</p>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        <p class="mt-4">Thank you for your business!</p>
      </div>
    </div>`
  );
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}
