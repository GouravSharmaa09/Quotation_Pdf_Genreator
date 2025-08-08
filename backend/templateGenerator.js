/**
 * Generates an HTML template for the quotation
 * @param {Object} data - The form data for the quotation
 * @returns {string} - The HTML template as a string
 */
export function generateTemplate(data) {
  // Calculate financial values
  const subtotal = data.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  const gst = (subtotal * data.gstRate) / 100;
  const discountPercentage = parseFloat(data.discountPercentage) || 0;
  const discountAmount = (subtotal * discountPercentage) / 100;
  const total = subtotal + gst - discountAmount;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Generate the HTML template
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quotation - ${data.quotationNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          font-size: 12px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .company-info h1 {
          color: #4f46e5;
          margin: 0 0 5px 0;
          font-size: 24px;
        }
        
        .company-info p {
          margin: 2px 0;
          color: #666;
        }
        
        .quotation-info {
          text-align: right;
        }
        
        .quotation-info h2 {
          color: #4f46e5;
          margin: 0 0 10px 0;
          font-size: 18px;
        }
        
        .quotation-info p {
          margin: 2px 0;
        }
        
        .client-info {
          margin-bottom: 30px;
        }
        
        .client-info h3 {
          color: #4f46e5;
          margin: 0 0 10px 0;
          font-size: 16px;
        }
        
        .client-info p {
          margin: 2px 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        th {
          background-color: #f9fafb;
          text-align: left;
          padding: 10px;
          font-weight: 600;
          border-bottom: 2px solid #eaeaea;
        }
        
        td {
          padding: 10px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .item-name {
          font-weight: 500;
        }
        
        .item-description {
          color: #666;
          font-size: 11px;
        }
        
        .text-right {
          text-align: right;
        }
        
        .summary {
          margin-left: auto;
          width: 300px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        
        .summary-row.total {
          font-weight: 700;
          font-size: 14px;
          border-top: 2px solid #eaeaea;
          padding-top: 10px;
          margin-top: 5px;
        }
        
        .terms {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
        }
        
        .terms h3 {
          color: #4f46e5;
          margin: 0 0 10px 0;
          font-size: 16px;
        }
        
        .signature {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
        }
        
        .signature-box {
          width: 40%;
        }
        
        .signature-line {
          border-top: 1px solid #333;
          margin-top: 70px;
          padding-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header with Company and Quotation Info -->
        <div class="header">
          <div class="company-info">
            <h1>${data.companyName}</h1>
            <p>${data.companyAddress}</p>
            <p>Email: ${data.companyEmail}</p>
            <p>Phone: ${data.companyPhone}</p>
            ${data.companyGstin ? `<p>GSTIN: ${data.companyGstin}</p>` : ''}
          </div>
          <div class="quotation-info">
            <h2>QUOTATION</h2>
            <p><strong>Number:</strong> ${data.quotationNumber}</p>
            <p><strong>Date:</strong> ${new Date(data.quotationDate).toLocaleDateString()}</p>
            <p><strong>Valid Until:</strong> ${new Date(data.validUntil).toLocaleDateString()}</p>
          </div>
        </div>
        
        <!-- Client Information -->
        <div class="client-info">
          <h3>CLIENT INFORMATION</h3>
          <p><strong>Name:</strong> ${data.clientName}</p>
          ${data.clientCompany ? `<p><strong>Company:</strong> ${data.clientCompany}</p>` : ''}
          <p><strong>Email:</strong> ${data.clientEmail}</p>
          ${data.clientPhone ? `<p><strong>Phone:</strong> ${data.clientPhone}</p>` : ''}
          ${data.clientGstin ? `<p><strong>GSTIN:</strong> ${data.clientGstin}</p>` : ''}
        </div>
        
        <!-- Items Table -->
        <table>
          <thead>
            <tr>
              <th width="5%">No.</th>
              <th width="40%">Item</th>
              <th width="15%">Quantity</th>
              <th width="20%">Rate</th>
              <th width="20%">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>
                  <div class="item-name">${item.name}</div>
                  ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                </td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.rate)}</td>
                <td class="text-right">${formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Summary -->
        <div class="summary">
          <div class="summary-row">
            <div>Subtotal:</div>
            <div>${formatCurrency(subtotal)}</div>
          </div>
          <div class="summary-row">
            <div>GST (${data.gstRate}%):</div>
            <div>${formatCurrency(gst)}</div>
          </div>
          <div class="summary-row">
            <span>Discount (${data.discountPercentage}%)</span>
            <span>${formatCurrency(discountAmount)}</span>
          </div>
          <div class="summary-row total">
            <div>Total:</div>
            <div>${formatCurrency(total)}</div>
          </div>
        </div>
        
        <!-- Terms and Conditions -->
        <div class="terms">
          <h3>TERMS & CONDITIONS</h3>
          <p>${data.terms || 'Net 30 days. Please make payment within 30 days of receiving this quotation.'}</p>
          <p>This is a quotation on the goods/services named, subject to the conditions noted below.</p>
          <p>The prices quoted are valid until the date mentioned above.</p>
        </div>
        
        <!-- Service and Warranty -->
        <div class="terms">
          <h3>SERVICE AND WARRANTY</h3>
          <p><strong>Description:</strong> ${data.serviceWarranty.description}</p>
          <p><strong>Duration:</strong> ${data.serviceWarranty.duration}</p>
          <p><strong>Conditions:</strong> ${data.serviceWarranty.conditions}</p>
        </div>
        
        <!-- Signature -->
        <div class="signature">
          <div class="signature-box">
            <div class="signature-line">Authorized Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Client Acceptance (sign above)</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}