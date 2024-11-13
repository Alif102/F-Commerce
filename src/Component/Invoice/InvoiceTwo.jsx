// InvoiceContent.js

export function InvoiceTwo({ order, sampleImage }) {
  const formatInvoiceNumber = () => {
    const nameParts = order.business.name.split(' ');
    const initials = nameParts.slice(0, 4).map(word => word.charAt(0)).join('');
    return `${initials}${order.id}`;
  };
  return (
    `<div class="p-8 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div class="flex justify-between items-start mb-8">
       <div class="space-y-2">

  ${order.business.logo
      ? `<img src="https://admin.ezicalc.com/public/storage/business/logo/${order.business.logo}"
       class="w-[100%] h-24 object-cover mt-4 rounded-lg" />`
      : `<img src=${sampleImage}`}
</div>

        <div class="text-right space-y-2">
        
          <h2 class="text-sm text-gray-800">Invoice : <span class='font-semibold'> ${formatInvoiceNumber()}</span></h2>
          <p class="text-sm"><strong>Invoice Date:</strong> ${formatDate(order.created_at)}</p>
            <h1 class=" w-60 text-sm">
           <strong>Office Adress :</strong> ${order?.business.address || 'Shop Address'}
          </h1>
<p class="text-sm"><strong>Delivery Method:</strong> ${order.courier}</p>
<p class="text-sm"><strong>Payment Method:</strong> ${order.payment_method || 'Cash'}</p>

        </div>
      </div>

      <div class="grid grid-cols-2 gap-12 mb-8">
        <div class="space-y-2">
          <div class="bg-gradient-to-r from-blue-500 to-green-400 p-2 rounded-md">
            <h2 class="text-xl font-bold text-white">INVOICE</h2>
          </div>
          <div class="text-sm mt-4">
            <p>Invoice to:</p>
            <p class="font-semibold">Customer Name: ${order.c_name}</p>
            <p><strong>Business Address:</strong> ${order.address}</p>
            <p><strong>Customer Phone:</strong> ${order.c_phone}</p>
          </div>
        </div>
        <div class="text-right space-y-2">
          <div class="bg-gradient-to-r from-blue-500 to-green-400 p-2 rounded-md text-white">
            <h2 class="text-xl font-bold"> ${order?.business.name}</h2>
          </div>
          <div class="text-sm mt-4">
            <p>Date: <span class="font-semibold">${formatDate(order.created_at)}</span></p>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <table class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
          <thead class="bg-gray-200 text-gray-700">
            <tr class="text-center">
              <th class="px-3 py-2">Image</th>
              <th class="px-3 py-2">Product Name</th>
              <th class="px-3 py-2">Size</th>
              <th class="px-3 py-2">Price</th>
              <th class="px-3 py-2">Quantity</th>
              <th class="px-3 py-2">Total</th>
            </tr>
          </thead>
          <tbody class="text-center bg-white divide-y divide-gray-200">
            ${order?.order_products?.map(
        (product) => `
              <tr class="hover:bg-gray-50">
                <td class="px-3 py-2">
                  <img src="https://admin.ezicalc.com/public/storage/product/${product.image}" class="w-20 h-20 object-cover rounded-lg" alt="${product.name}" />
                </td>
                <td class="px-3 py-2">${product.name}</td>
                <td class="px-3 py-2">N/A</td>
                <td class="px-3 py-2">${product.price}</td>
                <td class="px-3 py-2">${order.s_product_qty || ''}, ${order.v_product_qty || ''}</td>
                <td class="px-3 py-2">${order.cod_amount}</td>
              </tr>`
      ).join('')}
            ${order?.order_variable_products?.map(
        (product) => `
              <tr class="hover:bg-gray-50">
                <td class="px-3 py-2">
                  <img src="https://admin.ezicalc.com/public/storage/product/${product.product.image}" class="w-20 h-20 object-cover rounded-lg" alt="${product.product.name}" />
                </td>
                <td class="px-3 py-2">${product.product.name}</td>
                <td class="px-3 py-2">${product.values}</td>
                <td class="px-3 py-2">${product.price}</td>
                <td class="px-3 py-2">${order.s_product_qty || ''}, ${order.v_product_qty || ''}</td>
                <td class="px-3 py-2">${product.price}</td>
              </tr>`
      ).join('')}
          </tbody>
        </table>
      </div>

      <div class="bg-gray-100 p-4 rounded-lg space-y-2">
       
        <div class="flex flex-col items-end space-y-3">
          ${order.item_total ? `<p class="text-sm"><strong>Total Price: </strong> ${order.item_total} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
          ${order.advance ? `<p class="text-sm"><strong>Advanced Paid:  </strong> ${order.advance} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
          ${order.delivery_charge ? `<p class="text-sm"><strong>Delivery Charge: </strong> ${order.delivery_charge} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
          ${order.discount_amount ? `<p class="text-sm"><strong> Discount Amount:</strong> ${order.discount_amount} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        </div>
         ${order.cod_amount ? `<p class="text-right font-semibold">Payable Amount: ${order.cod_amount} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
      </div>

      <div class="text-center text-sm text-gray-600 mt-3">
        <h1>Terms & Condition:<br/>Orders may be canceled by the Customer within 3 days of order placement for a full refund</h1>
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
