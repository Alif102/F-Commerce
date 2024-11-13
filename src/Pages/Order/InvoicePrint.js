import sampleImage from '../../assets/unnamed.png';
import { InvoiceFour } from '../../Component/Invoice/InvoiceFour';
import { InvoiceThree } from '../../Component/Invoice/InvoiceThree';
import { InvoiceTwo } from '../../Component/Invoice/InvoiceTwo';
import { InvoiceContent } from './InvoiceContent'; // Import the new component

export function printInvoice(order) {

  console.log(order.business.business_invoice.invoice_nbr)

  const printWindow = window.open('', '_blank', ''); // Open a new blank tab/window
  printWindow.document.write('<html><head><title>Invoice</title>');

  // Add Tailwind CSS for styling
  printWindow.document.write(`
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  `);

  printWindow.document.write('</head><body>');



  if (order.business.business_invoice.invoice_nbr == null) {
    printWindow.document.write(InvoiceContent({ order, sampleImage }));
  } else {
    switch (order.business.business_invoice.invoice_nbr) {
      case 1:
        printWindow.document.write(InvoiceContent({ order, sampleImage }));
        break;
      case 2:
        printWindow.document.write(InvoiceTwo({ order, sampleImage }));
        break;
      case 3:
        printWindow.document.write(InvoiceThree({ order, sampleImage }));
        break;
      case 4:
        printWindow.document.write(InvoiceFour({ order, sampleImage }));
        break;
      default:
        console.error("Invalid invoice number");
        break;
    }
  }
  
 

  printWindow.document.write('</body></html>');
  printWindow.document.close(); 

  printWindow.onload = () => {
    printWindow.focus(); // Focus on the new window
  };
}
