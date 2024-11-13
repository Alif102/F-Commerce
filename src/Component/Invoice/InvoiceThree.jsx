export function InvoiceThree({ order, sampleImage }) {
  const hasLargeOrder = (order?.order_products?.length || 0) + (order?.order_variable_products?.length || 0) >= 5;
  const paddingClass = hasLargeOrder ? 'p-8' : 'p-4'; // Adjust padding based on the order size
  const marginClass = hasLargeOrder ? 'm-6' : 'm-2'; // Adjust margin based on the order size

  return (
    `<div class="max-w-5xl mx-auto ${marginClass} bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-2xl border border-gray-200">
      <div class="bg-blue-200 ${paddingClass} flex justify-between items-center shadow-md rounded-t-xl">
        <div>
          ${order.business.logo
    ? `<img src="https://admin.ezicalc.com/public/storage/business/logo/${order.business.logo}"
       class="w-[60%] h-20 object-cover mt-4 rounded-lg" />`
    : `<img src=${sampleImage} />`}
          <h2 class="text-xl font-bold">Business Address: ${order.address}</h2>
          <p class="text-sm">Customer Phone: ${order.c_phone}</p>
        </div>
        <div class="text-right">
          <h1 class="text-5xl font-extrabold text-blue-800">Invoice</h1>
          <p class="text-base">Shop Address: ${order.business.address}</p>
          <p class="text-base">Invoice Date: ${formatDate(order.created_at)}</p>
          <p class="text-base">Delivery Method: ${order.courier}</p>
          <p class="text-base">Payment Method: ${order.payment_method || 'Cash'}</p>
        </div>
      </div>
      
      <div class="border-t-1 border-blue-300"></div>

      <div>
        <table class="w-full border-collapse text-sm shadow-lg">
          <thead class="bg-blue-300 text-white">
            <tr class="text-center">
              <th class="border-b-2 border-blue-400">Image</th>
              <th class="border-b-2 border-blue-400">Product Name</th>
              <th class="border-b-2 border-blue-400">Size</th>
              <th class="border-b-2 border-blue-400">Price</th>
              <th class="border-b-2 border-blue-400">Quantity</th>
              <th class="border-b-2 border-blue-400">Total</th>
            </tr>
          </thead>
          <tbody class="text-center bg-white">
            ${order?.order_products?.map(
              (product, index) => `
              <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50">
                <td class="border-b border-gray-200">
                  <img src="https://admin.ezicalc.com/public/storage/product/${product.image}" class="w-10 h-10 object-cover rounded-lg" alt="${product.name}" />
                </td>
                <td class="border-b border-gray-200">${product.name}</td>
                <td class="border-b border-gray-200">N/A</td>
                <td class="border-b border-gray-200"><span class="text-xl">৳</span> ${product.price.toFixed(2)}  <span class=" font-bold text-xl"> ৳ </span></td>
                <td class="border-b border-gray-200">${order.s_product_qty || ''}, ${order.v_product_qty || ''}</td>
                <td class="border-b border-gray-200"><span class="text-xl">৳</span> ${order.cod_amount.toFixed(2)}  <span class=" font-bold text-xl"> ৳ </span></td>
              </tr>`
            ).join('')}
            ${order?.order_variable_products?.map(
              (product, index) => `
              <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50">
                <td class="border-b border-gray-200">
                  <img src="https://admin.ezicalc.com/public/storage/product/${product.product.image}" class="w-10 h-10 object-cover rounded-lg" alt="${product.product.name}" />
                </td>
                <td class="border-b border-gray-200">${product.product.name}</td>
                <td class="border-b border-gray-200">${product.values}</td>
                <td class="border-b border-gray-200"><span class="text-xl">৳</span> ${product.price.toFixed(2)}</td>
                <td class="border-b border-gray-200">${order.s_product_qty || ''}, ${order.v_product_qty || ''}</td>
                <td class="border-b border-gray-200"><span class="text-xl">৳</span> ${product.price.toFixed(2)}</td>
              </tr>`
            ).join('')}
          </tbody>
        </table>
      </div>

      <div class="border-t-4 border-blue-300"></div>

      <div class="text-right space-y-3 text-gray-700 ${paddingClass}">

        ${order.item_total ? `<p>item_totald Paid: $${order.advance.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        ${order.advance ? `<p>Advanced Paid: $${order.advance.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        ${order.delivery_charge ? `<p>Delivery Charge: <span class="text-xl"> <span class=" font-bold text-xl"> ৳ </span></span> ${order.delivery_charge.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        ${order.discount_amount ? `<p>Discount Amount: <span class="text-xl"> <span class=" font-bold text-xl"> ৳ </span></span> ${order.discount_amount.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        ${order.cod_amount ? `<p class="text-xl">Payable Amount: <span class="text-xl"> <span class=" font-bold text-xl"> ৳ </span></span> ${order.cod_amount.toFixed(2)} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
      </div>
   
      
      <div class="bg-blue-200 text-center text-sm text-gray-800 shadow-inner rounded-b-xl ${paddingClass}">
        <p class="font-semibold">Terms & Conditions:</p>
        <p>Orders may be canceled by the Customer within 3 days of order placement for a full refund.</p>
        <p class="font-medium">Thank you for your business!</p>
      </div>
    </div>`
  );
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}
