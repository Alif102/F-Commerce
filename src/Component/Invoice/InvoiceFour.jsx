

export function InvoiceFour({ order, sampleImage }) {
  return (
    `    <div class="p-8 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
    <div class=' bg-gray-100 px-4 py-1 rounded-md'>
       
        <div class=' flex justify-between items-center'>
           <div>
            <h1 class=' font-bold text-2xl'>Invoice : AF-00001054</h1>
            <h1>Invoice Date: ${formatDate(order.created_at)}</h1></div>
           <div>
            ${order.business.logo
    ? `<img src="https://admin.ezicalc.com/public/storage/business/logo/${order.business.logo}"
    class="w-[50%] h-20   object-cover mt-4 rounded-lg" />`
 : `<img src=${sampleImage}`}

 </div>
        </div>

        </div>
    
      <div class="grid grid-cols-2 gap-12 mb-8">
        <div class="space-y-2">
          
          <div class="text-sm mt-4">
            <p>Invoice to:</p>
            <p class="font-semibold">Customer Name: ${order.c_name}</p>
            <p>Business Address: ${order.address}</p>
            <p>Customer Phone: ${order.c_phone}</p>
          </div>
        </div>
        <div class="text-right space-y-2">
        
 
          <div class="text-right space-y-2">
          
                   <h1 class="text-2xl font-bold text-gray-800"> ${order?.business.name}<span class="text-yellow-500">.</span></h1>

            <p>Date: <span class="font-semibold">${formatDate(order.created_at)}</span></p>
          <p class="text-sm">Delivery Method: ${order.courier}</p>
          <p class="text-sm">Payment Method: ${order.payment_method || 'Cash'}</p>
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
                <td class="px-3 py-2">${product.price}  <span class=" font-bold text-xl"> ৳ </span></td>
                <td class="px-3 py-2">${order.s_product_qty || ''}, ${order.v_product_qty || ''}</td>
                <td class="px-3 py-2">${order.cod_amount}  <span class=" font-bold text-xl"> ৳ </span></td>
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
              
              </tr>`
            ).join('')}
          </tbody>
        </table>
      </div>

      <div class="bg-gray-100 p-4 rounded-lg space-y-2">
        <div class="flex justify-end space-x-4">
          ${order.item_total ? `<p class="text-sm">Total Amount: ${order.item_total} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
          ${order.advance ? `<p class="text-sm">Advanced Paid: ${order.advance}</p>` : ''}
          ${order.delivery_charge ? `<p class="text-sm">Delivery Charge: ${order.delivery_charge} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
          ${order.discount_amount ? `<p class="text-sm">Discount Amount: ${order.discount_amount} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}
        </div>
                ${order.cod_amount ? `<p class="text-right font-semibold">Pyable Amount: ${order.cod_amount} <span class=" font-bold text-xl"> ৳ </span></p>` : ''}

      </div>

      <div class="text-center text-sm text-gray-600 mt-3">
        <h1>Terms & Condition:<br/> <p>Orders may be canceled by the Customer within 3 days of order placement for a full refund.</p>
</h1>
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
